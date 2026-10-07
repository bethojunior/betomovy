<?php

namespace App\Utils;

use PHPMailer\PHPMailer\PHPMailer;
use App\Repositories\Config\ConfigRepository;

class MailSender
{
    private $emailSend;

    public function __construct()
    {
        $this->emailSend = new PHPMailer(true);
    }

    public function sendMail($company_email, $company_name) : void
    {

        $config = new ConfigRepository();
        $support_number = ($config -> findByKey('delivery_support_phone'))['value'];
        $support_email = ($config -> findByKey('delivery_support_email'))['value'];

        $body_html = file_get_contents('../resources/views/vendor/mail/html/alertCompanyActive.html');

        $app_name = env('APP_NAME');

        $search = [
            '{{customer_name}}',
            '{{app_name}}',
            '{{support_number}}',
            '{{support_email}}'
        ];

        $replace = [
            $company_name,
            $app_name,
            $support_number,
            $support_email
        ];

        $body_html = str_replace($search, $replace, $body_html);

        $this->triggerEmail(
            $company_email,
            $company_name,
            sprintf('Cadastro aprovado'),
            $body_html
        );
    }

    private function triggerEmail(string $email, string $name, string $subject, string $body): bool
    {
        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host       = getenv('MAIL_HOST');
            $mail->SMTPAuth   = true;
            $mail->Username   = getenv('MAIL_USERNAME');
            $mail->Password   = getenv('MAIL_PASSWORD');
            $mail->SMTPSecure = getenv('MAIL_ENCRYPTION');
            $mail->Port       = getenv('MAIL_PORT');
            $mail->CharSet    = 'UTF-8';

            $mail->setFrom(getenv('MAIL_FROM_ADDRESS'), getenv('APP_NAME'));
            $mail->addAddress($email, $name);

            $mail->isHTML(true);
            $mail->Subject = $subject;

            $mail->Body = $body;

            return $mail->send();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
    }
}
