<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 05/06/2020
 * Time: 16:17
 */

namespace App\Repositories\Company;


use Common\Contracts\Repository\AbstractRepository;
use App\Models\Company\CompanyDeliveryConfig;

class CompanyDeliveryConfigRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(CompanyDeliveryConfig::class);
    }

    public function findByCompany(int $companyId)
    {
        return $this->getModel()
            ::where('companyId', $companyId)
            ->first();
    }

}
