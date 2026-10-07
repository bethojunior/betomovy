<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 16/10/2019
 * Time: 14:09
 */

namespace App\Services\Enum;


use App\Repositories\Enum\WeekDayRepository;

class WeekDayService
{
    /**
     * @var WeekDayRepository
     */
    private $repository;

    public function __construct(WeekDayRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll()
    {
        return $this->repository->findAll();
    }
}
