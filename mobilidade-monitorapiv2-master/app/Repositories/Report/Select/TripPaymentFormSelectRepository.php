<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/03/2020
 * Time: 10:25
 */

namespace App\Repositories\Report\Select;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Trip\TripPaymentForm;

class TripPaymentFormSelectRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(TripPaymentForm::class);
    }

    public function listBySelect()
    {
        return $this->getModel()
            ::select(
                'idTripPaymentForm AS id',
                'name AS text')
            ->where('statusId', StatusConst::ACTIVE)
            ->get();
    }
}
