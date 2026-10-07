<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 29/08/2019
 * Time: 11:13
 */

namespace App\Repositories\Delivery;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Delivery\DeliveryInfoSuggestion;

class DeliveryInfoSuggestionRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(DeliveryInfoSuggestion::class);
    }

    public function findActive()
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->orderByDesc('id')
            ->first();
    }
}
