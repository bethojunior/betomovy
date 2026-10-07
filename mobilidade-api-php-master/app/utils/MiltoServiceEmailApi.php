<?php

// namespace app\utils;

// use app\constant\SeuMiltoMapsConst;
// use app\constant\TemplateEmailConst;
// use app\dao\SmtpServerDao;
// use app\model\ExternalServiceMetaData;
// use PHPMailer\PHPMailer\Exception;
// use PHPMailer\PHPMailer\PHPMailer;

// class MiltoServiceEmailApi
// {
//     const TEMPLATE_DIR = '../src/views/email/';
//     /**
//      * @var mixed
//      */
//     private $token_name;

//     /**
//      * @var mixed
//      */
//     private $token;

//     /**
//      * @var string $api_url_milto_email
//      */
//     private string $api_url_milto_email;

//     public function __construct(string $recipient, string $message, string $title, $cityId = null)
//     {
//         $this->recipient = $recipient;
//         $this->message = $message;
//         $this->title = $title;

//         $url = env('ENV') === 'production' ?
//             SeuMiltoMapsConst::PRODUCTION_DOMAIN_URL :
//             SeuMiltoMapsConst::SANDBOX_DOMAIN_URL;

//         $this->api_url_milto_email = $url . 'notifications/email';

// //        $this->api_url_milto_email = 'http://host.docker.internal:8081/notifications/email';
//     }

//     private function loadConfigs(): void
//     {
//         $miltoTokenApiNameEmail = ExternalServiceMetaData::get('token_api_name_milto_service_email', $this->cityId);
//         $miltoTokenApiEmail = ExternalServiceMetaData::get('token_api_milto_service_email', $this->cityId);

//         $this->token_name = $miltoTokenApiNameEmail;
//         $this->token = $miltoTokenApiEmail;
//     }

//     public function sendMail()
//     {
//         $this->loadConfigs();

//         $loadTemplate = $this->loadTemplate($this->title, $this->message, TemplateEmailConst::DEFAULT);

//         $data = [
//             'recipient' => $this->recipient,
//             'message' => $loadTemplate,
//             'title' => $this->title
//         ];


//         $url = $this->getUrl();

//         $result = $this->request($url, $data);

//         $this->resultIsValid($result);

//         return $result;
//     }

//     private function request(string $url_request, array $data)
//     {
//         $ch = curl_init($url_request);
//         curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
//         curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
//         curl_setopt($ch, CURLOPT_HTTPHEADER, [
//             'Accept: application/json',
//             'token: ' . $this->token,
//             'tokenname: ' . $this->token_name
//         ]);

//         $response = curl_exec($ch);

//         curl_close($ch);

//         return json_decode($response, true);
//     }

//     private function resultIsValid($result)
//     {
//         if (!$result) {
//             throw new Exception("Erro na comunicação com o seumilto: " . json_encode($result));
//         }

//         if (!$result['status']) {
//             throw new Exception("Erro seumilto " . now() . ": {$result->message}");
//         }

//         return true;
//     }

//     private function loadTemplate($title, $message, $template = 1)
//     {

//         switch ($template) {
//             case TemplateEmailConst::DEFAULT:
//                 $corpo = "<h1>$title</h1><br>";

//                 $corpo .= "<p>$message</p>";

//                 $corpo = self::mountTemplate('default');

//                 self::addText('title',$title,$corpo);
//                 self::addText('message',$message,$corpo);

//                 return $corpo;

//             case TemplateEmailConst::CONFIRMATION_EMAIL:
//                 $corpo = "<h1>$title</h1><br>";

//                 $corpo .= "<p>$message</p>";

//                 return $corpo;
//         }

//     }

//     private static function mountTemplate($html)
//     {
//         return file_get_contents(self::TEMPLATE_DIR . $html . '.html');
//     }

//     private static function addText($param, $value, &$content)
//     {
//         $content = str_replace('{{' . $param . '}}', $value, $content);
//     }

//     public function addValue($param, $value)
//     {
//         $this->contentHtml = str_replace('{{' . $param . '}}', $value, $this->contentHtml);

//         return $this;
//     }

//     private function getUrl()
//     {
//         return $this->api_url_milto_email;
//     }
// }

