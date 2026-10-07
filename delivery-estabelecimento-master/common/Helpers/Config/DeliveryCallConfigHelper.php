<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 09/07/2020
 * Time: 14:43
 */

namespace Common\Helpers\Config;


use Common\Helpers\Traits\ConfigHelperTrait;
use Common\Repositories\Config\DeliveryCallConfigRepository;

class DeliveryCallConfigHelper
{
    use ConfigHelperTrait;

    public function __construct(DeliveryCallConfigRepository $repository)
    {
        $this->repository = $repository;
    }
}
