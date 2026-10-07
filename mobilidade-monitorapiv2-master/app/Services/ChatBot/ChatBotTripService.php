<?php


namespace App\Services\ChatBot;


use App\Constants\StatusConst;
use App\Exceptions\Trip\ChatBotTripException;
use App\Models\ChatBot\ChatBotTrip;
use App\Repositories\ChatBot\ChatBotTripRepository;
use mysql_xdevapi\Exception;

class ChatBotTripService
{
    private $repository;

    public function __construct(ChatBotTripRepository $repository)
    {
        $this->repository = $repository;
    }


    /**
     * @return \Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model[]
     */
    public function findAll()
    {
        return $this->repository->all();
    }


    /**
     * @param array $request
     * @return ChatBotTrip
     */
    public function insert(array $request)
    {
        $chatBotTrip = new ChatBotTrip($request);

        $this->repository->save($chatBotTrip);

        return $chatBotTrip;
    }


    /**
     * @param $id
     * @param array $params
     * @return \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model|null
     * @throws \Exception
     */
    public function edit($id, array $params)
    {
        $result = $this->repository->find($id);

        if (!$result) {
            throw new ChatBotTripException("Mensagem não encontrada");
        }
        $result->update($params);

        return $result;
    }


    /**
     * @param $id
     * @return bool
     */
    public function delete($id)
    {
        $result = $this->repository->find($id);
        $result->statusId = StatusConst::REMOVED;

        return $this->repository->save($result);
    }
}
