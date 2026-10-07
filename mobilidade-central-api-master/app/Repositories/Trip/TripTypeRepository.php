<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/06/2019
 * Time: 22:01
 */

namespace App\Repositories\Trip;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Trip\TripType;

class TripTypeRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(TripType::class);
    }

    public function findAll()
    {
        return $this->getModel()
            ::where('showType', 1)
            ->where('statusId', StatusConst::ACTIVE)
            ->get();
    }
}
