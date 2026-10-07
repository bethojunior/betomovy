<?php

namespace app\services;

use app\model\Address;
use app\dao\AddressDao;
use app\dao\LogDao;
use app\utils\SeuMiltoPlacesV2;
use app\model\Config;
use app\model\Log;
use stdClass;

class AddressService
{
    /**
     * API Seu Milto V2 - Cache de endereços
     *
     * @var SeuMiltoPlacesV2
     */
    private $seumiltoPlacesV2;

    function __construct()
    {
        $this->seumiltoPlacesV2 = new SeuMiltoPlacesV2;
    }

    /**
     * Salvar o endereço no banco e envia para o cache no elasticsearch
     * Envia apenas se o endereço não estiver cadastrado
     *
     * @param stdClass $addressData
     * stdClass $addressData deve conter:
     * - address
     * - latitude
     * - longitude
     * - neighborhood
     * - type (tipo de api que foi gerada o endereço, ex: google, here, mapbox, etc)
     *
     * @return Address|null
     */
    public function saveAddressIfNotExists(stdClass $addressData): ?Address
    {
        // Correção de mapeamento: Frontend envia 'name' para destino, mas Model espera 'address'
        if (!isset($addressData->address) && isset($addressData->name)) {
            $addressData->address = $addressData->name;
        }

        $addressDao = new AddressDao;
        $exists = $addressDao->findBy($addressData->address);

        if (!$exists) {
            $address = $addressDao->create($addressData);

            try {
                if ((bool)Config::get('enable_address_cache_fb704') === true) {
                    $this->seumiltoPlacesV2->insert($address, env('MYSQL_NAME'));
                }
            } catch (\Throwable $th) {
                $log = new Log;
                $log->setMessage($th->getMessage());
                $log->setData($th->getTrace());

                (new LogDao)->insert($log);
            }

            return $address;
        }

        return null;
    }
}
