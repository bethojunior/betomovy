<?php

namespace app\validator;

use app\exceptions\InvalidFieldPlaceException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/10/2018
 * Time: 10:25
 */
class PlaceValidator
{
    /**
     * @param $request
     * @return bool
     * @throws InvalidFieldPlaceException
     */
    public function validateInsertPlace($request)
    {
        if (count(get_object_vars($request)) < 1)
            throw new InvalidFieldPlaceException("A requisição não pode ser vazia");

        $this->addressIsValid($request->address ?? '');
        $this->latitudeIsValid($request->latitude ?? '');
        $this->longitudeIsValid($request->longitude ?? '');

        if (isset($request->cityId))
            $this->cityIdIsValid($request->cityId ?? '');

        if (isset($request->number))
            $this->numberIsValid($request->number ?? '');

        if (isset($request->neighborhood))
            $this->neighborhoodIsValid($request->neighborhood ?? '');

        if (isset($request->estateId))
            $this->estateIdIsValid($request->estateId ?? '');

        return true;
    }

    /**
     * @param string $address
     * @throws InvalidFieldPlaceException
     */
    private function addressIsValid(string $address)
    {
        if (strlen($address) < 3) {
            throw new InvalidFieldPlaceException('Endereço inválido.', 'address');
        }
    }

    /**
     * @param string $number
     * @throws InvalidFieldPlaceException
     */
    private function numberIsValid(string $number)
    {
        if (strlen($number) < 1) {
            throw new InvalidFieldPlaceException('Numero deve ter mais que 1 caractere', 'number');
        }
    }

    /**
     * @param string $neighborhood
     * @throws InvalidFieldPlaceException
     */
    private function neighborhoodIsValid(string $neighborhood)
    {
        if (strlen($neighborhood) < 2) {
            throw new InvalidFieldPlaceException('Bairro deve ter mais que 1 letra', 'neighborhood');
        }
    }

    /**
     * @param $cityId
     * @throws InvalidFieldPlaceException
     */
    private function cityIdIsValid($cityId)
    {
        if ($cityId < 1 || !is_int($cityId)) {
            throw new InvalidFieldPlaceException('ID da cidade é Inválido', 'cityId');
        }
    }

    /**
     * @param $estateId
     * @throws InvalidFieldPlaceException
     */
    private function estateIdIsValid($estateId)
    {
        if ($estateId < 1 || !is_int($estateId)) {
            throw new InvalidFieldPlaceException('ID do estado é inválido', 'estateId');
        }
    }

    /**
     * @param string $latitude
     * @throws InvalidFieldPlaceException
     */
    private function latitudeIsValid(string $latitude)
    {
        if (strlen($latitude) < 0) {
            throw new InvalidFieldPlaceException('latitude não pode ser nula', 'latitude');
        }
    }

    /**
     * @param string $longitude
     * @throws InvalidFieldPlaceException
     */
    private function longitudeIsValid(string $longitude)
    {
        if (strlen($longitude) < 0) {
            throw new InvalidFieldPlaceException('longitude não pode ser nula', 'longitude');
        }
    }
}