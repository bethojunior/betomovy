<?php

namespace app\controllers;

use app\utils\Connection;
use Exception;
use PDO;

class CallGroupController extends ApiController
{
    private function ensureTables(PDO $db)
    {
        $db->exec("
            CREATE TABLE IF NOT EXISTS `call_group` (
                `id` int(11) NOT NULL AUTO_INCREMENT,
                `name` varchar(255) NOT NULL,
                `image` varchar(500) DEFAULT NULL,
                `weight` int(11) DEFAULT 0,
                `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ");

        $db->exec("
            CREATE TABLE IF NOT EXISTS `driversLinkedCallGroup` (
                `id` int(11) NOT NULL AUTO_INCREMENT,
                `driverId` int(11) NOT NULL,
                `call_group_id` int(11) NOT NULL,
                `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (`id`),
                KEY `idx_driver` (`driverId`),
                KEY `idx_call_group` (`call_group_id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ");
    }

    public function actionIndex()
    {
        $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

        if ($method === 'POST') {
            return $this->actionCreate();
        }

        if ($method === 'DELETE') {
            return $this->actionDelete();
        }

        if ($method === 'PUT') {
            return $this->actionUpdate();
        }

        try {
            $db = Connection::getConnection(Connection::DB_MYSQL_RW);
            $this->ensureTables($db);

            $stmt = $db->query("SELECT * FROM call_group ORDER BY weight DESC, id ASC");
            $groups = $stmt ? $stmt->fetchAll(PDO::FETCH_ASSOC) : [];

            echo $this->returnSuccess("Grupos de chamados", $groups ?: []);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar grupos de chamados", 200, []);
        }
    }

    public function actionCreate()
    {
        try {
            $db = Connection::getConnection(Connection::DB_MYSQL_RW);
            $this->ensureTables($db);

            $name = $_POST['name'] ?? ($_GET['name'] ?? null);
            $weight = $_POST['weight'] ?? ($_GET['weight'] ?? 0);
            $image = null;

            $input = json_decode(file_get_contents('php://input'), true);
            if ($input) {
                $name = $input['name'] ?? $name;
                $weight = $input['weight'] ?? $weight;
            }

            if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                $fileName = time() . '-' . basename($_FILES['image']['name']);
                $uploadDir = __DIR__ . '/../../public/uploads/';
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0777, true);
                }
                move_uploaded_file($_FILES['image']['tmp_name'], $uploadDir . $fileName);
                $image = '/uploads/' . $fileName;
            }

            $stmt = $db->prepare("INSERT INTO call_group (name, weight, image) VALUES (:name, :weight, :image)");
            $stmt->execute([
                ':name' => $name,
                ':weight' => (int)$weight,
                ':image' => $image
            ]);

            $id = $db->lastInsertId();

            echo $this->returnSuccess("Grupo de chamado cadastrado com sucesso", [
                'id' => $id,
                'name' => $name,
                'weight' => $weight,
                'image' => $image
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao adicionar grupo de chamado");
        }
    }

    public function actionUpdate()
    {
        try {
            $db = Connection::getConnection(Connection::DB_MYSQL_RW);
            $this->ensureTables($db);

            $id = $_GET['id'] ?? ($_POST['id'] ?? null);
            $name = $_POST['name'] ?? null;
            $weight = $_POST['weight'] ?? null;

            $input = json_decode(file_get_contents('php://input'), true);
            if ($input) {
                $id = $input['id'] ?? $id;
                $name = $input['name'] ?? $name;
                $weight = $input['weight'] ?? $weight;
            }

            $stmt = $db->prepare("UPDATE call_group SET name = COALESCE(:name, name), weight = COALESCE(:weight, weight) WHERE id = :id");
            $stmt->execute([
                ':name' => $name,
                ':weight' => $weight !== null ? (int)$weight : null,
                ':id' => $id
            ]);

            echo $this->returnSuccess("Grupo de chamado atualizado com sucesso");
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao atualizar grupo de chamado");
        }
    }

    public function actionDelete()
    {
        try {
            $db = Connection::getConnection(Connection::DB_MYSQL_RW);
            $this->ensureTables($db);

            $id = $_GET['id'] ?? null;
            if ($id) {
                $stmt = $db->prepare("DELETE FROM call_group WHERE id = :id");
                $stmt->execute([':id' => $id]);
            }

            echo $this->returnSuccess("Grupo de chamado deletado com sucesso");
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao deletar grupo de chamado");
        }
    }

    public function actionLinkedDrivers()
    {
        try {
            $db = Connection::getConnection(Connection::DB_MYSQL_RW);
            $this->ensureTables($db);

            $id = $_GET['id'] ?? null;
            if (!$id) {
                echo $this->returnSuccess("Motoristas vinculados", [
                    'data' => [],
                    'last_page' => 1,
                    'total' => 0
                ]);
                return;
            }

            $sql = "
                SELECT dlc.id, dlc.driverId, dlc.call_group_id,
                       d.idDriver, d.profileImage,
                       u.idUser, u.name, u.nickname, u.phone, u.email
                FROM driversLinkedCallGroup dlc
                LEFT JOIN driver d ON d.idDriver = dlc.driverId
                LEFT JOIN user u ON u.idUser = d.userId
                WHERE dlc.call_group_id = :id
                ORDER BY dlc.id DESC
            ";

            $stmt = $db->prepare($sql);
            $stmt->execute([':id' => $id]);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $data = [];
            foreach ($rows as $row) {
                $data[] = [
                    'id' => (int)$row['id'],
                    'driverId' => (int)$row['driverId'],
                    'call_group_id' => (int)$row['call_group_id'],
                    'drivers' => [
                        'idDriver' => (int)$row['idDriver'],
                        'profileImage' => $row['profileImage'],
                        'user' => [
                            'idUser' => (int)$row['idUser'],
                            'name' => $row['name'],
                            'nickname' => $row['nickname'],
                            'phone' => $row['phone'],
                            'email' => $row['email'],
                        ]
                    ]
                ];
            }

            echo $this->returnSuccess("Motoristas vinculados encontrados", [
                'data' => $data,
                'last_page' => 1,
                'total' => count($data)
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao encontrar motoristas vinculados", 200, [
                'data' => [],
                'last_page' => 1,
                'total' => 0
            ]);
        }
    }

    public function actionLinkDriver()
    {
        try {
            $db = Connection::getConnection(Connection::DB_MYSQL_RW);
            $this->ensureTables($db);

            $input = json_decode(file_get_contents('php://input'), true);
            $driverId = $input['idDriver'] ?? ($_POST['idDriver'] ?? null);
            $callGroupId = $input['idCallGroup'] ?? ($_POST['idCallGroup'] ?? null);

            if (!$driverId || !$callGroupId) {
                throw new Exception("Dados incompletos para vincular motorista");
            }

            $check = $db->prepare("SELECT id FROM driversLinkedCallGroup WHERE driverId = :driverId AND call_group_id = :callGroupId");
            $check->execute([':driverId' => $driverId, ':callGroupId' => $callGroupId]);
            if (!$check->fetch()) {
                $stmt = $db->prepare("INSERT INTO driversLinkedCallGroup (driverId, call_group_id) VALUES (:driverId, :callGroupId)");
                $stmt->execute([':driverId' => $driverId, ':callGroupId' => $callGroupId]);
            }

            echo $this->returnSuccess("Motorista vinculado com sucesso");
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao vincular motorista");
        }
    }

    public function actionUnlinkDriver()
    {
        try {
            $db = Connection::getConnection(Connection::DB_MYSQL_RW);
            $this->ensureTables($db);

            $input = json_decode(file_get_contents('php://input'), true);
            $driverId = $input['idDriver'] ?? ($_POST['idDriver'] ?? null);
            $callGroupId = $input['idCallGroup'] ?? ($_POST['idCallGroup'] ?? null);

            if ($driverId && $callGroupId) {
                $stmt = $db->prepare("DELETE FROM driversLinkedCallGroup WHERE driverId = :driverId AND call_group_id = :callGroupId");
                $stmt->execute([':driverId' => $driverId, ':callGroupId' => $callGroupId]);
            }

            echo $this->returnSuccess("Motorista desvinculado com sucesso");
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao desvincular motorista");
        }
    }

    public function actionSearchDriver()
    {
        try {
            $db = Connection::getConnection(Connection::DB_MYSQL_RW);
            $this->ensureTables($db);

            $idCallGroup = $_GET['idCallGroup'] ?? null;
            $nameDriver = $_GET['nameDriver'] ?? '';

            $sql = "
                SELECT dlc.id, dlc.driverId, dlc.call_group_id,
                       d.idDriver, d.profileImage,
                       u.idUser, u.name, u.nickname, u.phone, u.email
                FROM driversLinkedCallGroup dlc
                LEFT JOIN driver d ON d.idDriver = dlc.driverId
                LEFT JOIN user u ON u.idUser = d.userId
                WHERE dlc.call_group_id = :id
            ";

            $params = [':id' => $idCallGroup];
            if (!empty(trim($nameDriver))) {
                $sql .= " AND u.name LIKE :search";
                $params[':search'] = '%' . trim($nameDriver) . '%';
            }

            $sql .= " ORDER BY dlc.id DESC";

            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $data = [];
            foreach ($rows as $row) {
                $data[] = [
                    'id' => (int)$row['id'],
                    'driverId' => (int)$row['driverId'],
                    'call_group_id' => (int)$row['call_group_id'],
                    'drivers' => [
                        'idDriver' => (int)$row['idDriver'],
                        'profileImage' => $row['profileImage'],
                        'user' => [
                            'idUser' => (int)$row['idUser'],
                            'name' => $row['name'],
                            'nickname' => $row['nickname'],
                            'phone' => $row['phone'],
                            'email' => $row['email'],
                        ]
                    ]
                ];
            }

            echo $this->returnSuccess("Motoristas encontrados", [
                'data' => $data,
                'last_page' => 1,
                'total' => count($data)
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao encontrar motoristas", 200, [
                'data' => [],
                'last_page' => 1,
                'total' => 0
            ]);
        }
    }
}
