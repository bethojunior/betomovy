<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 01/04/2020
 * Time: 19:27
 */

namespace App\Repositories\Report\Select;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Trip\TripCallType;

class TripCallTypeSelectRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(TripCallType::class);
    }

    public function listBySelect()
    {
        return $this->getModel()
            ::select(
                'id',
                'name AS text')
            ->where('statusId', StatusConst::ACTIVE)
            ->get();
    }
}
