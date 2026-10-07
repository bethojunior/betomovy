<?php

namespace Delivery\Repositories\Card;

use App\Contracts\Repository\AbstractRepository;
use Delivery\Models\Card\CardFlag;

class CardFlagRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(CardFlag::class);
    }

    public function getCardFlag($cardFlagId){
        return $this->getModel()
            ::query()
            ->where('idCardFlag', $cardFlagId)
            ->value('name');
    }

    public function listFlags(){
        return $this->getModel()
            ::select('*')
            ->get();
    }
}
