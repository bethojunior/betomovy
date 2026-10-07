<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/08/2020
 * Time: 14:10
 */

namespace Common\Repositories\Config;


use Common\Contracts\Repository\AbstractRepository;
use Common\Models\Config\CompanyDeliveryOrderConfig;

class CompanyDeliveryOrderConfigRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(CompanyDeliveryOrderConfig::class);
    }

    public function findByCompany(int $companyId)
    {
        return $this->getModel()
            ::where('companyId', $companyId)
            ->first();
    }
}
