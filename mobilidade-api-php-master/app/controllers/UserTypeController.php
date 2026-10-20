<?php

namespace app\controllers;

use app\services\UserTypeService;
use app\utils\Connection;
use Exception;
use PDO;

class UserTypeController extends ApiController
{
    public function actionIndex()
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

        if (!$id) {
            $path = explode('/', trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'));
            if (isset($path[1]) && is_numeric($path[1])) {
                $id = (int)$path[1];
            }
        }

        if (strtoupper($method) === 'POST') {
            if ($id > 0) {
                $this->handleUpdate($id);
            } else {
                $this->handleCreate();
            }
            return;
        }

        if (strtoupper($method) === 'DELETE') {
            $this->handleDelete($id);
            return;
        }

        $this->actionDrivers();
    }

    public function actionDrivers()
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL_RO);

            $sql = "
                SELECT 
                    ut.idUserType,
                    ut.name,
                    ut.isDriver,
                    ut.isDeliveryMan,
                    ut.description,
                    ut.isActive,
                    ut.picture,
                    ut.vehicleType,
                    ut.statusId,
                    ut.iconMapDriverId,
                    ut.acceptedText,
                    ut.boardingText,
                    ut.inProgressText,
                    ut.cancellationText
                FROM userType ut
                WHERE (ut.statusId = 1 OR ut.statusId IS NULL)
                  AND (ut.isDriver = 1 OR ut.isDeliveryMan = 1)
                ORDER BY ut.name ASC
            ";

            $stmt = $pdo->query($sql);
            $driverTypes = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Fetch linked app partners
            $stmtLinked = $pdo->query("
                SELECT utl.userTypeId, utl.config_apps_partners_id, cap.id, cap.name_app, cap.key
                FROM userTypeLinkedAppPartner utl
                LEFT JOIN config_apps_partners cap ON cap.id = utl.config_apps_partners_id
            ");
            $linkedRows = $stmtLinked->fetchAll(PDO::FETCH_ASSOC);

            $linkedMap = [];
            foreach ($linkedRows as $lr) {
                $uId = (int)$lr['userTypeId'];
                if (!isset($linkedMap[$uId])) {
                    $linkedMap[$uId] = [];
                }
                $linkedMap[$uId][] = [
                    'config_apps_partners_id' => (int)$lr['config_apps_partners_id'],
                    'config_app_partners' => [
                        'id' => (int)$lr['id'],
                        'name_app' => $lr['name_app'],
                        'key' => $lr['key']
                    ]
                ];
            }

            foreach ($driverTypes as &$dt) {
                $dt['idUserType'] = (int)$dt['idUserType'];
                $dt['isActive'] = (int)($dt['isActive'] ?? 1);
                $dt['isDriver'] = (int)($dt['isDriver'] ?? 1);
                $dt['isDeliveryMan'] = (int)($dt['isDeliveryMan'] ?? 0);
                $dt['iconMapDriverId'] = (int)($dt['iconMapDriverId'] ?? 1);
                $dt['user_type_linked_app_partner'] = $linkedMap[$dt['idUserType']] ?? [];
            }
            unset($dt);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Tipos de motoristas ativos',
                'response' => $driverTypes,
                'data' => $driverTypes,
                'errors' => null
            ]);
        } catch (Exception $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao listar tipos de motorista: ' . $e->getMessage(),
                'response' => [],
                'data' => []
            ]);
        }
    }

    private function handleCreate()
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL);

            $name = trim($_POST['name'] ?? '');
            if (empty($name)) {
                throw new Exception("Nome do tipo de motorista é obrigatório");
            }

            // Picture upload
            $pictureUrl = 'https://api.movymob.com/uploads/userType/default.png';
            if (isset($_FILES['picture']) && $_FILES['picture']['error'] === UPLOAD_ERR_OK) {
                $ext = pathinfo($_FILES['picture']['name'], PATHINFO_EXTENSION) ?: 'png';
                $filename = 'drivertype_' . time() . '_' . uniqid() . '.' . $ext;
                $uploadDir = __DIR__ . '/../../public/uploads/userType/';
                if (!is_dir($uploadDir)) {
                    @mkdir($uploadDir, 0777, true);
                }
                move_uploaded_file($_FILES['picture']['tmp_name'], $uploadDir . $filename);
                $pictureUrl = 'https://api.movymob.com/uploads/userType/' . $filename;
            } elseif (!empty($_POST['picture'])) {
                $pictureUrl = trim($_POST['picture']);
            }

            $vehicleType = in_array($_POST['vehicleType'] ?? 'car', ['car', 'bike']) ? $_POST['vehicleType'] : 'car';
            $isActive = isset($_POST['isActive']) ? (int)$_POST['isActive'] : 1;
            $iconMapDriverId = !empty($_POST['iconMapDriverId']) ? (int)$_POST['iconMapDriverId'] : 1;
            $isDeliveryMan = isset($_POST['isDeliveryMan']) ? (int)$_POST['isDeliveryMan'] : 0;
            $boardingText = $_POST['boardingText'] ?? 'Seu carro está te aguardando';
            $acceptedText = $_POST['acceptedText'] ?? 'Seu motorista vai chegar em breve';
            $inProgressText = $_POST['inProgressText'] ?? 'Você está no percurso do seu destino';
            $cancellationText = $_POST['cancellationText'] ?? null;

            $stmt = $pdo->prepare("
                INSERT INTO userType (
                    name, isDriver, isDeliveryMan, isActive, picture, 
                    vehicleType, statusId, iconMapDriverId, acceptedText, 
                    boardingText, inProgressText, cancellationText
                ) VALUES (
                    :name, 1, :isDeliveryMan, :isActive, :picture, 
                    :vehicleType, 1, :iconMapDriverId, :acceptedText, 
                    :boardingText, :inProgressText, :cancellationText
                )
            ");
            $stmt->execute([
                ':name' => $name,
                ':isDeliveryMan' => $isDeliveryMan,
                ':isActive' => $isActive,
                ':picture' => $pictureUrl,
                ':vehicleType' => $vehicleType,
                ':iconMapDriverId' => $iconMapDriverId,
                ':acceptedText' => $acceptedText,
                ':boardingText' => $boardingText,
                ':inProgressText' => $inProgressText,
                ':cancellationText' => $cancellationText
            ]);
            $newId = (int)$pdo->lastInsertId();

            // Link app partners if provided
            $idsAppPartners = $_POST['idsAppPartners'] ?? [];
            if (!empty($idsAppPartners) && is_array($idsAppPartners)) {
                $stmtPartner = $pdo->prepare("INSERT INTO userTypeLinkedAppPartner (userTypeId, config_apps_partners_id, created_at, updated_at) VALUES (:uId, :pId, NOW(), NOW())");
                foreach ($idsAppPartners as $pId) {
                    $stmtPartner->execute([':uId' => $newId, ':pId' => (int)$pId]);
                }
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Tipo de motorista criado com sucesso!',
                'response' => ['id' => $newId, 'idUserType' => $newId],
                'data' => ['id' => $newId, 'idUserType' => $newId],
                'errors' => null
            ]);
        } catch (Exception $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao criar tipo de motorista: ' . $e->getMessage(),
                'response' => null,
                'data' => null,
                'errors' => ['message' => $e->getMessage()]
            ]);
        }
    }

    private function handleUpdate(int $id)
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL);

            $name = isset($_POST['name']) ? trim($_POST['name']) : null;
            $vehicleType = isset($_POST['vehicleType']) && in_array($_POST['vehicleType'], ['car', 'bike']) ? $_POST['vehicleType'] : null;
            $isActive = isset($_POST['isActive']) ? (int)$_POST['isActive'] : null;
            $iconMapDriverId = isset($_POST['iconMapDriverId']) && !empty($_POST['iconMapDriverId']) ? (int)$_POST['iconMapDriverId'] : null;
            $isDeliveryMan = isset($_POST['isDeliveryMan']) ? (int)$_POST['isDeliveryMan'] : null;
            $boardingText = $_POST['boardingText'] ?? null;
            $acceptedText = $_POST['acceptedText'] ?? null;
            $inProgressText = $_POST['inProgressText'] ?? null;
            $cancellationText = $_POST['cancellationText'] ?? null;

            $pictureUrl = null;
            if (isset($_FILES['picture']) && $_FILES['picture']['error'] === UPLOAD_ERR_OK) {
                $ext = pathinfo($_FILES['picture']['name'], PATHINFO_EXTENSION) ?: 'png';
                $filename = 'drivertype_' . time() . '_' . uniqid() . '.' . $ext;
                $uploadDir = __DIR__ . '/../../public/uploads/userType/';
                if (!is_dir($uploadDir)) {
                    @mkdir($uploadDir, 0777, true);
                }
                move_uploaded_file($_FILES['picture']['tmp_name'], $uploadDir . $filename);
                $pictureUrl = 'https://api.movymob.com/uploads/userType/' . $filename;
            } elseif (!empty($_POST['picture']) && filter_var($_POST['picture'], FILTER_VALIDATE_URL)) {
                $pictureUrl = trim($_POST['picture']);
            }

            $stmt = $pdo->prepare("
                UPDATE userType SET
                    name = COALESCE(:name, name),
                    picture = COALESCE(:picture, picture),
                    vehicleType = COALESCE(:vehicleType, vehicleType),
                    isActive = COALESCE(:isActive, isActive),
                    iconMapDriverId = COALESCE(:iconMapDriverId, iconMapDriverId),
                    isDeliveryMan = COALESCE(:isDeliveryMan, isDeliveryMan),
                    boardingText = COALESCE(:boardingText, boardingText),
                    acceptedText = COALESCE(:acceptedText, acceptedText),
                    inProgressText = COALESCE(:inProgressText, inProgressText),
                    cancellationText = COALESCE(:cancellationText, cancellationText)
                WHERE idUserType = :id
            ");
            $stmt->execute([
                ':name' => $name,
                ':picture' => $pictureUrl,
                ':vehicleType' => $vehicleType,
                ':isActive' => $isActive,
                ':iconMapDriverId' => $iconMapDriverId,
                ':isDeliveryMan' => $isDeliveryMan,
                ':boardingText' => $boardingText,
                ':acceptedText' => $acceptedText,
                ':inProgressText' => $inProgressText,
                ':cancellationText' => $cancellationText,
                ':id' => $id
            ]);

            // Update app partner links
            if (isset($_POST['idsAppPartners']) && is_array($_POST['idsAppPartners'])) {
                $del = $pdo->prepare("DELETE FROM userTypeLinkedAppPartner WHERE userTypeId = :uId");
                $del->execute([':uId' => $id]);

                $ins = $pdo->prepare("INSERT INTO userTypeLinkedAppPartner (userTypeId, config_apps_partners_id, created_at, updated_at) VALUES (:uId, :pId, NOW(), NOW())");
                foreach ($_POST['idsAppPartners'] as $pId) {
                    $ins->execute([':uId' => $id, ':pId' => (int)$pId]);
                }
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Tipo de motorista atualizado com sucesso!',
                'response' => true,
                'data' => true
            ]);
        } catch (Exception $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao atualizar tipo de motorista: ' . $e->getMessage(),
                'response' => false,
                'data' => false
            ]);
        }
    }

    public function actionEnable()
    {
        try {
            $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
            if ($id <= 0) {
                $path = explode('/', trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'));
                if (isset($path[1]) && is_numeric($path[1])) {
                    $id = (int)$path[1];
                }
            }

            $pdo = Connection::open(Connection::DB_MYSQL);
            $stmt = $pdo->prepare("UPDATE userType SET isActive = 1 WHERE idUserType = :id");
            $stmt->execute([':id' => $id]);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Tipo de motorista ativado com sucesso!',
                'response' => true
            ]);
        } catch (Exception $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['status' => false, 'message' => $e->getMessage(), 'response' => false]);
        }
    }

    public function actionDisable()
    {
        try {
            $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
            if ($id <= 0) {
                $path = explode('/', trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'));
                if (isset($path[1]) && is_numeric($path[1])) {
                    $id = (int)$path[1];
                }
            }

            $pdo = Connection::open(Connection::DB_MYSQL);
            $stmt = $pdo->prepare("UPDATE userType SET isActive = 0 WHERE idUserType = :id");
            $stmt->execute([':id' => $id]);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Tipo de motorista desativado com sucesso!',
                'response' => true
            ]);
        } catch (Exception $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['status' => false, 'message' => $e->getMessage(), 'response' => false]);
        }
    }

    private function handleDelete(int $id)
    {
        try {
            if ($id <= 0) {
                $path = explode('/', trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'));
                if (isset($path[1]) && is_numeric($path[1])) {
                    $id = (int)$path[1];
                }
            }

            if ($id <= 0) {
                throw new Exception("ID inválido");
            }

            $pdo = Connection::open(Connection::DB_MYSQL);

            // Check if users are linked to this driver type
            $stmtCheck = $pdo->prepare("SELECT COUNT(*) FROM levelAccess WHERE userTypeId = :id");
            $stmtCheck->execute([':id' => $id]);
            $linkedCount = (int)$stmtCheck->fetchColumn();

            if ($linkedCount > 0) {
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode([
                    'status' => false,
                    'message' => 'Existem usuários vinculados a esse tipo de motorista',
                    'response' => ['Existem usuários vinculados a esse tipo de motorista'],
                    'data' => ['Existem usuários vinculados a esse tipo de motorista']
                ]);
                return;
            }

            $stmt = $pdo->prepare("UPDATE userType SET statusId = 2, isActive = 0 WHERE idUserType = :id");
            $stmt->execute([':id' => $id]);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Tipo de motorista excluído com sucesso!',
                'response' => true,
                'data' => true
            ]);
        } catch (Exception $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao excluir tipo de motorista: ' . $e->getMessage(),
                'response' => false
            ]);
        }
    }

    public function actionMoveUsers()
    {
        try {
            $path = explode('/', trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'));
            $fromId = (int)($path[1] ?? 0);
            $toId = (int)($path[3] ?? 0);

            if ($fromId <= 0 || $toId <= 0) {
                throw new Exception("IDs de origem e destino inválidos");
            }

            $pdo = Connection::open(Connection::DB_MYSQL);
            $stmt = $pdo->prepare("UPDATE levelAccess SET userTypeId = :toId WHERE userTypeId = :fromId");
            $stmt->execute([':toId' => $toId, ':fromId' => $fromId]);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Usuários transferidos com sucesso!',
                'response' => true,
                'data' => true
            ]);
        } catch (Exception $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao transferir usuários: ' . $e->getMessage(),
                'response' => false
            ]);
        }
    }

    public function actionDriversByAppPartners() 
    {
        try {
            $keyAppPartner = $_GET['app_partner'] ?? '';
            echo $this->returnSuccess("Tipos de motoristas ativos",
                (new UserTypeService())->getDriversByAppPartner($keyAppPartner)
            );
        } catch (Exception $error) {
            echo $this->returnError($error);
        }
    }

    public function actionGetMessageTripCanceled()
    {
        try {
            $tripReference = $_GET['tripReference'] ?? '';
            $message = (new UserTypeService())->getMessageTripCanceled($tripReference);
            echo $this->onlyReturn($message);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
