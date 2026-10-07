<?php

namespace app\utils;

use app\constant\TemplateEmailConst;
use app\dao\SmtpServerDao;
use app\model\ExternalServiceMetaData;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

class Email
{
    const TEMPLATE_DIR = '../src/views/email/';
    private $contentHtml;

    public function __construct($template = null)
    {
        $template = $template ?? 'default';
        $this->contentHtml = file_get_contents(self::TEMPLATE_DIR . $template . '.html');
        $this->addValue('bucket_name', env('S3_BUCKET_NAME'));
    }

    /**
     * @param $to
     * @param $subject
     * @param string $title
     * @param $message
     * @return bool
     * @throws Exception
     */
    public static function sendMail($to, $subject, $title, $message, $template = null)
    {
        // $miltoTokenApiNameEmail = ExternalServiceMetaData::get('token_api_name_milto_service_email');
        // $miltoTokenApiEmail = ExternalServiceMetaData::get('token_api_milto_service_email');

        // if (!is_null($miltoTokenApiNameEmail) && !is_null($miltoTokenApiEmail)) {
        //     $sendMail = new MiltoServiceEmailApi(
        //         $to,
        //         $message,
        //         $subject
        //     );

        //     return $sendMail->sendMail();
        // }

        $result = self::phpMailerSend($to, $subject, $message, $title, $template);

        return $result;
    }

    /**
     * @param $to
     * @param $subject
     * @param $message
     * @param $title
     * @param $template
     * @return array
     * @throws Exception
     */
    private static function phpMailerSend($to, $subject, $message, $title, $template, bool $retryEnable = true, int $ignoreId = null): array
    {
        $smtpCustom = (new SmtpServerDao)->findActive($ignoreId);

        if (!empty($smtpCustom) && $smtpCustom->default == 0 && $retryEnable) {
            (new SmtpServerDao)->enableDefault($smtpCustom->id);
        }

        $mail = new PHPMailer(true);

        //Email encode
        $mail->CharSet = 'UTF-8';

        //Server settings
        $mail->isSMTP();                                 // Set mailer to use SMTP
        $mail->Host = $smtpCustom ? $smtpCustom->host : env('MAIL_HOST');                  // Specify main and backup SMTP servers
        $mail->SMTPAuth = env('MAIL_SMTPAUTH');          // Enable SMTP authentication
        $mail->Username = $smtpCustom ? $smtpCustom->username : env('MAIL_USERNAME');          // SMTP username
        $mail->Password = $smtpCustom ? $smtpCustom->password : env('MAIL_PASSWORD');          // SMTP password
        $mail->SMTPSecure = $smtpCustom ? $smtpCustom->encryption : env('MAIL_SMTPSECURE');      // Enable TLS encryption, `ssl` also accepted
        $mail->Port = $smtpCustom ? $smtpCustom->port : env('MAIL_PORT');                  // TCP port to connect to

//        $mail->debg

        //Recipients
        $mail->setFrom($smtpCustom ? $smtpCustom->fromMailer : env('MAIL_FROM'), $smtpCustom ? $smtpCustom->fromName : env('MAIL_FROM_NAME') ?? '');
        $mail->addAddress($to);     // Add a recipient

        $bodyMessage = self::loadTemplate($title, $message, $template ?? 1);

        //Content
        $mail->isHTML(true);                            // Set email format to HTML
        $mail->Subject = $subject;
        $mail->Body = $bodyMessage;

        try {
            $mail->send();

            if (!empty($smtpCustom)) {
                // zera as tentativas de envio
                (new SmtpServerDao)->resetTries($smtpCustom->id);
            }

            return [
                'status' => 'success',
                'message' => 'Mail Sent'
            ];
        } catch (Exception $e) {
            if ($retryEnable === true && !empty($smtpCustom)) {
                // incrementar o número de tentativas
                (new SmtpServerDao)->incrementRetry($smtpCustom->id);

                // se o número de tentativas for maior que 3, mudar a conta padrao
                if ($smtpCustom->retry > 3) {
                    (new SmtpServerDao)->disableDefault($smtpCustom->id);
                }
                return self::phpMailerSend($to, $subject, $message, $title, $template, false, $smtpCustom->id);
            }

            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }

    private static function loadTemplate($title, $message, $template = 1)
    {

        switch ($template) {
            case TemplateEmailConst::DEFAULT:
                $corpo = "<h1>$title</h1><br>";

                $corpo .= "<p>$message</p>";

//                $corpo = self::mountTemplate('default');
//
//                self::addText('title',$title,$corpo);
//                self::addText('message',$message,$corpo);

                return $corpo;

            case TemplateEmailConst::CONFIRMATION_EMAIL:
                $corpo = "<h1>$title</h1><br>";

                $corpo .= "<p>$message</p>";

                return $corpo;
        }

    }

    private static function mountTemplate($html)
    {
        return file_get_contents(self::TEMPLATE_DIR . $html . '.html');
    }

    private static function addText($param, $value, &$content)
    {
        $content = str_replace('{{' . $param . '}}', $value, $content);
    }

    public function addValue($param, $value)
    {
        $this->contentHtml = str_replace('{{' . $param . '}}', $value, $this->contentHtml);

        return $this;
    }

    public function send($to, $subject, bool $retryEnable = true, int $ignoreId = null): array
    {
        $smtpCustom = (new SmtpServerDao)->findActive($ignoreId);

        if (!empty($smtpCustom) && $smtpCustom->default == 0 && $retryEnable) {
            (new SmtpServerDao)->enableDefault($smtpCustom->id);
        }

        $mail = new PHPMailer(true);

        //Email encode
        $mail->CharSet = 'UTF-8';

        //Server settings
        $mail->isSMTP();                                 // Set mailer to use SMTP
        $mail->Host = $smtpCustom ? $smtpCustom->host : env('MAIL_HOST');                  // Specify main and backup SMTP servers
        $mail->SMTPAuth = env('MAIL_SMTPAUTH');          // Enable SMTP authentication
        $mail->Username = $smtpCustom ? $smtpCustom->username : env('MAIL_USERNAME');          // SMTP username
        $mail->Password = $smtpCustom ? $smtpCustom->password : env('MAIL_PASSWORD');          // SMTP password
        $mail->SMTPSecure = $smtpCustom ? $smtpCustom->encryption : env('MAIL_SMTPSECURE');      // Enable TLS encryption, `ssl` also accepted
        $mail->Port = $smtpCustom ? $smtpCustom->port : env('MAIL_PORT');                  // TCP port to connect to

        //Recipients
        $mail->setFrom($smtpCustom ? $smtpCustom->fromMailer : env('MAIL_FROM'), $smtpCustom ? $smtpCustom->fromName : env('MAIL_FROM_NAME') ?? '');
        $mail->addAddress($to);     // Add a recipient

        //Content
        $mail->isHTML(true);                            // Set email format to HTML
        $mail->Subject = $subject;
        $mail->Body = $this->contentHtml;

        try {
            $mail->send();

            if (!empty($smtpCustom)) {
                // zera as tentativas de envio
                (new SmtpServerDao)->resetTries($smtpCustom->id);
            }

            return [
                'status' => 'success',
                'message' => 'Mail Sent'
            ];
        } catch (Exception $e) {
            if ($retryEnable === true && !empty($smtpCustom)) {
                // incrementar o número de tentativas
                (new SmtpServerDao)->incrementRetry($smtpCustom->id);

                // se o número de tentativas for maior que 3, mudar a conta padrao
                if ($smtpCustom->retry > 3) {
                    (new SmtpServerDao)->disableDefault($smtpCustom->id);
                }
                return self::send($to, $subject, false, $smtpCustom->id);
            }

            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }

}

