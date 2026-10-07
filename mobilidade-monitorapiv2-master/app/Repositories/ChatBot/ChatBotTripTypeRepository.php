<?php


namespace App\Repositories\ChatBot;

use App\Contracts\Repository\AbstractRepository;
use App\Models\ChatBot\ChatBotTripType;

class ChatBotTripTypeRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(ChatBotTripType::class);
    }

    public function all()
    {
        return $this->getModel()
            ::all();
    }

}
