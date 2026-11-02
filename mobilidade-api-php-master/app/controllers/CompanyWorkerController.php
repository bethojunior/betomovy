<?php

namespace app\controllers;

use app\dao\GenericDao;
use app\services\CompanyWorkerService;
use Exception;

/**
 * Controller de Colaboradores de Empresas (Workers)
 */
class CompanyWorkerController extends ApiController
{
    public function actionIndex()
    {
        try {
            $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

            if ($method === 'POST') {
                return $this->handleInsertWorker();
            }

            if ($method === 'DELETE') {
                return $this->handleDeleteWorker();
            }

            echo $this->returnSuccess("CompanyWorker API", []);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    private function handleInsertWorker()
    {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true) ?: $_POST;

        $companyId = isset($body['companyId']) ? (int)$body['companyId'] : null;
        $userId = isset($body['userId']) ? (int)$body['userId'] : (isset($body['idUser']) ? (int)$body['idUser'] : null);

        if (!$companyId || !$userId) {
            throw new Exception("Dados insuficientes: companyId e userId são obrigatórios");
        }

        // Verifica se já existe o vínculo
        $existing = GenericDao::first("SELECT id, statusId FROM companyWorker WHERE companyId = :cId AND userId = :uId LIMIT 1", [
            ':cId' => $companyId,
            ':uId' => $userId
        ]);

        if ($existing) {
            GenericDao::execute("UPDATE companyWorker SET statusId = 1, isBlocked = 0, updated_at = NOW() WHERE id = :id", [
                ':id' => $existing['id']
            ]);
            $workerId = (int)$existing['id'];
        } else {
            GenericDao::execute("INSERT INTO companyWorker (companyId, userId, statusId, isBlocked, created_at, updated_at) VALUES (:cId, :uId, 1, 0, NOW(), NOW())", [
                ':cId' => $companyId,
                ':uId' => $userId
            ]);
            $last = GenericDao::first("SELECT LAST_INSERT_ID() as id");
            $workerId = (int)($last['id'] ?? 0);
        }

        echo $this->returnSuccess("Usuário adicionado com sucesso!", [
            'id' => $workerId,
            'companyId' => $companyId,
            'userId' => $userId
        ]);
    }

    private function handleDeleteWorker()
    {
        $id = isset($_GET['id']) && is_numeric($_GET['id']) ? (int)$_GET['id'] : null;

        if (!$id) {
            $raw = file_get_contents('php://input');
            $body = json_decode($raw, true) ?: [];
            $id = isset($body['id']) ? (int)$body['id'] : null;
        }

        if (!$id) {
            throw new Exception("ID do colaborador não informado");
        }

        // Pode ser o id de companyWorker ou userId
        $cw = GenericDao::first("SELECT id FROM companyWorker WHERE id = :id OR userId = :id LIMIT 1", [':id' => $id]);
        if ($cw) {
            GenericDao::execute("UPDATE companyWorker SET statusId = 2, updated_at = NOW() WHERE id = :id", [':id' => $cw['id']]);
        }

        echo $this->returnSuccess("Colaborador desvinculado com sucesso!", ['id' => $id]);
    }

    public function actionDelete()
    {
        try {
            $this->handleDeleteWorker();
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionFieldCheck()
    {
        try {
            echo $this->returnSuccess("Campo permitido",
                (new CompanyWorkerService)->fieldCheck($this->requestQuery())
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro na verificação do campo");
        }
    }
}
