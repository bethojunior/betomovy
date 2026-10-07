<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 30/10/2019
 * Time: 17:39
 */

namespace App\Services\Advertising;


use App\Repositories\Advertising\AdvertisingAppSiteRepository;

class AdvertisingAppSiteService
{
    /**
     * @var AdvertisingAppSiteRepository
     */
    private $repository;

    public function __construct(AdvertisingAppSiteRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll()
    {
        return $this->repository
            ->all();
    }
}
