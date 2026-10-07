<?php

namespace App\Utils;

use DateInterval;
use DateTime;

class AsaasApi
{
    protected $api_key;
    protected $base_url = 'https://www.asaas.com/api/v3/';

    public function __construct()
    {
        $this->api_key = env("ASAAS_API_KEY_DEV");
        //6cbf3553fa76d01bb41a761a736a6aecf23037d292a5ffd766e3877fae4ede0b

    }

    /**
     * @return mixed
     * @throws \Exception
     */
    public function createBoleto($driver)
    {
        $userExists = true;
        $removeMask = $this->removeMaskCpf($driver['document']);
        $user = $this->getUserAsaas($removeMask, null);
        if ($user['totalCount'] == 0) {
            $newUser = $this->createUserAsaas($driver);
            $user = $newUser;
            $userExists = false;
        }
        if ($userExists) {
            $result = $this->sendBoleto($driver, $user['data'][0], true);
        } else {
            $result = $this->sendBoleto($driver, $user, false);
        }
        return $result;
    }

    // VERIFICA SE EXISTE USER //
    /**
     * @return mixed
     * @throws \Exception
     */
    public function getBoletos($driver)
    {
        $url = "payments?externalReference={$driver}";
        $result = $this->curlExec($url, 'GET');
        return $result;
    }

    // VERIFICA SE EXISTE USER //
    /**
     * @return mixed
     * @throws \Exception
     */
    public function getUser($document)
    {
        $user = $this->getUserAsaas($document, null);
        $boleto = $this->getBoletos($user['data'][0]->externalReference);

        $result = [
            'userData' => $user['data'][0] ? $user['data'][0] : null,
            'boletoData' => $boleto['data'] ? $boleto['data'] : null,
        ];

        return $result;
    }

    // VERIFICA SE EXISTE USER //
    /**
     * @return mixed
     * @throws \Exception
     */
    private function getUserAsaas($document, $id)
    {
        if ($document != null) {
            $url = "customers?cpfCnpj={$document}";
            $result = $this->curlExec($url, 'GET');
        }
        if ($id != null) {
            $url = "customers?externalReference={$id}";
            $result = $this->curlExec($url, 'GET');
        }
        return $result;
    }

    // CRIA UM NOVO USER //
    /**
     * @return mixed
     * @throws \Exception
     */
    private function createUserAsaas($driver)
    {
        $cpf = $this->removeMaskCpf($driver['document']);
        $mobile = $this->removeMaskMobile($driver['phone']);

        $data = [
            'name' => $driver['name'],
            'cpfCnpj' => $cpf,
            'email' => $driver['email'],
            'mobilePhone' => $mobile,
            'externalReference' => strval($driver['idDriver']),
            'municipalInscription' => strval($driver['cityId']),
            'notificationDisabled' => true,
        ];
        $result = $this->curlExec('customers', 'POST', $data);

        return $result;
    }


    // GERA UM BOLETO PARA O USER //
    /**
     * @return mixed
     * @throws \Exception
     */
    private function sendBoleto($driverData, $driver, $userExists)
    {
        $date = new DateTime();

        $dueDate = $date->add(new DateInterval("P3D"));
        $date = $date->format('Y/m/d');
        $dueDate = $dueDate->format('Y/m/d');
        $dueDate = str_replace("/", "-", $dueDate);

        $body = [
            'customer' => $userExists ? $driver->id : $driver['id'],
            'dueDate' => $dueDate,
            'value' => abs($driverData['balance']),
            'billingType' => "BOLETO",
            'externalReference' => strval($driverData['idDriver']),
            'description' => "Boleto referente a taxa do aplicativo de transporte EVAS."
        ];
        $result = $this->curlExec('payments', 'POST', $body);

        return $result;
    }

    private function removeMaskCpf($cpf)
    {
        $cpf = trim($cpf);
        $cpf = str_replace(".", "", $cpf);
        $cpf = str_replace(",", "", $cpf);
        $cpf = str_replace("-", "", $cpf);
        $cpf = str_replace("/", "", $cpf);
        return $cpf;
    }

    private function removeMaskMobile($number)
    {
        $number = trim($number);
        $number = str_replace("(", "", $number);
        $number = str_replace(")", "", $number);
        $number = str_replace("-", "", $number);
        return $number;
    }


    private function curlExec($actionUri, $method, $data = null)
    {
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $this->base_url . $actionUri);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_HEADER, FALSE);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);

        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        }
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            "access_token: $this->api_key"
        ));

        $response = json_decode(curl_exec($ch));
        curl_close($ch);
        return $response ? get_object_vars($response) : $response;
    }
}
