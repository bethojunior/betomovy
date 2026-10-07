<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/11/2019
 * Time: 09:51
 */

namespace App\Services\Role;


use App\Repositories\Role\UserGroupRepository;

class UserGroupService
{
    /**
     * @var UserGroupRepository
     */
    private $repository;

    public function __construct(UserGroupRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll()
    {
        return $this->repository
            ->findAll();
    }
}
