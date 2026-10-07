<?php

namespace App\Services\User;

use App\Constants\StatusConst;
use App\Models\User\User;
use App\Models\User\VerificationCode;
use App\Notifications\ForgetPasswordNotification;
use App\Repositories\User\UserRepository;
use App\Repositories\User\VerificationCodeRepository;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Notification;

class UserService
{
    /**
     * @var UserRepository
     */
    private $repository;
    private $verificationCodeRepository;

    public function __construct(UserRepository $repository, VerificationCodeRepository $verificationCodeRepository)
    {
        $this->repository = $repository;
        $this->verificationCodeRepository = $verificationCodeRepository;
    }

    public function setPassword(int $id, string $password, string $code)
    {
        $verificationCode = $this->verificationCodeRepository->findByCodeAndUserId($code, $id);
        if (!isset($verificationCode)) {
            throw new \Exception('Código de verificação inválido');
        }

        $verificationCode->used_at = Carbon::now();
        $verificationCode->statusId = StatusConst::REMOVED;
        $verificationCode->save();

        $user = User::findOrFail($id);
        $user->password = base64_encode($password);
        $user->save();

        Cache::forget("user-{$id}");

        return $user;
    }


    public function forgetPassword(string $email)
    {
        $user = $this->repository->findByEmail($email);
        if (!isset($user)) {
            throw new ModelNotFoundException('e-mail não encontrado');
        }

        $this->verificationCodeRepository->deleteByUser($user->idUser);

        $code = mt_rand(1000, 9999);

        $verificationCode = VerificationCode::create([
            'code' => $code,
            'userId' => $user->idUser,
            'statusId' => StatusConst::ACTIVE,
        ]);

        $verificationCode->code = base64_encode($verificationCode->code);

        Notification::route('mail', $email)
            ->notify(new ForgetPasswordNotification($code));

        return $verificationCode;
    }

    public function find($id)
    {
        try {
            return $this->repository->findWithCustomer($id);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function registerBySiteForWhatsApp(array $data)
    {
        try {
            return $this->repository->registerBySiteForWhatsApp($data);
        } catch (\Exception $e) {
            throw $e;
        }
    }
}
