<?php

namespace app\validator;

use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/10/2018
 * Time: 09:10
 */
class StationValidator
{
    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public function validateInsertStation($request)
    {
        $this->nameIsValid($request->name ?? '');
        $this->stationTypeIdIsValid($request->stationTypeId ?? null);
        $this->latitudeIsValid($request->latitude ?? null);
        $this->longitudeIsValid($request->longitude ?? null);

        return true;
    }

    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public function validateUpdateStation($request)
    {
        $this->stationIdIsValid($request->idStation ?? null);

        if (isset($request->name))
            $this->nameIsValid($request->name);

        if (isset($request->stationTypeId))
            $this->stationTypeIdIsValid($request->stationTypeId);

        if (isset($request->latitude))
            $this->latitudeIsValid($request->latitude);

        if (isset($request->longitude))
            $this->longitudeIsValid($request->longitude);

        if (isset($request->address))
            $this->addressIsValid($request->address);

        return true;
    }

    /**
     * @param string $name
     * @throws Exception
     */
    private function nameIsValid(string $name)
    {
        if (strlen($name) < 2)
            throw new Exception("Nome é inválido");
    }

    /**
     * @param int $stationTypeId
     * @throws Exception
     */
    private function stationTypeIdIsValid($stationTypeId)
    {
        if (!$stationTypeId || !is_int($stationTypeId))
            throw new Exception("Tipo de posto não pode ser vazio e deve ser um inteiro");
    }

    /**
     * @param $latitude
     * @throws Exception
     */
    private function latitudeIsValid($latitude)
    {
        if (!$latitude)
            throw new Exception("Latitude é inválida");
    }

    /**
     * @param $longitude
     * @throws Exception
     */
    private function longitudeIsValid($longitude)
    {
        if (!$longitude)
            throw new Exception("Longitude é inválida");
    }

    /**
     * @param $idStation
     * @throws Exception
     */
    private function stationIdIsValid($idStation)
    {
        if (!$idStation)
            throw new Exception("ID do posto está inválido");
    }

    /**
     * @param $address
     * @throws Exception
     */
    private function addressIsValid($address)
    {
        if (strlen($address) < 5)
            throw new Exception("Endereço inválido");
    }
}