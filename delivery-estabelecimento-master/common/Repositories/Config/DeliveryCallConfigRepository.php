<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 09/07/2020
 * Time: 14:49
 */

namespace Common\Repositories\Config;


use Common\Contracts\Repository\AbstractRepository;
use Common\Models\Config\DeliveryCallConfig;
use Common\Repositories\Traits\ConfigRepositoryTrait;

class DeliveryCallConfigRepository extends AbstractRepository
{
    use ConfigRepositoryTrait;

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(DeliveryCallConfig::class);
    }
}
