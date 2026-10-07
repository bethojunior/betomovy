<?php

declare(strict_types=1);

namespace App\Services\Zafira;

use App\Models\User\User;
use App\Repositories\Config\ConfigRepository;
use App\Services\WhatsApp\WhatsAppService;
use Illuminate\Support\Facades\Log;

class ZafiraWhatsAppNotificationService
{
    public const CONFIG_KEY_DRIVER = 'whatsapp_zafira_validated_driver_message';
    public const CONFIG_KEY_CLIENT = 'whatsapp_zafira_validated_client_message';
    public const RECIPIENT_TYPE_DRIVER = 'driver';
    public const RECIPIENT_TYPE_CUSTOMER = 'customer';

    private const DEFAULT_DRIVER = 'Olá {firstName}, nós da {projectName} confirmamos que seus dados cadastrais foram validados com sucesso pela Zafira. Obrigado!';
    private const DEFAULT_CLIENT = 'Olá {firstName}, nós da {projectName} confirmamos que seus dados cadastrais foram validados com sucesso pela Zafira. Obrigado!';

    /** @var ConfigRepository */
    private $configRepository;

    /** @var WhatsAppService */
    private $whatsAppService;

    public function __construct(
        ConfigRepository $configRepository = null,
        WhatsAppService $whatsAppService = null
    ) {
        $this->configRepository = $configRepository ?? new ConfigRepository();
        $this->whatsAppService = $whatsAppService ?? new WhatsAppService();
    }

    public function notifyValidatedUser(User $user, string $recipientType): bool
    {
        $phone = trim((string) ($user->phone ?? ''));
        if ($phone === '') {
            Log::warning('[ZafiraWhatsApp] Telefone ausente para envio', [
                'userId' => $user->idUser,
                'recipientType' => $recipientType,
            ]);

            return false;
        }
        try {
            $message = $this->buildMessage($user, $recipientType);
            $this->whatsAppService->handle($phone, $message);

            return true;
        } catch (\Throwable $exception) {
            Log::error('[ZafiraWhatsApp] Falha ao enviar mensagem', [
                'userId' => $user->idUser,
                'recipientType' => $recipientType,
                'error' => $exception->getMessage(),
            ]);

            return false;
        }
    }

    private function buildMessage(User $user, string $recipientType): string
    {
        $configKey = $recipientType === self::RECIPIENT_TYPE_DRIVER
            ? self::CONFIG_KEY_DRIVER
            : self::CONFIG_KEY_CLIENT;
        $defaultTemplate = $recipientType === self::RECIPIENT_TYPE_DRIVER
            ? self::DEFAULT_DRIVER
            : self::DEFAULT_CLIENT;
        $config = $this->configRepository->findByKey($configKey);
        $template = $config && trim((string) $config->value) !== ''
            ? (string) $config->value
            : $defaultTemplate;
        $firstName = $this->resolveFirstName((string) ($user->name ?? ''));
        $projectName = $this->resolveProjectName();

        return str_replace(
            ['{firstName}', '{projectName}'],
            [$firstName, $projectName],
            $template
        );
    }

    private function resolveFirstName(string $fullName): string
    {
        $trimmed = trim($fullName);
        if ($trimmed === '') {
            return '';
        }
        $parts = preg_split('/\s+/', $trimmed);

        return $parts[0] ?? $trimmed;
    }

    private function resolveProjectName(): string
    {
        $appTitle = $this->configRepository->findByKey('app_title');
        if ($appTitle && trim((string) $appTitle->value) !== '') {
            return trim((string) $appTitle->value);
        }

        return env('APP_NAME', 'App');
    }
}
