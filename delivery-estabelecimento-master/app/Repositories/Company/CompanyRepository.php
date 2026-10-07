<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 21/05/2020
 * Time: 09:32
 */

namespace App\Repositories\Company;


use Common\Contracts\Repository\AbstractRepository;
use App\Models\Company\Company;

class CompanyRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(Company::class);
    }
}
