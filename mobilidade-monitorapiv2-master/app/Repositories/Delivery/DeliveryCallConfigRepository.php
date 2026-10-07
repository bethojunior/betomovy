<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/07/2020
 * Time: 11:44
 */

namespace App\Repositories\Delivery;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Delivery\DeliveryCallConfig;

class DeliveryCallConfigRepository extends AbstractRepository
{

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
