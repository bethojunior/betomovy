<?php


namespace App\Services\ChatBot;


use App\Models\ChatBot\ChatBotTripType;
use App\Repositories\ChatBot\ChatBotTripTypeRepository;
use PhpParser\Node\Stmt\TryCatch;

class ChatBotTripTypeService
{
    private $repository;

    public function __construct(ChatBotTripTypeRepository $repository)
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
     * @return ChatBotTripType
     */
    public function insert(array $request)
    {
        $chatBotTripType = new ChatBotTripType($request);

        $this->repository->save($chatBotTripType);

        return $chatBotTripType;
    }

    /**
     * @param $id
     * @param array $params
     * @return \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model|null
     * @throws \Exception
     */
    public function edit($id, array $params)
    {

        try {

            $result = $this->repository->find($id);

            if (!$result) {
                throw new \Exception("A mensagem automatica não foi encontrada");
            }

            $result->update($params);

        } catch (\Exception $exception) {
            throw $exception;
        }

        return $result;
    }
}
