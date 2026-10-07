<?php


namespace App\Utils;


use Doctrine\DBAL\Exception;

class InfoSimples
{
    private $api = "https://api.infosimples.com/api/v2/consultas/antecedentes-criminais/dpf";
    private $token;


    public function __construct($token = null)
    {
        $this->token = $token;
    }

    public function getApi(): string
    {
        return $this->api;
    }

    public function setApi(string $api): void
    {
        $this->api = $api;
    }

    public function getToken()
    {
        return $this->token;
    }

    public function setToken($token): void
    {
        $this->token = $token;
    }


    public function criminalRecord(array $request = [])
    {
        $request["timeout"] = 300;
        $request["token"] = $this->token;


        if (empty($request['nome']) || empty($request['cpf']) || empty($request['birthdate'])) {
            throw new Exception("Dados inválidos!!!");
        }

        $curl = curl_init();

        curl_setopt($curl, CURLOPT_URL, $this->api);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $request);

        $response_body = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);

        if ($err) {
            throw new Exception("Erro na requisição com cURL #:" . $err);
        } else {
            $response = json_decode($response_body);
            if ($response->code == 200) {
                return $response->data;
            } elseif (in_array($response->code, range(600, 799))) {
                $mensagem = ($response->errors != null ? join("; ", $response->errors) : "");
                throw new Exception($mensagem);
            }
        }
    }
}





