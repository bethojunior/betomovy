<?php

namespace app\queue\Jobs;

use app\dao\LogDao;
use app\model\Config;
use app\model\ConfigType;
use app\queue\JobInterface;
use app\utils\Email;
use app\utils\File;
use app\utils\WhatsApp\WhatsAppService;
use Exception;

class DriverRegisterPostCommitJob implements JobInterface
{
    public function handle(array $payload): void
    {
        $this->moveFiles($payload['files'] ?? []);

        if (!empty($payload['email'])) {
            $this->sendWelcomeEmail($payload['email']);
        }

        if (!empty($payload['phone']) && !empty($payload['whatsappMessage'])) {
            (new WhatsAppService)->handle($payload['phone'], $payload['whatsappMessage']);
        }
    }

    private function moveFiles(array $files): void
    {
        if (empty($files)) {
            return;
        }

        $fileUtil = new File;

        foreach ($files as $item) {
            if (empty($item['fileName']) || empty($item['fromDir']) || empty($item['toDir'])) {
                continue;
            }

            try {
                $fileUtil->move($item['fileName'], $item['fromDir'], $item['toDir']);
            } catch (Exception $e) {
                (new LogDao)->logException($e);
                throw $e;
            }
        }
    }

    private function sendWelcomeEmail(string $email): void
    {
        try {
            $message = Config::get('welcome_email_message', ConfigType::DRIVER);
            $title = Config::get('welcome_email_title', ConfigType::DRIVER);
            $subject = Config::get('welcome_email_subject', ConfigType::DRIVER);

            Email::sendMail($email, $subject, $title, $message);
        } catch (Exception $e) {
            (new LogDao)->logException($e);
        }
    }
}
