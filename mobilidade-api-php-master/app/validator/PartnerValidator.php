<?php

namespace app\validator;

use app\exceptions\InvalidFieldPlaceException;

/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 07/05/2019
 * Time: 17:08
 */
class PartnerValidator
{

    /**
     * @param $request
     * @return bool
     * @throws InvalidFieldPlaceException
     */
    public function validateRequestPartnership($request)
    {
        if (count(get_object_vars($request)) < 1)
            throw new InvalidFieldPlaceException("A requisição não pode ser vazia");

        $this->addressIsValid($request->addressEstablishment ?? '');

        $this->latitudeIsValid($request->latitude ?? '');

        $this->longitudeIsValid($request->longitude ?? '');

        $this->nameEstablishmentIsValid($request->nameEstablishment ?? '');

        $this->functionIsValid($request->function ?? '');

        $this->userIdIsValid($request->userId ?? '');

        return true;
    }


    /**
     * @param string $address
     * @throws InvalidFieldPlaceException
     */
    private function addressIsValid(string $address)
    {
        if (strlen($address) < 3) {
            throw new InvalidFieldPlaceException('Endereço inválido.', 'addressEstablishment');
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

    /**
     * @param string $nameEstablishment
     * @throws InvalidFieldPlaceException
     */
    private function nameEstablishmentIsValid(string $nameEstablishment)
    {
        if (strlen($nameEstablishment) <= 0) {
            throw new InvalidFieldPlaceException('nome do estabelecimento inválido.', 'nameEstablishment');
        }
    }

    /**
     * @param string $function
     * @throws InvalidFieldPlaceException
     */
    private function functionIsValid(string $function)
    {
        if (strlen($function) <= 0) {
            throw new InvalidFieldPlaceException('função inválido.', 'function');
        }
    }

    /**
     * @param string $userId
     * @throws InvalidFieldPlaceException
     */
    private function userIdIsValid(string $userId)
    {
        if (strlen($userId) < 1) {
            throw new InvalidFieldPlaceException('userId inválido.', 'userId');
        }
    }
}