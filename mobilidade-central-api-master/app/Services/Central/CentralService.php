<?php

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/06/2019
 * Time: 09:50
 */

namespace App\Services\Central;


use App\Constants\Central\CentralConst;
use App\Constants\Notification\AdminNotificationTypeConst;
use App\Constants\StatusConst;
use App\Constants\Users\PartnerRegisterStatusConst;
use App\Constants\Users\UserTypeConst;
use App\Exceptions\Central\CentralException;
use App\Models\Balance\Balance;
use App\Models\Central\Central;
use App\Models\Central\CentralCustomer;
use App\Models\Central\CentralUser;
use App\Models\Notification\AdminNotification;
use App\Models\Notification\AdminNotificationType;
use App\Models\User\Customer;
use App\Models\User\User;
use App\Repositories\Balance\BalanceRepository;
use App\Repositories\Central\CentralCallTypeConfigRepository;
use App\Repositories\Central\CentralCustomerRepository;
use App\Repositories\Central\CentralDriverRepository;
use App\Repositories\Central\CentralRepository;
use App\Repositories\Notification\AdminNotificationTypeRepository;
use App\Repositories\User\DriverRepository;
use App\Repositories\User\PartnerRepository;
use App\Repositories\User\UserRepository;

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
     * @var AdminNotificationTypeRepository
     */
    private $adminNotificationTypeRepository;

    /**
     * @var CentralDriverRepository
     */
    private $centralDriverRepository;
    /**
     * @var CentralCallTypeConfigRepository
     */
    private $centralCallTypeConfigRepository;

    public function __construct(
        CentralRepository $centralRepository,
        DriverRepository $driverRepository,
        CentralCustomerRepository $centralCustomerRepository,
        UserRepository $userRepository,
        PartnerRepository $partnerRepository,
        AdminNotificationTypeRepository $adminNotificationTypeRepository,
        CentralDriverRepository $centralDriverRepository,
        CentralCallTypeConfigRepository $centralCallTypeConfigRepository
    ) {
        $this->driverRepository = $driverRepository;
        $this->centralRepository = $centralRepository;
        $this->centralCustomerRepository = $centralCustomerRepository;
        $this->userRepository = $userRepository;
        $this->partnerRepository = $partnerRepository;
        $this->adminNotificationTypeRepository = $adminNotificationTypeRepository;
        $this->centralDriverRepository = $centralDriverRepository;
        $this->centralCallTypeConfigRepository = $centralCallTypeConfigRepository;
    }

    public function find($id)
    {
        $central = $this->centralRepository
            ->find($id);

        if (!$central)
            throw new CentralException("Central não encontrada");

        return $central;
    }

    public function findByResponsible($id)
    {
        $balanceRepository = new BalanceRepository();

        $central = $this->centralRepository
            ->findByResponsible($id);

        if (!$central)
            throw new CentralException("Central não encontrada para o responsável {$id}");

        $balance = $balanceRepository->findById($central->balanceId);

        if (!$balance)
            throw new CentralException("Saldo não encontrado para a central {$central->id}");

        return $balance;
    }

    public function findDrivers($centralId)
    {
        return $this->driverRepository
            ->findByCentral($centralId);
    }

    public function findDriversActives($centralId, $filter = null)
    {
        return $this->centralDriverRepository
            ->findActivesPerCentral($centralId, $filter);
    }

    public function favoriteDriver($request, $user)
    {
        return $this->centralDriverRepository
            ->updateFavoriteDriver($request, $user);
    }

    public function findCustomers(Central $central, $request)
    {
        $request['document'] = isset($request['document']) ?
            onlyCharacters($request['document']) : null;

        $request['phone'] = isset($request['phone']) ?
            onlyCharacters($request['phone']) : null;

        return $this->centralCustomerRepository
            ->findByCentral($central, $request);
    }

    /**
     * @param array $request
     * @return Central
     * @throws \Exception
     */
    public function store(array $request): Central
    {
        try {
            \DB::beginTransaction();

            $appPartner = !empty($request['app_partner']) ? $request['app_partner'] : null;
            $user = $this->createUser($request['user'], $appPartner);

            $central = new Central($request);
            $central->responsibleId = $user->idUser;
            $central->key_app_partner = $appPartner;
            $central->save();

            if (isset($request['logo'])) {
                $pictureName = \Storage::disk('minio')
                    ->putFile(
                        CentralConst::LOGO_DIR . $central->id,
                        $request['logo'],
                        'public'
                    );

                if (!$pictureName)
                    throw new CentralException("Erro ao fazer upload da logo");

                $central->logo = $pictureName;
                $central->save();
            }

            $centralUser = new CentralUser;
            $centralUser->centralId = $central->id;
            $centralUser->userId = $user->idUser;
            $centralUser->save();

            $this->notifyAdmin($central, $user);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollBack();
            throw $e;
        }

        return $central;
    }

    public function findAllCentralCallTypes()
    {
        return $this->centralCallTypeConfigRepository->findAllCentralCallTypes();
    }

    /**
     * @param array $request
     * @return User
     * @throws CentralException
     */
    private function createUser(array $request, $keyAppPartner = null): User
    {

        $user = new User($request);
        $user->password = base64_encode($request['password']);
        $user->key_app_partner = $keyAppPartner;
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

        return $user;
    }


    /**
     * @param Central $central
     * @param User $user
     * @return AdminNotification
     */
    private function notifyAdmin(Central $central, User $user): AdminNotification
    {
        /** @var AdminNotificationType $adminNotificationType */
        $adminNotificationType = $this->adminNotificationTypeRepository
            ->find(AdminNotificationTypeConst::NEW_CENTRAL_REGISTERED);

        $adminNotification = new AdminNotification;
        $adminNotification->userId = $user->idUser;
        $adminNotification->adminNotificationTypeId = AdminNotificationTypeConst::NEW_CENTRAL_REGISTERED;
        $adminNotification->message = str_replace('{name}', $central->name, $adminNotificationType->defaultMessage);
        $adminNotification->title = $adminNotificationType->name;
        $adminNotification->ip = request()->ip();
        $adminNotification->save();

        return $adminNotification;
    }


    public function getDiscountConfigs(int $centralId): array
    {
        $central = Central::query()
            ->select(['discount_type', 'discount_value'])
            ->find($centralId);

        if (!$central) {
            throw new CentralException("Central not found");
        }

        return [
            'discount_type'  => $central->discount_type,
            'discount_value' => (int) $central->discount_value,
        ];
    }
}
