<?php



require_once dirname(__FILE__) . "/Exceptions/AuthenticateException.php";
require_once dirname(__FILE__) . "/Exceptions/ConnectionException.php";


class ConnectionCotaBank
{
    private $user;
    private $password;
    private $token;
    private $base_url;

    public function __construct(string $user, string $password, string $environment)
    {
        $this->user = $user;
        $this->password = $password;

        if ($environment == 'production') {
            $urlType = false;
        } elseif ($environment == 'homologation') {
            $urlType = true;
        } else {
            throw new Exception('Invalid environment type.');
        }

        $protocol = (($urlType) ? 'http://' : 'https://');
        $this->base_url =  $protocol . (($urlType) ? '52.168.167.13:1211' : 'onlinegw.redeceler.com.br');
        $this->authorization();
    }

    public function authorization()
    {
        try {
            $publicKey = $this->getKey();
            $params = [
                "user" => $this->user,
                "password" => trim($this->generatePrivateKey($publicKey, $this->password))
            ];

            $response = $this->post('/v1/logon', $params);

            if (empty($response->status) || (!$response->status))
                throw new \utils\cotabank\src\Exceptions\AuthenticateException("Incorrect username and/or password(s).");
            $this->token = $response->token;
        } catch (ConnectionException|AuthenticateException $e) {
            die($e);
        }
    }

    public function getToken()
    {
        return $this->token;
    }

    private function getKey()
    {
        $result = $this->get('/v1/getKey');
        if ((bool)$result->status)
            return $this->publicKey = $result->publicKey;

        throw new Exception('Invalid credentials.');
    }


    public function get(string $url, array $headers = array())
    {
        $headers[] = "Accept: application/json";
        $headers[] = "Content-Type: application/json";
        $headers[] = "x-access-token: " . $this->token;
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->base_url . '' . $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_HEADER, FALSE);
        curl_setopt($ch, CURLOPT_POST, FALSE);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $response = curl_exec($ch);
        curl_close($ch);
        $response = json_decode($response);
        if (empty($response))
            throw new Exception('Connection Not Found');
        return $response;
    }

    public function post(string $url = '/', array $params = [], array $headers = array())
    {
        $headers[] = "Accept: application/json";
        $headers[] = "x-access-token: " . $this->token;
        $headers[] = "Content-Type: application/json";
        $params = json_encode($params);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->base_url . '' . $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_HEADER, FALSE);
        curl_setopt($ch, CURLOPT_POST, TRUE);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $response = curl_exec($ch);
        curl_close($ch);
        $response = json_decode($response);
        if (empty($response))
            throw new Exception('Connection Not Found');
        return $response;
    }


    private function generatePrivateKey($publicKey, $password): string
    {
        openssl_get_publickey($publicKey);
        openssl_public_encrypt($password, $encrypted, $publicKey);

        return base64_encode($encrypted);
    }
}
