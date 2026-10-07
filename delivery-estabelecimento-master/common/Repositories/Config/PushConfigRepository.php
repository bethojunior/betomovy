<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 08/07/2020
 * Time: 14:29
 */

namespace Common\Repositories\Config;


use Common\Contracts\Repository\AbstractRepository;
use Common\Models\Config\PushConfig;
use Common\Repositories\Traits\ConfigRepositoryTrait;

class PushConfigRepository extends AbstractRepository
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
        $this->setModel(PushConfig::class);
    }
}
