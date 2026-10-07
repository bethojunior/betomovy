<?php


namespace app\validator;
use Exception;

class DriverAddressValidator
{
    public function validateInsert($data)
    {
        if (empty($data->street)) {
            throw new Exception("Rua não informada");
        }

        if (empty($data->neighborhood)) {
            throw new Exception("Bairro não informado");
        }

        if (empty($data->city)) {
            throw new Exception("Cidade não informada");
        }

        if (empty($data->state)) {
            throw new Exception("Estado não informado");
        }

        if (empty($data->zipCode)) {
            throw new Exception("CEP não informado");
        }

        if (empty($data->userId)) {
            throw new Exception("Usuário não informado");
        }

    }
}