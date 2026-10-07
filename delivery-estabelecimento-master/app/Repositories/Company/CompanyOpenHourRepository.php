<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/06/2020
 * Time: 15:17
 */

namespace App\Repositories\Company;


use Common\Contracts\Repository\AbstractRepository;
use App\Models\Company\CompanyOpenHour;

class CompanyOpenHourRepository extends AbstractRepository
{
    /**
     * CompanyOpenHourRepository constructor.
     */
    public function __construct()
    {
        $this->setModel(CompanyOpenHour::class);
    }

    public function removeAllFromCompany(int $companyId)
    {
        return $this->getModel()
            ::where('companyId', $companyId)
            ->delete();
    }

    public function findByCompany(int $companyId)
    {
        return $this->getModel()
            ::where('companyId', $companyId)
            ->get();
    }
}
