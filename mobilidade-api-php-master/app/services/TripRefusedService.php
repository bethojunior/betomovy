<?php

namespace app\services;

use app\dao\TripRefusedDao;
use app\model\TripRefused;
use app\validator\TripRefusedValidator;

class TripRefusedService 
{
    private $dao;
    private $validator;

    public function __construct()
    {
        $this->dao = new TripRefusedDao;
        $this->validator = new TripRefusedValidator;
    }

    public function create($request)
    {
        $this->validator->validateInsert($request);

        try {
            $tripRefused = new TripRefused;
            $tripRefused
                ->setDriverId($request->driverId)
                ->setTripId($request->tripId)
                ->setId($this->dao->sqlInsert($tripRefused));
            
            return ['id' => $tripRefused->getId()];
        } catch (\PDOException $e) {
            if ($e->getCode() === "23000") {
                throw new \Exception("Esta recusa de viagem já foi registrada");
            }

            throw $e;
        }
    }

    public function find($id) {
        if (empty($id)) {
            throw new \Exception("ID inválido para recusa de viagem");
        }

        $data = $this->dao->find($id);

        if (!$data) {
            throw new \Exception("Recusa de viagem não encontrada");
        }

        return $data;
    }

    public function delete($id) {
        $this->find($id);

        return $this->dao->delete($id);
    }
}