<?php


namespace App\Repositories\ChatBot;

use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\ChatBot\ChatBotTrip;

class ChatBotTripRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(ChatBotTrip::class);
    }

    public function all()
    {
        return $this->getModel()
            ::where('statusId',StatusConst::ACTIVE)
            ->with("chatBotTripType")
            ->get();
    }

}
