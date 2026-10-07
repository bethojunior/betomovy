<?php

namespace App\Repositories\Central;

use App\Contracts\Repository\AbstractRepository;
use App\Models\Central\CentralTripInfoQuestion;

class CentralTripInfoQuestionRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(CentralTripInfoQuestion::class);
    }

    public function findAllByCentralId($centralId)
    {
        return $this->getModel()
            ::where('centralId', $centralId)
            ->get([
                'id',
                'title',
                'required',
                'centralId'
            ]);
    }

    public function findById($id)
    {
        return $this->getModel()
            ::find($id, [
                'id',
                'title',
                'required',
                'centralId'
            ]);
    }
}
