<?php

namespace app\controllers;

use app\dao\GenericDao;
use Exception;

class UserPenaltiesTypeController extends ApiController
{
    public function actionIndex()
    {
        try {
            $method = $_SERVER['REQUEST_METHOD'];

            if ($method === 'GET') {
                $sql = "SELECT idUserPenaltyType, name, statusId, valueRating 
                        FROM userPenaltiesType 
                        WHERE statusId = 1 
                        ORDER BY idUserPenaltyType ASC";
                $rows = GenericDao::query($sql);
                $result = [];

                foreach ($rows as $row) {
                    $row['idUserPenaltyType'] = (int)$row['idUserPenaltyType'];
                    $row['statusId'] = (int)$row['statusId'];
                    $row['valueRating'] = (float)$row['valueRating'];
                    $result[] = $row;
                }

                echo $this->returnSuccess("Tipos de penalidade", $result);
                return;
            }

            if ($method === 'PUT') {
                $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
                $data = $this->request(false);
                if (!$id && isset($data->id)) {
                    $id = (int)$data->id;
                }

                if (!$id) {
                    throw new Exception("ID da penalidade não informado.");
                }

                $value = isset($data->value) ? (float)$data->value : (isset($data->valueRating) ? (float)$data->valueRating : null);
                if ($value === null) {
                    throw new Exception("Valor da penalidade não informado.");
                }

                GenericDao::execute("UPDATE userPenaltiesType SET valueRating = :value WHERE idUserPenaltyType = :id", [
                    ':value' => $value,
                    ':id' => $id
                ]);

                echo $this->returnSuccess("Valor inserido com sucesso");
                return;
            }

            throw new Exception("Método não suportado.");
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao processar tipo de penalidade");
        }
    }
}
