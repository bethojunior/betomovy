<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/06/2019
 * Time: 18:29
 */

namespace App\Services\Locale;


use App\Repositories\Locale\CityRepository;

class CityService
{
    /**
     * @var CityRepository
     */
    private $repository;

    public function __construct(CityRepository $repository)
    {
        $this->repository = $repository;
    }

    public function all($query = null, $estateId = null)
    {
        return $this->repository
            ->all($query, $estateId);
    }
}
