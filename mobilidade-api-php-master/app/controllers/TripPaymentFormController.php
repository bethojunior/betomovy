<?php

namespace app\controllers;

use app\dao\TripPaymentFormDao;
use Exception;
use PDO;

/**
 * Controller para gerenciamento de Formas de Pagamento de Viagem
 */
class TripPaymentFormController extends ApiController
{
    public function actionIndex()
    {
        $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        $id = $_GET['id'] ?? null;

        if ($method === 'POST') {
            return $this->actionInsert();
        } elseif ($method === 'PUT') {
            return $this->actionEdit($id);
        } elseif ($method === 'DELETE') {
            return $this->actionDelete($id);
        } else {
            return $this->actionGetAll();
        }
    }

    public function actionGetAll()
    {
        try {
            $conn = \app\utils\Connection::open();
            $stmt = $conn->query("
                SELECT
                    tpf.idTripPaymentForm,
                    tpf.name,
                    tpf.paymentFormTypeId,
                    tpf.active,
                    tpf.statusId,
                    pft.id AS typeId,
                    pft.name AS typeName,
                    pft.description AS typeDescription,
                    pft.showable,
                    pft.isGeneral
                FROM tripPaymentForm tpf
                LEFT JOIN paymentFormType pft ON pft.id = tpf.paymentFormTypeId
                WHERE tpf.statusId = 1
                ORDER BY tpf.idTripPaymentForm DESC
            ");
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $result = array_map(function ($row) {
                return [
                    'idTripPaymentForm' => (int)$row['idTripPaymentForm'],
                    'name' => $row['name'],
                    'paymentFormTypeId' => (int)$row['paymentFormTypeId'],
                    'active' => (int)$row['active'],
                    'statusId' => (int)$row['statusId'],
                    'description' => $row['typeDescription'] ?? $row['name'],
                    'payment_form_type' => [
                        'id' => (int)($row['typeId'] ?: $row['paymentFormTypeId']),
                        'name' => $row['typeName'] ?? $row['name'],
                        'description' => $row['typeDescription'] ?? $row['name'],
                        'showable' => (int)($row['showable'] ?? 1),
                        'isGeneral' => (int)($row['isGeneral'] ?? 0),
                    ]
                ];
            }, $rows);

            echo $this->returnSuccess("Listando formas de pagamento da viagem", $result);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionInsert()
    {
        try {
            $raw = file_get_contents('php://input');
            $data = json_decode($raw, true);
            if (!is_array($data) || empty($data)) {
                $data = $_POST;
            }

            $name = trim($data['name'] ?? '');
            $paymentFormTypeId = (int)($data['paymentFormTypeId'] ?? 0);

            if (empty($name)) {
                echo $this->returnError(null, "O campo descrição/nome é obrigatório", 400);
                return;
            }

            if ($paymentFormTypeId <= 0) {
                echo $this->returnError(null, "O tipo de forma de pagamento é obrigatório", 400);
                return;
            }

            $conn = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
            $stmt = $conn->prepare("
                INSERT INTO tripPaymentForm (name, paymentFormTypeId, active, statusId)
                VALUES (:name, :paymentFormTypeId, 1, 1)
            ");
            $stmt->execute([
                ':name' => $name,
                ':paymentFormTypeId' => $paymentFormTypeId,
            ]);

            $id = (int)$conn->lastInsertId();

            $stmtGet = $conn->prepare("
                SELECT tpf.*, pft.id as typeId, pft.name as typeName, pft.description as typeDescription, pft.showable, pft.isGeneral
                FROM tripPaymentForm tpf
                LEFT JOIN paymentFormType pft ON pft.id = tpf.paymentFormTypeId
                WHERE tpf.idTripPaymentForm = :id
            ");
            $stmtGet->execute([':id' => $id]);
            $inserted = $stmtGet->fetch(PDO::FETCH_ASSOC);

            echo $this->returnSuccess("Forma de pagamento criada com sucesso", [
                'idTripPaymentForm' => $id,
                'name' => $name,
                'paymentFormTypeId' => $paymentFormTypeId,
                'active' => 1,
                'statusId' => 1,
                'description' => $inserted['typeDescription'] ?? $name,
                'payment_form_type' => [
                    'id' => $paymentFormTypeId,
                    'name' => $inserted['typeName'] ?? $name,
                    'description' => $inserted['typeDescription'] ?? $name,
                    'showable' => (int)($inserted['showable'] ?? 1),
                    'isGeneral' => (int)($inserted['isGeneral'] ?? 0),
                ]
            ]);
        } catch (\Throwable $e) {
            echo $this->returnError($e, "Erro ao inserir forma de pagamento");
        }
    }

    public function actionEdit($id = null)
    {
        try {
            $id = $id ?: ($_GET['id'] ?? null);
            if (!$id) {
                echo $this->returnError(null, "ID não informado", 400);
                return;
            }

            $raw = file_get_contents('php://input');
            $data = json_decode($raw, true);
            if (!is_array($data) || empty($data)) {
                $data = $_POST;
            }

            $name = trim($data['name'] ?? '');
            $paymentFormTypeId = !empty($data['paymentFormTypeId']) ? (int)$data['paymentFormTypeId'] : null;

            $conn = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
            if ($name !== '' && $paymentFormTypeId) {
                $stmt = $conn->prepare("UPDATE tripPaymentForm SET name = :name, paymentFormTypeId = :typeId WHERE idTripPaymentForm = :id");
                $stmt->execute([':name' => $name, ':typeId' => $paymentFormTypeId, ':id' => $id]);
            } elseif ($name !== '') {
                $stmt = $conn->prepare("UPDATE tripPaymentForm SET name = :name WHERE idTripPaymentForm = :id");
                $stmt->execute([':name' => $name, ':id' => $id]);
            } elseif ($paymentFormTypeId) {
                $stmt = $conn->prepare("UPDATE tripPaymentForm SET paymentFormTypeId = :typeId WHERE idTripPaymentForm = :id");
                $stmt->execute([':typeId' => $paymentFormTypeId, ':id' => $id]);
            }

            echo $this->returnSuccess("Forma de pagamento atualizada com sucesso", ['id' => (int)$id]);
        } catch (\Throwable $e) {
            echo $this->returnError($e, "Erro ao editar forma de pagamento");
        }
    }

    public function actionDelete($id = null)
    {
        try {
            $id = $id ?: ($_GET['id'] ?? null);
            if (!$id) {
                echo $this->returnError(null, "ID não informado", 400);
                return;
            }

            $conn = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
            $stmt = $conn->prepare("UPDATE tripPaymentForm SET statusId = 2 WHERE idTripPaymentForm = :id");
            $stmt->execute([':id' => $id]);

            echo $this->returnSuccess("Forma de pagamento excluída com sucesso", ['id' => (int)$id]);
        } catch (\Throwable $e) {
            echo $this->returnError($e, "Erro ao deletar forma de pagamento");
        }
    }

    public function actionEnable($id = null)
    {
        try {
            $id = $id ?: ($_GET['id'] ?? null);
            $conn = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
            $stmt = $conn->prepare("UPDATE tripPaymentForm SET active = 1 WHERE idTripPaymentForm = :id");
            $stmt->execute([':id' => $id]);
            echo $this->returnSuccess("Habilitado com sucesso", ['id' => (int)$id]);
        } catch (\Throwable $e) {
            echo $this->returnError($e);
        }
    }

    public function actionDisable($id = null)
    {
        try {
            $id = $id ?: ($_GET['id'] ?? null);
            $conn = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
            $stmt = $conn->prepare("UPDATE tripPaymentForm SET active = 0 WHERE idTripPaymentForm = :id");
            $stmt->execute([':id' => $id]);
            echo $this->returnSuccess("Desabilitado com sucesso", ['id' => (int)$id]);
        } catch (\Throwable $e) {
            echo $this->returnError($e);
        }
    }
}