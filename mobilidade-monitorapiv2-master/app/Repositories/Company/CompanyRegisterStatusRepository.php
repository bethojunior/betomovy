<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 28/10/2019
 * Time: 13:48
 */

namespace App\Repositories\Company;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Company\CompanyRegisterStatus;

class CompanyRegisterStatusRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(CompanyRegisterStatus::class);
    }

    public function all()
    {
        return $this->getModel()
            ::all();
    }
}
