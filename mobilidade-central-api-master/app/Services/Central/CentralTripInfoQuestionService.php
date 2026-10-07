<?php

namespace App\Services\Central;

use App\Models\Central\CentralTripInfoQuestion;
use App\Repositories\Central\CentralTripInfoQuestionRepository;

class CentralTripInfoQuestionService
{
    private $repository;

    public function __construct(CentralTripInfoQuestionRepository $repository)
    {
        $this->repository = $repository;
    }

    public function store($centralId, array $request)
    {
        $centralTripInfoQuestion = new CentralTripInfoQuestion();
        $centralTripInfoQuestion->title = $request['title'];
        $centralTripInfoQuestion->required = $request['required'];
        $centralTripInfoQuestion->centralId = $centralId;
        $centralTripInfoQuestion->save();

        return $centralTripInfoQuestion;
    }

    public function findAllByCentralId($centralId)
    {
        return $this->repository->findAllByCentralId($centralId);
    }

    public function findById($id)
    {
        return $this->repository->findById($id);
    }

    public function update($questionId, array $request)
    {
        $centralTripInfoQuestion = $this->repository->find($questionId);

        $centralTripInfoQuestion->title = $request['title'];
        $centralTripInfoQuestion->required = $request['required'];
        $this->repository->save($centralTripInfoQuestion);

        return $centralTripInfoQuestion;
    }

    public function delete($questionId)
    {
        $centralTripInfoQuestion = $this->repository->find($questionId);

        $centralTripInfoQuestion->delete();

        return true;
    }
}
