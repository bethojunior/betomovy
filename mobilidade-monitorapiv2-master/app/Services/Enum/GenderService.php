<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 30/10/2019
 * Time: 17:23
 */

namespace App\Services\Enum;


use App\Repositories\Enum\GenderRepository;

class GenderService
{
    /**
     * @var GenderRepository
     */
    private $repository;

    public function __construct(GenderRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll()
    {
        return $this->repository
            ->all();
    }
}
