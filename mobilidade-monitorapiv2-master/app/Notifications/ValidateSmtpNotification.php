<?php

namespace App\Notifications;

use App\Repositories\Config\ConfigRepository;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Config;


class ValidateSmtpNotification extends Notification
{
    use Queueable;

    private $appName;
    private $logoUrl;
    private $config;

    public function __construct(array $config = [])
    {
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
            ->subject('Validação de Email')
            ->markdown('mail.user.validateSmtp', [
                'appName' => $this->appName,
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

