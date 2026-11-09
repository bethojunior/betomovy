<?php

namespace app\controllers;

use app\services\RequiredFieldService;
use Exception;
use PDO;

/**
 * Controller para gerenciar campos obrigatórios e códigos de confirmação
 */
class RequiredFieldController extends ApiController
{
    public function actionIndex()
    {
        try {
            $userTypeId = isset($_GET['userTypeId']) ? (int)$_GET['userTypeId'] : 2;
            $fullFields = isset($_GET['fullFields']) && (int)$_GET['fullFields'] === 1;

            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
            $where = $fullFields ? "" : "AND required = 1";
            $stmt = $pdo->prepare("SELECT * FROM requiredField WHERE userTypeId = :userTypeId {$where} ORDER BY id ASC");
            $stmt->execute([':userTypeId' => $userTypeId]);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $data = array_map(function ($field) {
                return [
                    'id' => (int)$field['id'],
                    'userTypeId' => (int)$field['userTypeId'],
                    'field' => $field['field'],
                    'description' => $field['description'],
                    'compelField' => (bool)$field['compelField'],
                    'required' => (bool)$field['required']
                ];
            }, $rows ?: []);

            echo $this->returnSuccess("Campos obrigatórios encontrados com sucesso", $data);
        } catch (\Throwable $e) {
            echo $this->returnSuccess("Campos obrigatórios", []);
        }
    }

    public function actionGet()
    {
        try {
            $request = $this->requestQuery();

            echo $this->returnSuccess("Campos obrigatórios encontrados com sucesso",
                (new RequiredFieldService)
                    ->find($request)
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar os campos obrigatórios");
        }
    }

    public function actionConfirmationCodeCustomer()
    {
        try {
            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
            $stmt = $pdo->prepare("SELECT * FROM requiredField WHERE userTypeId = 2 AND field IN ('validateSms', 'validateEmail') ORDER BY id ASC");
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (empty($rows)) {
                // Inserir valores padrão caso não existam
                try {
                    $pdo->prepare("
                        INSERT INTO requiredField (userTypeId, field, description, compelField, required) 
                        VALUES (2, 'validateSms', 'Validar via SMS', 1, 1),
                               (2, 'validateEmail', 'Validar via E-mail', 0, 1)
                    ")->execute();
                    $stmt->execute();
                    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
                } catch (\Throwable $err) {}
            }

            $data = array_map(function($r) {
                return [
                    'id' => (int)$r['id'],
                    'userTypeId' => (int)$r['userTypeId'],
                    'field' => $r['field'],
                    'description' => $r['description'],
                    'compelField' => (int)$r['compelField'],
                    'required' => (int)$r['required']
                ];
            }, $rows ?: []);

            echo $this->returnSuccess('Código de confirmação do cliente', $data);
        } catch (\Throwable $e) {
            echo $this->returnSuccess('Código de confirmação do cliente', [
                ['id' => 1, 'userTypeId' => 2, 'field' => 'validateSms', 'description' => 'Validar via SMS', 'compelField' => 1, 'required' => 1],
                ['id' => 2, 'userTypeId' => 2, 'field' => 'validateEmail', 'description' => 'Validar via E-mail', 'compelField' => 0, 'required' => 1]
            ]);
        }
    }

    public function actionChangeConfirmationCode()
    {
        try {
            $body = json_decode(file_get_contents('php://input'), true) ?: $_POST;
            $type = $body['type'] ?? 'sms';
            $field = ($type === 'sms') ? 'validateSms' : 'validateEmail';
            $val = (!empty($body['value']) && $body['value'] !== 'false' && $body['value'] !== false) ? 1 : 0;

            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
            $upd = $pdo->prepare("UPDATE requiredField SET compelField = :val WHERE userTypeId = 2 AND field = :field");
            $upd->execute([':val' => $val, ':field' => $field]);

            if ($upd->rowCount() === 0) {
                $desc = ($type === 'sms') ? 'Validar via SMS' : 'Validar via E-mail';
                $pdo->prepare("INSERT INTO requiredField (userTypeId, field, description, compelField, required) VALUES (2, :field, :desc, :val, 1)")
                    ->execute([':field' => $field, ':desc' => $desc, ':val' => $val]);
            }

            echo $this->returnSuccess('Tipo de código de confirmação alterado com sucesso');
        } catch (\Throwable $e) {
            echo $this->returnError($e);
        }
    }
}
