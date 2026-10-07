<?php

namespace app\services;
use app\model\AddressBlacklist;
use app\dao\AddressBlacklistDao;
use Exception;
use stdClass;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 28/06/2020
 * Time: 09:47
 */
class AddressBlacklistService
{
    /**
     * @var AddressBlacklistDao
     */
    private $dao;

    public function __construct()
    {
        $this->dao = new AddressBlacklistDao;
    }

    /**
     * Pode ser enviado um array, ou apenas um endereço
     * @param stdClass|null $request
     * @return array|array[]
     * @throws Exception
     */
    public function insert(?stdClass $request): array
    {
        $this->validateRequest($request);

        return array_map(function ($address) {
            return $this->save(
                $address->address,
                $address->latitude ?? null,
                $address->longitude ?? null
            )
                ->toArray();
        }, $request->addresses);
    }

    /**
     * Verifica se o endereço já existe antes de inserir na blacklist
     * @param string $address
     * @param float|null $latitude
     * @param float|null $longitude
     * @return AddressBlacklist
     */
    private function save(string $address, ?float $latitude, ?float $longitude): AddressBlacklist
    {
        $addressBlacklistExists = $this->dao->findByAddress($address);

        if ($addressBlacklistExists)
            return new AddressBlacklist($addressBlacklistExists);

        $addressBlacklist = new AddressBlacklist;
        $addressBlacklist
            ->setAddress($address)
            ->setLatitude($latitude)
            ->setLongitude($longitude)
            ->setId($this->dao->sqlInsert($addressBlacklist));

        return $addressBlacklist;
    }

    /**
     * @param stdClass|null $request
     * @throws Exception
     */
    private function validateRequest(?stdClass $request)
    {
        if (empty($request))
            throw new Exception("A requisição não pode ser vazia");

        if (!isset($request->addresses) && !is_array($request->addresses))
            throw new Exception("Endereço não informado");

        foreach ($request->addresses as $address) {
            if (!isset($address->address))
                throw new Exception("Endereço não informado");

            if (!$address->address)
                throw new Exception("Endereço não pode ser vazio");

            if (isset($address->latitude))
                if (!is_numeric($address->latitude))
                    throw new Exception("Latitude inválida");

            if (isset($address->longitude))
                if (!is_numeric($address->longitude))
                    throw new Exception("Longitude inválida");
        }
    }
}