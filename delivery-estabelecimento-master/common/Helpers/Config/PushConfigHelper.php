<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 08/07/2020
 * Time: 14:30
 */

namespace Common\Helpers\Config;


use Common\Helpers\Traits\ConfigHelperTrait;
use Common\Repositories\Config\PushConfigRepository;

class PushConfigHelper
{
    use ConfigHelperTrait;

    public function __construct(PushConfigRepository $repository)
    {
        $this->repository = $repository;
    }
}
