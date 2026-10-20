<?php

namespace app\controllers;

use app\dao\CancellationReasonsDao;
use app\model\Status;
use app\services\CancellationReasonsService;
use Exception;

class CancellationReasonsController extends ApiController
{
    public function actionIndex()
    {
        try {
            $method = $_SERVER['REQUEST_METHOD'];
            $dao = new CancellationReasonsDao();

            if ($method === 'GET') {
                $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
                if ($id) {
                    $item = $dao->find($id);
                    echo $this->returnSuccess("Motivo de cancelamento", $item);
                    return;
                }

                // Listar todos os motivos de cancelamento ativos
                $sql = "SELECT c.*, 
                               ct.name AS type_name,
                               ct.idCancellationReasonsType
                        FROM cancellationReasons c
                        LEFT JOIN cancellationReasonsType ct ON ct.idCancellationReasonsType = c.cancellationReasonsTypeId
                        WHERE c.statusId = :statusId
                        ORDER BY c.idCancellationReasons DESC";

                $rows = $dao->sqlRawSelect($sql, [':statusId' => Status::ATIVO])->get();
                $result = [];

                if (is_array($rows)) {
                    foreach ($rows as $row) {
                        $row['idCancellationReasons'] = (int)$row['idCancellationReasons'];
                        $row['reports'] = (bool)(int)$row['reports'];
                        $row['monetized'] = (bool)(int)$row['monetized'];
                        $row['cancellation_reasons_type'] = [
                            'idCancellationReasonsType' => $row['cancellationReasonsTypeId'],
                            'name' => $row['cancellationReasonsTypeId'] == 1 ? 'Motorista' : ($row['cancellationReasonsTypeId'] == 2 ? 'Cliente' : ($row['type_name'] ?? 'Todos'))
                        ];
                        $result[] = $row;
                    }
                }

                echo $this->returnSuccess("Listando razões de cancelamento", $result);
                return;
            }

            if ($method === 'PUT') {
                $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
                $data = $this->request(false);
                if (!$id && isset($data->id)) {
                    $id = (int)$data->id;
                }

                if (!$id) {
                    throw new Exception("ID do motivo de cancelamento é obrigatório.");
                }

                $name = isset($data->name) ? trim($data->name) : '';
                $typeId = isset($data->cancellationReasonsTypeId) ? (int)$data->cancellationReasonsTypeId : null;
                $reports = !empty($data->reports) ? 1 : 0;
                $monetized = !empty($data->monetized) ? 1 : 0;

                $dao->sqlRawSelect("UPDATE cancellationReasons 
                                    SET name = :name, 
                                        cancellationReasonsTypeId = :typeId, 
                                        reports = :reports, 
                                        monetized = :monetized, 
                                        updated_at = NOW() 
                                    WHERE idCancellationReasons = :id", [
                    ':name' => $name,
                    ':typeId' => $typeId,
                    ':reports' => $reports,
                    ':monetized' => $monetized,
                    ':id' => $id
                ]);

                echo $this->returnSuccess("Motivo de cancelamento editado com sucesso");
                return;
            }

            if ($method === 'DELETE') {
                $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
                if (!$id) {
                    throw new Exception("ID do motivo de cancelamento é obrigatório.");
                }

                $dao->sqlRawSelect("UPDATE cancellationReasons SET statusId = :statusId, updated_at = NOW() WHERE idCancellationReasons = :id", [
                    ':statusId' => Status::INATIVO,
                    ':id' => $id
                ]);

                echo $this->returnSuccess("Item apagado com sucesso");
                return;
            }

            throw new Exception("Método não suportado.");
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionInsert()
    {
        try {
            $data = $this->request(false);
            $name = isset($data->name) ? trim($data->name) : '';
            $typeId = isset($data->cancellationReasonsTypeId) ? (int)$data->cancellationReasonsTypeId : null;
            $reports = !empty($data->reports) ? 1 : 0;
            $monetized = !empty($data->monetized) ? 1 : 0;

            if (empty($name)) {
                throw new Exception("Nome é obrigatório.");
            }

            $dao = new CancellationReasonsDao();
            $dao->sqlRawSelect("INSERT INTO cancellationReasons (name, cancellationReasonsTypeId, reports, monetized, statusId, created_at, updated_at) 
                                VALUES (:name, :typeId, :reports, :monetized, :statusId, NOW(), NOW())", [
                ':name' => $name,
                ':typeId' => $typeId,
                ':reports' => $reports,
                ':monetized' => $monetized,
                ':statusId' => Status::ATIVO
            ]);

            echo $this->returnSuccess("Mensagem de cancelamento inserida com sucesso");
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetAll()
    {
        try {
            echo $this->returnSuccess("Listando razões de cancelamento",
                (new CancellationReasonsService)->getActives());
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetAllCustomer()
    {
        try {
            echo $this->returnSuccess("Listando razões de cancelamento de cliente",
                (new CancellationReasonsService)->getCustomerActives());
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetReports()
    {
        try {
            echo $this->returnSuccess("Listando relatos",
                (new CancellationReasonsService)->getReports());
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
