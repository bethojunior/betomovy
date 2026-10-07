<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/09/2019
 * Time: 14:21
 */

namespace App\Services\User;


use App\Constants\Notification\AdminNotificationTypeConst;
use App\Constants\RemoveAccount\RemoveAccountRequestConst;
use App\Constants\StatusConst;
use App\Constants\Users\CustomerRegisterStatusConst;
use App\Constants\Users\DriverRegisterStatusConst;
use App\Constants\Users\UserTypeConst;
use App\Exceptions\User\UserException;
use App\Models\Central\CentralUser;
use App\Models\User\RemoveAccount\RemoveAccountRequestModel;
use App\Models\User\User;
use App\Models\User\UserType;
use App\Models\User\VerificationCode;
use App\Notifications\ForgetPasswordNotification;
use App\Repositories\Config\SMTPServerRepository;
use App\Repositories\User\CustomerRepository;
use App\Repositories\User\DriverRepository;
use App\Repositories\User\LevelAccessRepository;
use App\Repositories\User\UserRepository;
use App\Repositories\User\UserTypeRepository;
use App\Repositories\User\VerificationCodeRepository;
use App\Models\User\LevelAccess;
use App\Services\WhatsApp\WhatsAppService;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class UserService
{
    /**
     * @var UserRepository
     */
    private $repository;
    private $verificationCodeRepository;
    private $customerRepository;
    private $driverRepository;
    private $whatsAppService;
    /**
     * @var LevelAccessRepository
     */
    private $levelAccessRepository;
    /**
     * @var UserTypeRepository
     */
    private $userTypeRepository;

    public function __construct(
        UserRepository $repository,
        VerificationCodeRepository $verificationCodeRepository,
        CustomerRepository $customerRepository,
        DriverRepository $driverRepository,
        LevelAccessRepository $levelAccessRepository,
        UserTypeRepository $userTypeRepository,
        WhatsAppService $whatsAppService
    )
    {
        $this->repository                 = $repository;
        $this->verificationCodeRepository = $verificationCodeRepository;
        $this->customerRepository         = $customerRepository;
        $this->driverRepository           = $driverRepository;
        $this->levelAccessRepository      = $levelAccessRepository;
        $this->userTypeRepository         = $userTypeRepository;
        $this->whatsAppService            = $whatsAppService;
    }

    /**
     * @param $id
     * @return bool
     * @throws UserException
     */
    public function delete($id)
    {
        /** @var User $user */
        $user = $this->repository->find($id);

        if (!$user)
            throw new UserException("Usuário não encontrado");

        $user
            ->statusId = StatusConst::REMOVED;

        $this->repository->save($user);

        return true;
    }

    public function setObservation(int $id, string $observation = null)
    {
        $user = User::findOrFail($id);
        $user->observation = $observation;
        $user->save();

        return ["observation" => $user->observation];
    }

    public function setAddress(int $id, string $zipcode, string $addressNumber)
    {
        $user = User::findOrFail($id);
        $user->zipcode = $zipcode;
        $user->addressNumber = $addressNumber;
        $user->save();

        return [
            'zipcode' => $user->zipcode,
            'adressNumber' => $user->addressNumber,
        ];
    }

    public function setGender(int $id, string $gender)
    {
        $user = User::findOrFail($id);
        $user->gender = $gender;
        $user->save();

        return [
            'gender' => $user->gender,
        ];
    }

    public function setPassword(int $id, string $password, string $code = null)
    {
        if ($code !== null) {
            $verificationCode = $this->verificationCodeRepository->findByCodeAndUserId($code, $id);
            if (!isset($verificationCode)) throw new \Exception('Código de verificação inválido');

            $verificationCode->used_at = Carbon::now();
            $verificationCode->statusId = StatusConst::REMOVED;
            $verificationCode->save();
        }

        $user = User::findOrFail($id);
        $user->password = base64_encode($password);
        $user->save();

        return $user;
    }


    public function getByType(int $userTypeId)
    {
        $userType = UserType::find($userTypeId);
        if (!$userType) throw new ModelNotFoundException('Tipo de Usuário não encontrado');

        return $this->repository->getByType($userTypeId);
    }

    public function forgetPassword(string $email)
    {
        $user = (new UserRepository())->findByEmailAndUserType($email, UserTypeConst::ADMIN);
        $appName = env('APP_NAME', 'App de mobilidade urbana');

        if (!isset($user)) throw new ModelNotFoundException('e-mail não encontrado');

        $this->verificationCodeRepository->deleteByUser($user->idUser);

        $code = mt_rand(1000, 9999);

        $verificationCode = VerificationCode::create([
            'code' => $code,
            'userId' => $user->idUser,
            'statusId' => StatusConst::ACTIVE,
        ]);

        $verificationCode->code = base64_encode($verificationCode->code);

        $smtpActive = (new SMTPServerRepository())->findActive();

        $configSmtp = [];
        if($smtpActive){
            $configSmtp = array(
                'transport' => 'smtp',
                'host' => $smtpActive->host,
                'port' => $smtpActive->port,
                'encryption' => $smtpActive->encryption,
                'username' => $smtpActive->username,
                'password' => $smtpActive->password,
                'timeout' => null,
            );
        }

        $this->whatsAppService->handle(
            $user->phone,
            "{$appName} - Olá, {$user->name}! 😊 Seu código de verificação para recuperar a senha é: *{$code}*. Ele é válido por alguns minutos. Não compartilhe com ninguém!"
        );

        Notification::route('mail', $user->email)
            ->notify(new ForgetPasswordNotification($code, $configSmtp));

        return $verificationCode;
    }

    public function deleteUserCentral(int $id)
    {
        $user = $this->repository->find($id);

        if (!$user || !isset($user->centralUsers))
            throw new UserException("Usuário de central não encontrado");

        $user->centralUsers->each(function (CentralUser $centralUser) {
            $centralUser->statusId = StatusConst::REMOVED;
            $centralUser->save();
        });

        return true;
    }

    /**
     * @throws UserException
     */
    public function changeType($id, $request)
    {
        $this->validateChangeUserType($request);

        /** @var LevelAccess $levelAccess */
        $levelAccess = $this->levelAccessRepository->findByUserId($id);

        if (empty($levelAccess)) {
            throw new UserException("Nível de acesso de usuário não foi encontrado");
        }

        /** @var UserType|null $userType */
        $userType = $this->userTypeRepository->find($request->userTypeId);

        if (!$userType) {
            throw new UserException("Tipo de usuário não foi encontrado");
        }

        $levelAccess->update(['userTypeId' => $userType->idUserType]);
        return $levelAccess;
    }

    public function listAllRemoveAccountRequest(array $queryRequest = [])
    {
        return RemoveAccountRequestModel::query()
            ->join('user', 'user.idUser', '=', 'removeAccountRequest.userId')
            ->leftJoin('city', 'city.id', '=', 'user.cityId')
            ->select(
                'removeAccountRequest.id',
                'removeAccountRequest.userId as userId',
                'user.name as userName',
                'user.phone as userPhone',
                'removeAccountRequest.userIdWhoDeleted',
                'removeAccountRequest.cityId',
                'city.nome as cityName',
                'removeAccountRequest.type',
                'removeAccountRequest.reason',
                'removeAccountRequest.details',
                'removeAccountRequest.ip',
                'removeAccountRequest.platform',
                'removeAccountRequest.created_at'
            )
            ->where('user.statusId', StatusConst::ACTIVE)
            ->paginate();
    }

    public function removeAccountUser(int $id)
    {
        // Adicionar usuario que removeu a conta
        $userIdInRemoveAccountRequest = RemoveAccountRequestModel::where('userId', $id)->first();
        if (isset($userIdInRemoveAccountRequest)) {
            $userIdInRemoveAccountRequest->update(['userIdWhoDeleted' => Auth::user()->idUser]);
            $userIdInRemoveAccountRequest->delete();
        }

        // Remover usuario
        $user = $this->repository->find($id);
        if (!$user) throw new UserException("Usuário não encontrado");
        $user->statusId = StatusConst::REMOVED;
        $user->save();

        return true;
    }

    public function cancelRemoveAccountUser(int $id)
    {
        return DB::transaction(function () use ($id) {
            $removeAccountRequest = RemoveAccountRequestModel::where('userId', $id)->first();
            $type = $removeAccountRequest->type ?? RemoveAccountRequestConst::TYPE_CUSTOMER;

            // Reativar o perfil (customer ou driver, de acordo com o tipo da solicitação) antes
            // de mexer no registro de solicitação, pra não perder a solicitação se o perfil não existir
            if ($type === RemoveAccountRequestConst::TYPE_DRIVER) {
                $driver = $this->driverRepository->findByUser($id);
                if (!$driver) throw new UserException("Motorista não encontrado");
                $driver->driverRegisterStatusId = DriverRegisterStatusConst::ACTIVE;
                $driver->save();
            } else {
                $customer = $this->customerRepository->findByUser($id);
                if (!$customer) throw new UserException("Cliente não encontrado");
                $customer->customerRegisterStatusId = CustomerRegisterStatusConst::ACTIVE;
                $customer->save();
            }

            // Adicionar usuario que cancelou a remoção da conta
            if (isset($removeAccountRequest)) {
                $removeAccountRequest->update(['userIdWhoDeleted' => Auth::user()->idUser]);
                $removeAccountRequest->delete();
            }

            return true;
        });
    }

    public function getAllUsers(string $data = null)
    {
        return $this->repository->getAllUsers($data);
    }

    public function getAllUsersPanel(string $data = null)
    {
        return $this->repository->getAllUsersPanel($data);
    }

    private function validateChangeUserType($request)
    {
        if (!isset($request->userTypeId) && !is_numeric($request->userTypeId))
            throw new UserException("ID do tipo de usuário está inválido");
    }
}
