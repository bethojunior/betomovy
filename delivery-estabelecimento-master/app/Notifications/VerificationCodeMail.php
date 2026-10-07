<?php

namespace App\Notifications;

use App\Repositories\Config\ConfigRepository;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VerificationCodeMail extends Notification
{
    use Queueable;

    private $verificationCode;
    private $appName;
    private $logoUrl;

    public function __construct(string $verificationCode)
    {
        $this->verificationCode = $verificationCode;
        $this->appName = (new ConfigRepository())->findByKey('app_title')->value;
        $this->logoUrl = (new ConfigRepository())->findByKey('logo_default')->value;
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Código de verificação')
            ->markdown('auth.passwords.emailcode', [
                'appName' => $this->appName,
                'verificationCode' => $this->verificationCode,
                'logoUrl' => $this->logoUrl
            ]);
    }

    public function toArray($notifiable): array
    {
        return [
            //
        ];
    }
}
