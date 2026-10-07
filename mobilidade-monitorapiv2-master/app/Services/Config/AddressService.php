<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 10/03/2020
 * Time: 13:50
 */

namespace App\Services\Config;


use App\Constants\StatusConst;
use App\Helpers\Config\ConfigHelper;
use App\Models\Config\Address;
use App\Repositories\Config\AddressRepository;
use App\Utils\SeuMiltoPlacesV2;
use DB;
use Throwable;

class AddressService
{
    /**
     * @var AddressRepository
     */
    private $repository;

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
        AddressRepository $repository,
        SeuMiltoPlacesV2 $seuMiltoPlacesV2,
        ConfigHelper $configHelper
    )
    {
        $this->repository = $repository;
        $this->seuMiltoPlacesV2 = $seuMiltoPlacesV2;
        $this->configHelper = $configHelper;
    }

    public function findAll(array $request)
    {
        return $this->repository
            ->findAll($request);
    }

    public function insert(array $request)
    {
        $address = new Address($request);
        $address->manual = true;

        DB::beginTransaction();

        try {
            $this->repository->save($address);

            DB::commit();
        } catch (Throwable $th) {
            DB::rollBack();
            throw $th;
        }

        return $address;
    }

    public function update(array $request)
    {
        $this->delete($request['id']);

        return $this->insert($request);
    }

    public function delete($id)
    {
        $address = $this->repository
            ->find($id);

        $address->statusId = StatusConst::REMOVED;

        $this->repository->save($address);

        return true;
    }

    public function cacheAddress(array $request)
    {
        $query = $request['query'];

        if ((bool) $this->configHelper->get('enable_address_cache_fb704')) {
            return $this->seuMiltoPlacesV2->searchByCustomer($query, env('DB_DATABASE'));
        }

        return $this->repository->getCacheAddress($request['query']);
    }
}
