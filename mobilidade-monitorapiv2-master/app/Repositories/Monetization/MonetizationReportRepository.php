<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/09/2019
 * Time: 14:59
 */

namespace App\Repositories\Monetization;


use App\Contracts\Repository\AbstractRepository;

class MonetizationReportRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(UserIndication::class);
    }

    public function synthetic(array $request = [])
    {
//        return $this->getModel()
//            ::
    }
}
