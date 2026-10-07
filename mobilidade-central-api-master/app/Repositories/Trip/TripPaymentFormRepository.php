<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/06/2019
 * Time: 18:10
 */

namespace App\Repositories\Trip;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Trip\TripPaymentForm;

class TripPaymentFormRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(TripPaymentForm::class);
    }

    public function findAll()
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->where('active', 1)
            ->get();
    }

    public function findById($id) {
        return $this->getModel()
            ::where('idTripPaymentForm', $id)
            ->first();
    }
}
