<?php

namespace app\controllers;
use app\services\TripTypeService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/07/2019
 * Time: 16:36
 */
class TripTypeController extends ApiController
{
    public function actionIndex()
    {
        try {
            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
            $stmt = $pdo->query("
                SELECT 
                    idTripType,
                    idTripType as id,
                    type,
                    name,
                    description,
                    picture,
                    statusId,
                    COALESCE(serviceOption, 0) as serviceOption
                FROM tripType
                WHERE statusId = 1
                ORDER BY idTripType ASC
            ");
            $list = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Tipos de viagem encontrados',
                'data' => $list,
                'response' => $list,
                'errors' => null
            ]);
        } catch (\Throwable $e) {
            $this->actionActives();
        }
    }

    public function actionActives()
    {
        try {
            echo $this->returnSuccess("Tipos de viagens encontradas",
                (new TripTypeService)
                    ->findActives()
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar tipos de viagens");
        }
    }

    public function actionFindByLocale()
    {
        try {
            $result = (new TripTypeService)
                ->findByLocale($this->requestQuery());

            echo $this->returnSuccess("Sucesso", $result);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}