<?php

namespace app\utils;

use app\contracts\WhatsappInterface;
use Exception;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;

class UtalkWhatsapp 
{
    protected string $token;
    protected string $baseUrl;
    protected string $url;
    protected array $headers;

    public function __construct(string $url, string $token)
    {
        $this->token = $token;
        $this->baseUrl = $url;
    }

    public function sendTextMessage(string $number, string $message): mixed
    {
        $message = str_replace(' ', '%20', $message);
        $url = $this->token.'/?cmd=chat&id='.$this->genId()->toString().'&to=+'.$number.'@c.us&msg='.$message;

        $this->call($url);

        return true;
    }

    public function sendTextWithLink(string $number, string $title, string $message, string $thumb, string $link): mixed
    {
        $url = $this->token.'/?cmd=link&id='
        .$this->genId()->toString()
        .'&to=+'.$number.'@c.us'
        .'&thumb='.$thumb
        .'&title='.$title
        .'&desc='.$message
        .'&link='.$link;

        $this->call($url);

        return true;
    }

    private function genId(): UuidInterface
    {
        return Uuid::uuid4();
    }

    private function call(string $url, $headers = []): array
    {
        return $this->get($url);
    }

    public function sendTextWithFile(string $number, string $message): mixed
    {
        throw new Exception('Não implementado');
    }

    public function get(string $path, array $headers = array())
    {
        $headers[] = "Accept: application/json";
        $headers[] = "Content-Type: application/json";
        $headers[] = "x-access-token: " . $this->token;
            // dd($this->baseUrl . $path);
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->baseUrl . '' . $path);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_HEADER, FALSE);
        curl_setopt($ch, CURLOPT_POST, FALSE);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        $response = json_decode($response);
        if ($httpCode !== 200) {
            throw new Exception('Erro ao enviar mensagem via whatsapp');
        }

        return $response;
    }

    public function getNameIntegration(): string
    {
        return 'Utalk';
    }
}
