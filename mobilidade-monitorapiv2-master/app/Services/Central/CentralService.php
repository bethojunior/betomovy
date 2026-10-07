<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/06/2019
 * Time: 09:50
 */

namespace App\Services\Central;


use App\Constants\Balance\BalanceFlowConst;
use App\Constants\Central\CentralConst;
use App\Constants\StatusConst;
use App\Constants\Users\DriverConst;
use App\Constants\Users\PartnerRegisterStatusConst;
use App\Constants\Users\UserTypeConst;
use App\Exceptions\Central\CentralException;
use App\Models\Balance\Balance;
use App\Models\Central\Central;
use App\Models\Central\CentralDriver;
use App\Models\Central\CentralUser;
use App\Models\User\Customer;
use App\Models\User\LevelAccess;
use App\Models\User\User;
use App\Repositories\Balance\BalanceFlowRepository;
use App\Repositories\Balance\BalanceRepository;
use App\Repositories\Central\CentralCallTypeConfigRepository;
use App\Repositories\Central\CentralCustomerRepository;
use App\Repositories\Central\CentralRepository;
use App\Repositories\User\DriverRepository;
use App\Repositories\User\PartnerRepository;
use App\Repositories\User\UserRepository;
use Illuminate\Support\Facades\DB;
use phpDocumentor\Reflection\Types\Object_;

class CentralService
{
    /**
     * @var DriverRepository
     */
    private $driverRepository;
    /**
     * @var CentralRepository
     */
    private $centralRepository;
    /**
     * @var CentralCustomerRepository
     */
    private $centralCustomerRepository;
    /**
     * @var UserRepository
     */
    private $userRepository;
    /**
     * @var PartnerRepository
     */
    private $partnerRepository;
    /**
     * @var BalanceRepository
     */
    private $balanceRepository;
    /**
     * @var BalanceFlowRepository
     */
    private $balanceFlowRepository;

    private $centralCallTypeConfigRepository;

    public function __construct(CentralRepository         $centralRepository,
        DriverRepository          $driverRepository,
        CentralCustomerRepository $centralCustomerRepository,
        PartnerRepository         $partnerRepository,
        UserRepository            $userRepository,
        BalanceRepository         $balanceRepository,
        BalanceFlowRepository     $balanceFlowRepository,
                                CentralCallTypeConfigRepository $centralCallTypeConfigRepository)
    {
        $this->driverRepository = $driverRepository;
        $this->centralRepository = $centralRepository;
        $this->centralCustomerRepository = $centralCustomerRepository;
        $this->partnerRepository = $partnerRepository;
        $this->userRepository = $userRepository;
        $this->balanceRepository = $balanceRepository;
        $this->balanceFlowRepository = $balanceFlowRepository;
        $this->centralCallTypeConfigRepository = $centralCallTypeConfigRepository;
    }

    public function findAll(array $request)
    {
        return $this->centralRepository
            ->findAll($request);
    }

    public function store(array $request)
    {
        try {
            \DB::beginTransaction();

            if (isset($request['user'])) {
                $user = $this->createUser($request['user']);
            } else {
                $user = $this->userRepository->find($request['responsibleId']);

                if (!$user || !$this->userRepository->isEligibleForCentral($user->idUser)) {
                    throw new CentralException("Usuário selecionado não pode ser vinculado à central");
                }

                $this->partnerRepository
                    ->firstOrCreate([
                        'userId' => $user->idUser,
                        'statusId' => StatusConst::ACTIVE
                    ], [
                        'partnerRegisterStatusId' => PartnerRegisterStatusConst::ACTIVE
                    ]);
            }

            $central = new Central($request);
            $central->responsibleId = $user->idUser;
            $central->save();

            if (isset($request['logo'])) {
                $pictureName = \Storage::cloud()
                    ->putFile(
                        CentralConst::LOGO_DIR . $central->id,
                        $request['logo'],
                        'public');

                if (!$pictureName)
                    throw new CentralException("Erro ao fazer upload da logo");

                $central->logo = $pictureName;
                $central->save();
            }

            $centralUser = new CentralUser;
            $centralUser->centralId = $central->id;
            $centralUser->userId = $user->idUser;
            $centralUser->save();

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollBack();

            if (strpos($e->getMessage(), 'DUPLICATE_EMAIL_USERTYPE') !== false) {
                throw new CentralException("Já existe um usuário ativo com esse e-mail para esse tipo de usuário");
            }

            throw $e;
        }

        return $central;
    }

    /**
     * @param Central $central
     * @param array $request
     * @return Central
     * @throws CentralException
     */
    public function update(Central $central, array $request)
    {
        \DB::beginTransaction();

        try {
            $central->name = $request['name'] ?? $central->name;
            $central->latitude = $request['latitude'] ?? $central->latitude;
            $central->longitude = $request['longitude'] ?? $central->longitude;
            $central->showAllPrices = $request['showAllPrices'] ?? $central->showAllPrices;
            $central->enableCustomRadiusCentral = $request['enableCustomRadiusCentral'] ?? $central->enableCustomRadiusCentral;
            $central->placesSearchRadius = $request['placesSearchRadius'] ?? $central->placesSearchRadius;

            $central->discount_type = $request['discount_type'] ?? null;
            $central->discount_value = intval($request['discount_value']) ?? null;

            $central->syncCustomers =
                isset($request['syncCustomers']) ?
                (!$request['syncCustomers'] ? false : true) :
                $central->syncCustomers;

            $central->centralCallDriver = $request['centralCallDriver'] ?? $central->centralCallDriver;
            $central->responsibleId = $request['responsibleId'] ?? $central->responsibleId;
            $central->address = $request['address'] ?? $central->address;

            if (isset($request['user'])) {
                $user = $this->createUser($request['user']);
                $central->responsibleId = $user->idUser;
            }

            $central->save();

            \DB::commit();

        } catch (CentralException $e) {
            \DB::rollBack();
            throw $e;
        }

        return $central;
    }

    /**
     * @param Central $central
     * @return Central
     */
    public function block(Central $central): Central
    {
        $central->active = 0;
        $central->save();

        return $central;
    }

    /**
     * @param Central $central
     * @return Central
     */
    public function activate(Central $central): Central
    {
        $central->active = 1;
        $central->save();

        return $central;
    }

    public function delete(Central $central): bool
    {
        DB::beginTransaction();
        try {
            $central->centralUsers->each(function (CentralUser $centralUser) {
                $centralUser->statusId = StatusConst::REMOVED;
                $centralUser->save();
            });

            $central->centralDrivers->each(function (CentralDriver $centralDriver) {
                $centralDriver->statusId = StatusConst::REMOVED;
                $centralDriver->save();
            });

            $central->responsible->statusId = StatusConst::REMOVED;
            $central->responsible->save();

            $central->statusId = StatusConst::REMOVED;
            $central->save();

            DB::commit();

            return true;
        } catch (\Exception $exception) {
            DB::rollBack();
            throw new \Exception($exception->getMessage());
        }
    }

    public function find($id)
    {
        $central = $this->centralRepository
            ->find($id);

        if (!$central)
            throw new CentralException("Central não encontrada");

        return $central;
    }

    public function findDrivers($centralId)
    {
        return $this->driverRepository
            ->findByCentral($centralId);
    }

    public function findCustomers($centralId, $request)
    {
        $request['document'] = isset($request['document']) ?
            onlyCharacters($request['document']) : null;

        $request['phone'] = isset($request['phone']) ?
            onlyCharacters($request['phone']) : null;

        return $this->centralCustomerRepository
            ->findByCentral($centralId, $request);
    }

    public function centralBalance(array $request)
    {
        $centralBalanceId = $this->centralRepository->verifyIfHaveBalanceId($request)->balanceId;

        if(is_null($centralBalanceId)) {
            $centralBalanceId = $this->balanceRepository->createBalance()->idBalance;

            if (!$centralBalanceId)
                throw new CentralException("Erro ao tentar criar uma balance");

            $updateCentral = $this->centralRepository->updateCentralBalanceId($centralBalanceId, $request['centralId']);

            if (!$updateCentral)
                throw new CentralException("Erro ao tentar atualizar central");
        }

        $balanceValue =  $this->balanceRepository->findById($centralBalanceId)->tripBalance;

        $insertOrRemove = $request['type'] == CentralConst::INSERT;

        $updateBalance = $this->balanceRepository->updateTripBalance($request['value'], $centralBalanceId, $insertOrRemove, $balanceValue);

        if(!$updateBalance)
            throw new CentralException("Erro ao tentar atualizar o voucher");

        $balanceType = $insertOrRemove ? BalanceFlowConst::VOUCHER_BONUS : BalanceFlowConst::VOUCHER_BLOCK;

        return $this->balanceFlowRepository->insert($request['value'], $balanceType, $centralBalanceId);
    }

    /**
     * @param array $request
     * @return User
     * @throws CentralException
     */
    private function createUser(array $request): User
    {
        $user = new User($request);
        $user->password = base64_encode($request['password']);
        $user->save();

        $balance = Balance::create();

        $customer = new Customer;
        $customer->userId = $user->idUser;
        $customer->balanceId = $balance->idBalance;
        $customer->save();

        $this->partnerRepository
            ->firstOrCreate([
                'userId' => $user->idUser,
                'statusId' => StatusConst::ACTIVE
            ], [
                'partnerRegisterStatusId' => PartnerRegisterStatusConst::ACTIVE
            ]);

        LevelAccess::create([
            'userId' => $user->idUser,
            'userTypeId' => UserTypeConst::CUSTOMER
        ]);

        return $user;
    }

    /**
     * @param array $request
     * @throws CentralException
     */
    private function validateUserRequest(array $request): void
    {
        if (isset($request['phone'])) {
            $userExists = $this->userRepository
                ->findByPhoneAndUserType($request['phone'], UserTypeConst::CUSTOMER);

            if ($userExists)
                throw new CentralException("Telefone já cadastrado");
        }
    }

    public function findAllCentralCallTypes()
    {
        return $this->centralCallTypeConfigRepository->findAllCentralCallTypes();
    }

    public function updateCentralCallTypes(array $data)
    {
        return $this->centralCallTypeConfigRepository->updateCentralCallTypes($data);
    }
}
