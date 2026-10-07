<?php

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 28/06/2020
 * Time: 12:06
 */

namespace App\Services\Config;

use App\Helpers\Config\ConfigHelper;
use App\Models\Config\AddressBlacklist;
use App\Repositories\Config\AddressBlacklistRepository;
use App\Repositories\Config\AddressRepository;
use App\Utils\SeuMiltoPlacesV2;

class AddressBlacklistService
{
    /**
     * @var AddressBlacklistRepository
     */
    private $repository;

    /**
     * @var AddressRepository
     */
    private $addressRepository;

    /**
     * Api de cache fabrica704
     *
     * @var SeuMiltoPlacesV2
     */
    protected $seuMiltoPlacesV2;

    /**
     * Config Helper
     *
     * @var ConfigHelper
     */
    protected $configHelper;

    public function __construct(
        AddressBlacklistRepository $repository,
        AddressRepository $addressRepository,
        SeuMiltoPlacesV2 $seuMiltoPlacesV2,
        ConfigHelper $configHelper
    ) {
        $this->repository = $repository;
        $this->addressRepository = $addressRepository;
        $this->seuMiltoPlacesV2 = $seuMiltoPlacesV2;
        $this->configHelper = $configHelper;
    }

    public function findAll(array $request = [])
    {
        return $this->repository
            ->findAll($request);
    }

    public function approve(AddressBlacklist $addressBlacklist)
    {
        $addressBlacklist->approved = true;
        $addressBlacklist->save();
        $this->addressRepository->changeStatusAddressBlocked($addressBlacklist->address, true);

        $this->deleteAddressFromCache($addressBlacklist->address);

        return $addressBlacklist;
    }

    public function refuse(AddressBlacklist $addressBlacklist)
    {
        $addressBlacklist->approved = false;
        $addressBlacklist->save();
        $this->addressRepository->changeStatusAddressBlocked($addressBlacklist->address, false);

        return $addressBlacklist;
    }

    public function delete(AddressBlacklist $addressBlacklist)
    {
        $this->addressRepository->changeStatusAddressBlocked($addressBlacklist->address, false);
        return $addressBlacklist->delete();
    }

    public function insert(array $request)
    {
        $addressBlacklist = new AddressBlacklist($request);
        $addressBlacklist->approved = true;
        $addressBlacklist->save();

        $this->deleteAddressFromCache($addressBlacklist->address);

        return $addressBlacklist;
    }

    private function deleteAddressFromCache(string $address): ?array
    {
        if ((bool) $this->configHelper->get('enable_address_cache_fb704')) {
            return $this->seuMiltoPlacesV2->deleteByAddress($address, env('DB_DATABASE'));
        }

        return null;
    }
}
