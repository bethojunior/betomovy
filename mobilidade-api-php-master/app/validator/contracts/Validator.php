<?php

namespace app\validator\contracts;

use app\exceptions\RequestValidatorException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 26/04/2019
 * Time: 14:56
 */
abstract class Validator
{
    /**
     * @param $request
     * @throws \Exception
     */
    protected function requestIsNotEmpty($request)
    {
        if (!$request || count(get_object_vars($request)) < 1)
            throw new RequestValidatorException(1100);
    }

    /**
     * @param $cityId
     * @throws \Exception
     */
    protected function cityIdIsValid($cityId)
    {
        if (!is_numeric($cityId))
            throw new \Exception("ID da cidade é inválido");
    }

    /**
     * @param $tripTypeId
     * @throws \Exception
     */
    protected function tripTypeIdIsValid($tripTypeId)
    {
        if (strlen($tripTypeId) < 1)
            throw new \Exception("Tipo da viagem não pode ser vazio/nulo");

        if (!is_numeric($tripTypeId))
            throw new \Exception("Tipo da viagem está inválido");
    }

    /**
     * @param $number
     * @param string|null $messageError
     * @throws \Exception
     */
    protected function isNumber($number, string $messageError = null)
    {
        if (!is_numeric($number))
            throw new \Exception($messageError ?? "O valor enviado deve ser um número válido");
    }

    /**
     * @param string $latitude
     * @param null $specificField
     * @throws Exception
     */
    protected function latitudeIsValid(string $latitude, $specificField = null)
    {
        if (strlen($latitude) <= 0) {
            throw new \Exception('Latitude não pode ser nula' .
                $this->concatSpecificField($specificField));
        }
    }

    /**
     * @param string $longitude
     * @param null $specificField
     * @throws Exception
     */
    protected function longitudeIsValid(string $longitude, $specificField = null)
    {
        if (strlen($longitude) <= 0) {
            throw new \Exception('Longitude não pode ser nula' .
                $this->concatSpecificField($specificField));
        }
    }

    /**
     * @param $date
     * @throws \Exception
     */
    protected function checkDate($date)
    {
        $date = explode(' ', $date);
        $day = explode('-', $date[0]);
        $d = (int)$day[2];
        $m = (int)$day[1];
        $y = (int)$day[0];

        if (!checkdate($m, $d, $y)) {
            throw new \Exception("A data está inválida");
        }
    }

    /**
     * @param $string
     * @param string $fieldError
     * @throws \Exception
     */
    protected function stringIsValid($string, string $fieldError)
    {
        if (strlen($string) < 1)
            throw new \Exception("O campo {$fieldError} está inválido");
    }

    /**
     * @param $email
     * @throws Exception
     */
    protected function emailIsValid($email)
    {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL))
            throw new Exception("O campo email está inválido");
    }

    private function concatSpecificField(?string $field)
    {
        return $field ?
            '. Field: ' . $field : '';
    }
}