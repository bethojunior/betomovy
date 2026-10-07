<?php


namespace Api\Services\Auth;


use App\Constants\StatusConst;
use App\Models\Auth\VerificationCode;
use App\Models\User;
use App\Notifications\ForgetPasswordNotification;
use App\Notifications\VerificationCodeMail;
use Illuminate\Support\Facades\Notification;

class ForgotPasswordService
{
    public function sendVerificationCodeEmail(string $email): array
    {
        $user = User::where('email', $email)->first();
        if (!$user) throw new \Exception('Email não registrado');
        $code = mt_rand(1000, 9999);

        $verificationCode = VerificationCode::create([
            'code' => $code,
            'userId' => $user->idUser,
            'statusId' => StatusConst::ACTIVE
        ]);

        $user->notify(new VerificationCodeMail($code));

        return ['code' => base64_encode($code), 'userId' => $verificationCode->userId];
    }
}
