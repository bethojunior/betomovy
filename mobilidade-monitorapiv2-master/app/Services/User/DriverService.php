<?php

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 21/06/2019
 * Time: 17:06
 */

namespace App\Services\User;


use App\Constants\Import\DriverExampleImport;
use App\Constants\StatusConst;
use App\Constants\Users\DriverConst;
use App\Constants\Users\DriverRegisterStatusConst;
use App\Exceptions\User\UserException;
use App\Exports\Report\ReportDefaultAutoSizeExport;
use App\Constants\Balance\BalanceFlowTypeConst;
use App\Constants\Users\DocStatusConst;
use App\Models\Balance\Balance;
use App\Models\Balance\BalanceFlow;
use App\Models\Driver\BlockReasons;
use App\Models\Driver\PendencyReasons;
use App\Models\Notification\Notification;
use App\Models\User\BlacklistUser;
use App\Models\User\Driver;
use App\Models\User\User;
use App\Repositories\Report\Select2\DriverSelectRepository;
use App\Repositories\Trip\TripRatingRepository;
use App\Repositories\User\BlacklistUserRepository;
use App\Repositories\User\BlockReasonsRepository;
use App\Repositories\User\Doc\DocUserRepository;
use App\Repositories\User\DriverRepository;
use App\Repositories\User\LevelAccessRepository;
use App\Repositories\User\PendencyReasonsRepository;
use App\Repositories\User\UserRepository;
use App\Services\Zafira\ZafiraService;
use App\Services\Zafira\ZafiraValidateRequest;
use App\Services\Zafira\ZafiraWhatsAppNotificationService;
use App\Traits\HasZafiraFieldsComparisonTrait;
use App\Utils\Push;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DriverService
{
    use HasZafiraFieldsComparisonTrait;

    /**
     * @var DriverRepository
     */
    private $repository;
    /**
     * @var BlockReasonsRepository
     */
    private $blockReasonsRepository;
    /**
     * @var PendencyReasonsRepository
     */
    private $pendencyReasonsRepository;
    /**
     * @var BlacklistUserRepository
     */
    private $blacklistUserRepository;
    /**
     * @var UserRepository
     */
    private $userRepository;
    /**
     * @var DocUserRepository
     */
    private $docUserRepository;
    /**
     * @var LevelAccessRepository
     */
    private $levelAccessRepository;
    /**
     * @var ZafiraService
     */
    private $zafiraService;

    private $driverSelectRepository;

    public function __construct(DriverRepository $repository,
                                BlockReasonsRepository $blockReasonsRepository,
                                PendencyReasonsRepository $pendencyReasonsRepository,
                                BlacklistUserRepository $blacklistUserRepository,
                                DriverSelectRepository $driverSelectRepository,
                                UserRepository $userRepository,
                                DocUserRepository $docUserRepository,
                                LevelAccessRepository $levelAccessRepository,
                                ZafiraService $zafiraService)
    {
        $this->repository = $repository;
        $this->blockReasonsRepository = $blockReasonsRepository;
        $this->pendencyReasonsRepository = $pendencyReasonsRepository;
        $this->blacklistUserRepository = $blacklistUserRepository;
        $this->driverSelectRepository = $driverSelectRepository;
        $this->userRepository = $userRepository;
        $this->docUserRepository = $docUserRepository;
        $this->levelAccessRepository = $levelAccessRepository;
        $this->zafiraService = $zafiraService;
    }

    public function findAll(array $data, $cityId = null)
    {
        return $this->repository->findAll(Auth::user(), $data, $cityId);
    }

    public function getStationsByDriver($driverId)
    {
        return $this->repository->getStationsByDriver($driverId);
    }

    public function findAllDelivery(array $request, $cityId = null): Collection
    {
        return $this->repository->findAllDelivery($request, Auth::user(), $cityId);
    }

    /**
     * @param Driver $driver
     * @param array $request
     * @return Driver
     */
    public function edit(Driver $driver, array $request): Driver
    {

        if (isset($request['email']) && ($this->repository->quantityDriversWithEmail($request['email'], $driver->idDriver) != 0)) {
            throw new \Exception("O campo email já está sendo usado!");
        }

        DB::beginTransaction();
        try {
            $driver->prepaid = $request['prepaid'] ?? $driver->prepaid;
            $driver->cnh = $request['cnh'] ?? $driver->cnh;
            if (isset($request['cityId'])) {
                $driver->cityId = $request['cityId'];
            }
            $driver->save();

            $user = $driver->user;

            if ($this->hasZafiraFieldsChanged($user, $request)) {
                $user->zafiraValidated = 0;
            }

            $user->fill(array_diff_key($request, ['zafiraValidated' => true]));
            $user->gender = $request['gender'] ?? $user->gender;
            $user->dateOfBirth = $request['dateOfBirth'] ?? $user->dateOfBirth;

            if (isset($request['password'])) {
                $user->password = base64_encode($request['password']);
            }
            if (isset($request['cityId'])) {
                $user->cityId = $request['cityId'];
            }
            $user->save();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return $this->find($driver->idDriver);
    }

    /**
     * @param $id
     * @return Driver
     */
    public function find($id): Driver
    {
        /** @var Driver $driver */
        $driver = $this->repository
            ->findFully($id);

        return $driver;
    }

    public function findPosition($id)
    {
        return $this->repository
            ->findPosition($id);
    }

    public function updateDriversPrepaid(array $request)
    {
        return $this->repository
            ->updateDriversPrepaid($request['prepaid']);
    }

    public function findExampleToImport()
    {
        return [new ReportDefaultAutoSizeExport(DriverExampleImport::model), 'modelo-motorista'];
    }

    public function resetAllBalance(int $cityId)
    {
        DB::beginTransaction();

        try {
            $drivers = $this->repository->findAllWithBalanceByCity($cityId);
            $balancesFlow = [];
            foreach ($drivers as $driver) {
                $balancesFlow[] = [
                    'balanceId' => $driver->balanceId,
                    'value' => abs($driver->balance),
                    'balanceFlowTypeId' => $driver->balance < 0 ? BalanceFlowTypeConst::BALANCE_LEVELING_ENTRY : BalanceFlowTypeConst::BALANCE_LEVELING_OUT,
                    'date' => now(),
                    'responsibleUserId' => (Auth::user())->idUser,
                ];
            }
            BalanceFlow::insert($balancesFlow);

            Balance::whereIn('idBalance', array_column($drivers->toArray(), 'balanceId'))
                ->update([
                    'balance' => 0,
                    'blockedBalance' => 0,
                    'blockedBalanceToPay' => 0,
                ]);

            DB::commit();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();

            return $e;
        }
    }

    public function resetBalance(Driver $driver)
    {
        DB::beginTransaction();

        try {
            BalanceFlow::create([
                'balanceId' => $driver->balanceId,
                'value' => abs($driver->balance->balance),
                'balanceFlowTypeId' => $driver->balance->balance < 0 ? BalanceFlowTypeConst::BALANCE_LEVELING_ENTRY : BalanceFlowTypeConst::BALANCE_LEVELING_OUT,
                'responsibleUserId' => (Auth::user())->idUser,
            ]);

            $driver->balance->balance = 0;
            $driver->balance->blockedBalance = 0;
            $driver->balance->blockedBalanceToPay = 0;

            $driver->balance->save();
            DB::commit();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();

            return $e;
        }
    }

    public function resetRating(int $id = null, int $cityId = null): bool
    {
        DB::beginTransaction();
        if ($this->repository->resetRating($id, $cityId) && (new TripRatingRepository())->deleteDriversRating($id, $cityId)) {
            DB::commit();
            return true;
        }

        DB::rollBack();
        return false;
    }

    public function getAll(array $data, $cityId = null)
    {
        // getAll legado escondia motoristas (INNER JOIN balance/userType + filtro de carro).
        // Reutiliza findAll (paginado, JOINs corretos) para a listagem do Monitor.
        return $this->repository->findAll(Auth::user(), $data, $cityId);
    }

    public function getAllDriversWithPositions(array $request, ?int $cityId = null): \Illuminate\Database\Eloquent\Collection
    {
        if (isset($request['status'])) {
            $status = explode(',', $request['status'] ?? '');
        }

        $status = $status ?? ['disponivel', 'corrida','desligado','boarding','accepted','in_trip'];
        return $this->repository->allWithPositions($status, $cityId);
    }

    public function activateRegister(Driver $driver): bool
    {
        $this->checkAndRemovePendencies($driver);

        $driver->driverRegisterStatusId = DriverRegisterStatusConst::ACTIVE;
        $driver->save();

        return true;
    }

    private function checkAndRemovePendencies(Driver $driver)
    {
        switch ($driver->driverRegisterStatusId) {
            case DriverRegisterStatusConst::BLOCKED:
                $blockReasons = $this->blockReasonsRepository->getActivesByDriver($driver->idDriver);
                $blockReasons->map(function (BlockReasons $blockReasons) {
                    $blockReasons->statusId = 2;
                    $blockReasons->save();
                });
                break;
            case DriverRegisterStatusConst::PENDING:
                $pendencyReasons = $this->pendencyReasonsRepository->getActivesByDriver($driver->idDriver);
                $pendencyReasons->map(function (PendencyReasons $pendencyReasons) {
                    $pendencyReasons->statusId = 2;
                    $pendencyReasons->save();
                });
                break;
            case DriverRegisterStatusConst::BLACKLIST:
                $blacklistReasons = $this->blacklistUserRepository->getActivesByUser($driver->userId);
                $blacklistReasons->map(function (BlacklistUser $blacklistReasons) {
                    $blacklistReasons->statusId = 2;
                    $blacklistReasons->save();
                });
                break;
        }

        $this->notifyByDriverRegister($driver);
    }

    private function notifyByDriverRegister(Driver $driver): ?array
    {
        if ($driver->driverRegisterStatusId == DriverRegisterStatusConst::BLACKLIST) {
            return $this->notify(
                $driver,
                "BEM VINDO DE VOLTA",
                "Sua penalidade chegou ao fim! Tome mais cuidado para não acontecer novamente"
            );
        }

        return $this->notify(
            $driver,
            "PARABÉNS",
            "Você já pode receber corridas, basta ficar disponível no app"
        );
    }

    private function notify(
        Driver $driver,
        string $title,
        string $message,
        string $action = 'changeStatusDriver'
    ): ?array
    {
        $push = new Push;
        $user = $this->userRepository->find($driver->userId);

        $push
            ->setTitle($title)
            ->setBody($message)
            ->setAction($action)
            ->setTag($action);

        return $push->sendNotificationWithData($user->deviceToken);
    }

    /**
     * @throws UserException
     */
    public function delete(int $id): bool
    {
        /** @var Driver $driver */
        $driver = $this->repository->find($id);

        /** @var User $user */
        $user = $this->userRepository->find($driver->userId);

        if (!$driver) {
            throw new UserException("Motorista não encontrado");
        }

        $user->statusId = StatusConst::REMOVED;
        $driver->status = DriverConst::OFF;
        $driver->save();
        $user->save();

        return true;
    }

    public function listBySelect2(array $request)
    {
        return $this->driverSelectRepository->listBySelect2WithName($request);
    }

    public function findAllWithoutPage(array $data, $cityId = null)
    {
        return $this->repository->findAllWithoutPage(Auth::user(), $data, $cityId);
    }

    public function requestDocumentAndPhoto(array $request): void
    {
        $this->validateRequest($request);

        $types = $this->normalizeTypes($request['type']);
        $drivers = $this->resolveDrivers($request);

        if (in_array('photo', $types, true)) {
            $this->requestDriversPhoto($drivers);
        }

        if (in_array('documents', $types, true)) {
            $this->requestDriversDocuments($drivers, (bool) ($request['block'] ?? false));
        }

        if (!$request['isByGroup'] && ($request['block'] ?? false)) {
            $this->blockDrivers($drivers);
        }
    }

    private function validateRequest(array $request): void
    {
        if (empty($request['users'])) {
            throw new \InvalidArgumentException('Nenhum usuário foi informado.');
        }

        if (empty($request['type'])) {
            throw new \InvalidArgumentException('Tipo não informado.');
        }
    }

    private function normalizeTypes($type): array
    {
        return is_array($type)
            ? $type
            : array_map('trim', explode(',', $type));
    }

    private function resolveDrivers(array $request)
    {
        return ($request['isByGroup'] ?? false)
            ? $this->getDriversByGroup($request['users'])
            : $this->getDriversByIds($request['users']);
    }

    private function getDriversByGroup(array $userTypeIds)
    {
        $users = $this->levelAccessRepository->findByUserTypeIds($userTypeIds);
        $userIds = $users->pluck('userId')->toArray();

        return $this->repository->getDriversByUserIds($userIds);
    }

    private function getDriversByIds(?array $driverIds)
    {
        return $this->repository->getDriversById($driverIds);
    }


    private function requestDriversPhoto($drivers): void
    {
        if ($drivers->isEmpty()) {
            return;
        }

        $this->repository->updateManyByIds($drivers, [
            'profileImageStatusId' => DocStatusConst::REPROVED,
            'profileImageTemp'     => null,
        ]);

        $this->pushDrivers($drivers, 'NOVA FOTO DO PERFIL FOI SOLICITADA', 'Sua foto do perfil está sendo requisitada novamente!');
    }
    
    private function requestDriversDocuments($drivers, bool $block): void
    {
        $userIds = $drivers->pluck('userId');

        if ($userIds->isEmpty()) {
            throw new \Exception("Nenhum usuário informado");
        }

        $this->docUserRepository
            ->getModel()
            ->whereIn('userId', $userIds)
            ->update([
                'docStatusId' => $block ? 3 : 1
            ]);

        $this->pushDrivers($drivers,'DOCUMENTOS ATUALIZADOS', 'Seus documentos foram atualizados, abra o app e verifique!');
    }

    private function pushDrivers($drivers, $title, $message){
        $data = [
            'message' => $message,
            'title' => $title
        ];
        $push = new Push;
        $push->preparePush($data, null);

        $drivers
            ->filter(fn ($driver) => !empty($driver->user->deviceToken))
            ->each(fn ($driver) =>
                $push->sendNotificationOneByOne($driver->user->deviceToken)
            );
    }

    private function blockDrivers($drivers): void
    {
        if ($drivers->isEmpty()) {
            return;
        }

        $this->repository->updateManyByIds($drivers, [
            'driverRegisterStatusId' => DriverRegisterStatusConst::PENDING
        ]);
    }
    public function insertLimitHours($idDriver, $limitHours)
    {
        $limitHours = floatval($limitHours);

        $result = DB::table('limit_hours_worked')->updateOrInsert(
            ['driverId' => $idDriver],
            [
                'hours' => $limitHours,
                'date'       => now(),
                'updated_at' => now(),
            ]
        );

        return $result;
    }

    public function findOne($driverId)
    {
        return $this->repository->findOne($driverId);
    }

    public function validateRegistration(int $driverId): array
    {
        $driver = $this->repository->findFully((int) $driverId);
        if (!$driver) {
            throw new \Exception('Motorista não encontrado.');
        }

        $zafiraEnabled = DB::table('cityConfig')
            ->where('cityId', $driver->cityId)
            ->value('enableZafiraValidationMonitor');

        if (!$zafiraEnabled) {
            throw new \Exception('A validação Zafira não está habilitada para a cidade deste motorista.');
        }

        $request = ZafiraValidateRequest::from($driver);

        return $this->zafiraService->validateAndPersist(
            $driver->userId,
            $request,
            ZafiraWhatsAppNotificationService::RECIPIENT_TYPE_DRIVER
        );
    }

}
