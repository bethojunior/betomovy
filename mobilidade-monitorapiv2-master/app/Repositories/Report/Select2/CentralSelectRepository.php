<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/08/2020
 * Time: 15:30
 */

namespace App\Repositories\Report\Select2;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Central\Central;

class CentralSelectRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(Central::class);
    }

    public function listBySelect2(array $request)
    {
        $name = isset($request['q']) ? "%{$request['q']}%" : '';

        return $this->getModel()
            ::where('central.statusId', StatusConst::ACTIVE)
            ->where('central.name', 'LIKE', $name)
            ->select('central.id', 'central.name AS text')
            ->get();
    }
}
