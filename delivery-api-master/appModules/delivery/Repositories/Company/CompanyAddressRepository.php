<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 08/07/2020
 * Time: 15:36
 */

namespace Delivery\Repositories\Company;


use App\Contracts\Repository\AbstractRepository;
use Delivery\Models\Company\CompanyAddress;

class CompanyAddressRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(CompanyAddress::class);
    }

    public function findDefaultByCompany(int $companyId)
    {
        return $this->getModel()
            ::where('companyId', $companyId)
            ->where('isDefault', true)
            ->firstOrFail();
    }
}
