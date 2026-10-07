<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 28/01/2020
 * Time: 17:06
 */

namespace App\Services\User;


use App\Repositories\User\DependentUserRepository;

class DependentUserService
{
    /**
     * @var DependentUserRepository
     */
    private $repository;

    public function __construct(DependentUserRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getByUser($userId)
    {
        return $this->repository
            ->findByResponsible($userId);
    }
}
