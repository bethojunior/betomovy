<?php

namespace app\utils;

use app\dao\LogDao;
use Exception;

class ConfianceValidationPersonalDocument extends AbstractValidationPersonalDocument
{
    private $token;

    public function __construct()
    {
        $this->apiUrl = 'https://api.confiance.digital/';
        $this->token = '0b00818008d149082f44589d9af63b8471427e75';
    }

    public function validate($document): array
    {
        $data = $this->curlExec($document);
        $response = [
            'ativo' => [
                'status' => true,
                'message' => ''
            ],
            'inativo' => [
                'status' => false,
                'message' => 'Acesso não liberado. Regularize sua mensalidade junto ao Confiance Bank. Caso tenha realizado o pagamento hoje aguarde 24h para liberação do acesso.'
            ],
            '' => [
                'status' => false,
                'message' => 'Você não é correntista do Confiance Bank. Abra sua conta em https://confiance.digital'
            ],
        ];

        if (!isset($data->status) || !isset($response[$data->status])) {
            (new LogDao)
                ->logApplication("Erro na comunicação com Confiance Digital", $data);

            throw new Exception('Erro na comunicação com Confiance Digital!');
        }

        return $response[$data->status];
    }

    private function curlExec($document)
    {
        $ch = curl_init();

        $headers = array(
            "Content-Type: application/x-www-form-urlencoded",
            "Accept: application/json, text/plain, */*",
            "token:" . $this->token,
        );

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_URL, $this->apiUrl . "cliente?c=" . FormatValue::formatDocumentClear($document));
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec($ch);
        $response = json_decode($response);

        curl_close($ch);

        return $response;
    }
}