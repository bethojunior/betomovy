<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 15/05/2020
 * Time: 17:12
 */

namespace App\Repositories\Company;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Company\CompanyServiceType;

class CompanyServiceTypeRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(CompanyServiceType::class);
    }
}
