<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 01/04/2020
 * Time: 20:15
 */

namespace App\Repositories\Report\Select;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Trip\TripType;

class TripTypeSelectRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(TripType::class);
    }

    public function listBySelect()
    {
        return $this->getModel()
            ::select(
                'idTripType AS id',
                'type AS text')
            ->where('statusId', StatusConst::ACTIVE)
            ->get();
    }
}
