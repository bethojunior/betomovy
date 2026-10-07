<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 02/09/2019
 * Time: 14:00
 */

namespace App\Repositories\Freight;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Freight\Item;

class ItemRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(Item::class);
    }

    public function all()
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->get();
    }
}
