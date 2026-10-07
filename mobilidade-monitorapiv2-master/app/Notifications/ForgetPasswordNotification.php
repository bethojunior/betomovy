<?php

namespace App\Notifications;

use App\Repositories\Config\ConfigRepository;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Config;


class ForgetPasswordNotification extends Notification
{
    use Queueable;

    private $appName;
    private $logoUrl;
    private $verificationCode;
    private $config;

    public function __construct(string $verificationCode, array $config = [])
    {
        $this->verificationCode = $verificationCode;
        $this->config = $config;
        $this->appName = (new ConfigRepository())->findByKey('app_title')->value;
        $this->logoUrl = (new ConfigRepository())->findByKey('logo_default')->value;
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        if (!empty($this->config)) {
            Config::set('mail.mailers.smtp', $this->config);
        }

        $mail = $notifiable->routes['mail'] ?? '';

        return (new MailMessage)
            ->from($mail, $this->appName)
            ->subject('Código de verificação')
            ->markdown('mail.user.forgetPassword', [
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

