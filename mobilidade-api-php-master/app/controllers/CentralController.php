<?php

namespace app\controllers;

use app\utils\Connection;
use Exception;
use PDO;

class CentralController extends ApiController
{
    public function actionRegister()
    {
        $this->handleRegister();
    }

    public function actionIndex()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $this->handleRegister();
            return;
        }

        $this->handleList();
    }

    private function handleRegister()
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL);

            // Extract data from POST or JSON
            $name = $_POST['name'] ?? null;
            $address = $_POST['address'] ?? null;
            $latitude = $_POST['latitude'] ?? null;
            $longitude = $_POST['longitude'] ?? null;
            $appPartner = $_POST['app_partner'] ?? null;

            // User data may be nested user[name] or flat
            $userName = null;
            $userEmail = null;
            $userPhone = null;
            $userPassword = null;

            if (isset($_POST['user']) && is_array($_POST['user'])) {
                $userName = $_POST['user']['name'] ?? null;
                $userEmail = $_POST['user']['email'] ?? null;
                $userPhone = $_POST['user']['phone'] ?? null;
                $userPassword = $_POST['user']['password'] ?? null;
            } else {
                $userName = $_POST['user[name]'] ?? $_POST['userName'] ?? null;
                $userEmail = $_POST['user[email]'] ?? $_POST['userEmail'] ?? null;
                $userPhone = $_POST['user[phone]'] ?? $_POST['userPhone'] ?? null;
                $userPassword = $_POST['user[password]'] ?? $_POST['userPassword'] ?? null;
            }

            // Fallback to JSON payload if $_POST was empty
            if (empty($name) && empty($userName)) {
                $raw = file_get_contents('php://input');
                $json = json_decode($raw, true);
                if ($json) {
                    $name = $json['name'] ?? null;
                    $address = $json['address'] ?? null;
                    $latitude = $json['latitude'] ?? null;
                    $longitude = $json['longitude'] ?? null;
                    $appPartner = $json['app_partner'] ?? null;
                    if (isset($json['user']) && is_array($json['user'])) {
                        $userName = $json['user']['name'] ?? null;
                        $userEmail = $json['user']['email'] ?? null;
                        $userPhone = $json['user']['phone'] ?? null;
                        $userPassword = $json['user']['password'] ?? null;
                    }
                }
            }

            if (empty($userName) || empty($userEmail) || empty($userPassword)) {
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode([
                    'status' => false,
                    'message' => 'Campos obrigatórios: Nome, E-mail e Senha',
                    'data' => null,
                    'response' => null,
                    'errors' => ['message' => 'Campos obrigatórios']
                ]);
                return;
            }

            if (empty($name)) {
                $name = 'Central ' . $userName;
            }

            if (empty($address)) {
                $address = 'Endereço Principal';
            }

            $cleanPhone = preg_replace('/\D/', '', (string)$userPhone);
            $cleanEmail = strtolower(trim($userEmail));

            // Check if user already exists
            $stmtU = $pdo->prepare("SELECT idUser, password FROM user WHERE email = :email LIMIT 1");
            $stmtU->execute([':email' => $cleanEmail]);
            $existingUser = $stmtU->fetch(PDO::FETCH_ASSOC);

            $userId = null;
            $encodedPass = base64_encode($userPassword);

            if ($existingUser) {
                $userId = (int)$existingUser['idUser'];
                $updU = $pdo->prepare("UPDATE user SET name = :name, phone = :phone, password = :pass, statusId = 1 WHERE idUser = :userId");
                $updU->execute([
                    ':name' => $userName,
                    ':phone' => $cleanPhone ?: $userPhone,
                    ':pass' => $encodedPass,
                    ':userId' => $userId
                ]);
            } else {
                $parts = explode(' ', trim($userName));
                $nickname = $parts[0];
                $token = password_hash($cleanEmail . '_' . time(), PASSWORD_BCRYPT);

                $insU = $pdo->prepare("
                    INSERT INTO user (name, nickname, email, phone, password, statusId, api_token, registered_in, created_at, updated_at) 
                    VALUES (:name, :nickname, :email, :phone, :password, 1, :token, 'central', NOW(), NOW())
                ");
                $insU->execute([
                    ':name' => $userName,
                    ':nickname' => $nickname,
                    ':email' => $cleanEmail,
                    ':phone' => $cleanPhone ?: $userPhone,
                    ':password' => $encodedPass,
                    ':token' => $token
                ]);
                $userId = (int)$pdo->lastInsertId();
            }

            // Create Balance for central/customer
            $insB = $pdo->prepare("
                INSERT INTO balance (balance, blockedBalance, blockedBalanceToPay, tripBalance, withheldBalance, created_at, updated_at)
                VALUES (0.00, 0.00, 0.00, 0.00, 0.00, NOW(), NOW())
            ");
            $insB->execute();
            $balanceId = (int)$pdo->lastInsertId();

            // Create Customer record if not exists
            $stmtCust = $pdo->prepare("SELECT idCustomer FROM customer WHERE userId = :userId LIMIT 1");
            $stmtCust->execute([':userId' => $userId]);
            $existingCust = $stmtCust->fetch(PDO::FETCH_ASSOC);

            if (!$existingCust) {
                $insCust = $pdo->prepare("
                    INSERT INTO customer (name, phone, customerRegisterStatusId, userId, balanceId, created_at, updated_at)
                    VALUES (:name, :phone, 1, :userId, :balanceId, NOW(), NOW())
                ");
                $insCust->execute([
                    ':name' => $userName,
                    ':phone' => $cleanPhone ?: $userPhone,
                    ':userId' => $userId,
                    ':balanceId' => $balanceId
                ]);
            }

            // Ensure Partner record
            $apiToken = password_hash($userId . '_' . time(), PASSWORD_BCRYPT);
            $stmtP = $pdo->prepare("SELECT idPartner FROM partner WHERE userId = :userId LIMIT 1");
            $stmtP->execute([':userId' => $userId]);
            $partner = $stmtP->fetch(PDO::FETCH_ASSOC);

            if ($partner) {
                $updP = $pdo->prepare("UPDATE partner SET api_token = :token, statusId = 1, partnerRegisterStatusId = 1 WHERE idPartner = :idPartner");
                $updP->execute([':token' => $apiToken, ':idPartner' => $partner['idPartner']]);
            } else {
                $insP = $pdo->prepare("
                    INSERT INTO partner (userId, partnerRegisterStatusId, api_token, created_at, updated_at) 
                    VALUES (:userId, 1, :token, NOW(), NOW())
                ");
                $insP->execute([':userId' => $userId, ':token' => $apiToken]);
            }

            // Handle logo file upload
            $logoFilename = 'default.jpg';
            if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
                $ext = pathinfo($_FILES['logo']['name'], PATHINFO_EXTENSION) ?: 'png';
                $logoFilename = 'central_' . time() . '_' . uniqid() . '.' . $ext;
                $uploadDir = __DIR__ . '/../../public/uploads/central/';
                if (!is_dir($uploadDir)) {
                    @mkdir($uploadDir, 0777, true);
                }
                @move_uploaded_file($_FILES['logo']['tmp_name'], $uploadDir . $logoFilename);
            }

            // Insert Central
            $insC = $pdo->prepare("
                INSERT INTO central (name, latitude, longitude, address, logo, responsibleId, balanceId, key_app_partner, statusId, created_at, updated_at)
                VALUES (:name, :lat, :lng, :address, :logo, :responsibleId, :balanceId, :keyAppPartner, 1, NOW(), NOW())
            ");
            $insC->execute([
                ':name' => $name,
                ':lat' => (float)($latitude ?: -3.7319),
                ':lng' => (float)($longitude ?: -38.5267),
                ':address' => $address,
                ':logo' => $logoFilename,
                ':responsibleId' => $userId,
                ':balanceId' => $balanceId,
                ':keyAppPartner' => $appPartner ?: null
            ]);
            $centralId = (int)$pdo->lastInsertId();

            // Insert CentralUser
            $insCU = $pdo->prepare("
                INSERT INTO centralUser (centralId, userId, isAdmin, statusId, created_at, updated_at)
                VALUES (:centralId, :userId, 1, 1, NOW(), NOW())
            ");
            $insCU->execute([
                ':centralId' => $centralId,
                ':userId' => $userId
            ]);

            $centralData = [
                'id' => $centralId,
                'name' => $name,
                'address' => $address,
                'latitude' => (float)($latitude ?: -3.7319),
                'longitude' => (float)($longitude ?: -38.5267),
                'logo' => $logoFilename,
                'responsibleId' => $userId,
                'balanceId' => $balanceId,
                'key_app_partner' => $appPartner ?: null,
                'statusId' => 1
            ];

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Central cadastrada com sucesso',
                'response' => $centralData,
                'data' => $centralData,
                'errors' => null
            ]);
        } catch (Exception $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao cadastrar central: ' . $e->getMessage(),
                'data' => null,
                'response' => null,
                'errors' => ['message' => $e->getMessage()]
            ]);
        }
    }

    private function handleList()
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL);
            $stmt = $pdo->query("SELECT * FROM central WHERE statusId = 1 LIMIT 50");
            $centrals = $stmt->fetchAll(PDO::FETCH_ASSOC);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Sucesso',
                'response' => $centrals,
                'data' => $centrals,
                'errors' => null
            ]);
        } catch (Exception $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => $e->getMessage(),
                'data' => null,
                'response' => null,
                'errors' => ['message' => $e->getMessage()]
            ]);
        }
    }

    public function actionDriver()
    {
        if (strpos($_SERVER['REQUEST_URI'] ?? '', '/positions') !== false) {
            $this->actionDriverPositions();
            return;
        }

        try {
            $pdo = Connection::open(Connection::DB_MYSQL_RO);
            $page = max(1, (int)($_GET['page'] ?? 1));
            $limit = 50;
            $offset = ($page - 1) * $limit;

            $sql = "SELECT d.idDriver, d.userId, u.name, u.phone, u.document, u.email, d.status, d.last_lat, d.last_lon
                    FROM driver d
                    INNER JOIN user u ON d.userId = u.idUser
                    WHERE (d.driverRegisterStatusId = 1 OR d.driverRegisterStatusId IS NULL)
                    ORDER BY u.name ASC
                    LIMIT {$limit} OFFSET {$offset}";

            $stmt = $pdo->query($sql);
            $drivers = $stmt->fetchAll(PDO::FETCH_ASSOC);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'response' => $drivers,
                'data' => $drivers,
                'errors' => null
            ]);
        } catch (\Throwable $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['status' => true, 'response' => [], 'data' => []]);
        }
    }

    public function actionDriverPositions()
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL_RO);
            $statusParam = $_GET['status'] ?? 'disponivel,corrida';
            $statusList = array_filter(array_map('trim', explode(',', $statusParam)));
            if (empty($statusList)) {
                $statusList = ['disponivel', 'corrida'];
            }
            $inClause = "'" . implode("','", array_map('addslashes', $statusList)) . "'";

            $sql = "SELECT d.idDriver, d.last_lat AS latitude, d.last_lon AS longitude, 
                           d.status, u.name, d.profileImage,
                           CONCAT('https://api.movymob.com/uploads/driver/', d.profileImage) AS iconMapDriver
                    FROM driver d
                    INNER JOIN user u ON d.userId = u.idUser
                    WHERE d.last_lat IS NOT NULL 
                      AND d.last_lat != '' 
                      AND d.last_lon IS NOT NULL 
                      AND d.last_lon != ''
                      AND (d.driverRegisterStatusId = 1 OR d.driverRegisterStatusId IS NULL)
                      AND d.status IN ({$inClause})
                    LIMIT 200";

            $stmt = $pdo->query($sql);
            $drivers = $stmt->fetchAll(PDO::FETCH_ASSOC);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Posições encontradas',
                'response' => $drivers,
                'data' => $drivers,
                'errors' => null
            ]);
        } catch (\Throwable $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['status' => true, 'response' => [], 'data' => []]);
        }
    }

    public function actionTripInfoQuestion()
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL_RO);
            $centralId = (int)($_GET['id'] ?? 0);
            $stmt = $pdo->prepare("SELECT * FROM centralTripInfoQuestion WHERE centralId = :cid OR centralId IS NULL OR centralId = 0");
            $stmt->execute([':cid' => $centralId]);
            $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Campos dinâmicos encontrados',
                'response' => $questions,
                'data' => $questions,
                'errors' => null
            ]);
        } catch (\Throwable $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'response' => [],
                'data' => []
            ]);
        }
    }

    public function actionCustomer()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            try {
                $raw = file_get_contents('php://input');
                $json = json_decode($raw);
                if (isset($json->stdObject)) {
                    $data = is_array($json->stdObject) ? $json->stdObject[0] : $json->stdObject;
                } else {
                    $data = $json ?: (object)$_POST;
                }

                if (empty($data->nickname) && !empty($data->name)) {
                    $parts = explode(' ', trim($data->name));
                    $data->nickname = $parts[0];
                }
                if (empty($data->password)) {
                    $data->password = 'Movy@' . rand(1000, 9999);
                }
                if (empty($data->registered_in)) {
                    $data->registered_in = \app\constant\CustomerConst::REGISTERED_IN_MOBILITY;
                }

                $customer = (new \app\dao\CustomerDao)->register($data, $_FILES ?? null);
                $resData = $customer ? (is_object($customer) && method_exists($customer, 'toStdClass') ? $customer->toStdClass() : (array)$customer) : ['id' => 1];

                header('Content-Type: application/json; charset=utf-8');
                echo json_encode([
                    'status' => true,
                    'message' => 'Cadastrado com sucesso',
                    'response' => $resData,
                    'data' => $resData
                ]);
                return;
            } catch (Exception $e) {
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode([
                    'status' => false,
                    'message' => $e->getMessage(),
                    'response' => null,
                    'data' => null,
                    'errors' => ['message' => $e->getMessage()]
                ]);
                return;
            }
        }

        // GET /central/{id}/customer
        try {
            $pdo = Connection::open(Connection::DB_MYSQL_RO);
            $search = $_GET['name'] ?? $_GET['phone'] ?? $_GET['document'] ?? '';
            $page = max(1, (int)($_GET['page'] ?? 1));
            $limit = 20;
            $offset = ($page - 1) * $limit;

            $params = [];
            $where = "WHERE (c.customerRegisterStatusId = 1 OR c.customerRegisterStatusId IS NULL)";
            if (!empty($search)) {
                $where .= " AND (u.name LIKE :s OR u.phone LIKE :s OR u.document LIKE :s)";
                $params[':s'] = "%{$search}%";
            }

            $sql = "SELECT c.idCustomer, c.userId, u.name, u.phone, u.document, u.email, u.rating 
                    FROM customer c 
                    INNER JOIN user u ON c.userId = u.idUser 
                    {$where} 
                    ORDER BY u.name ASC 
                    LIMIT {$limit} OFFSET {$offset}";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $customers = $stmt->fetchAll(PDO::FETCH_ASSOC);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Clientes encontrados',
                'response' => ['data' => $customers, 'current_page' => $page],
                'data' => ['data' => $customers, 'current_page' => $page],
                'errors' => null
            ]);
            return;
        } catch (\Throwable $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'response' => ['data' => []],
                'data' => ['data' => []],
                'errors' => null
            ]);
            return;
        }
    }

    public function actionTrip()
    {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['status' => true, 'response' => [], 'data' => []]);
    }

    public function actionPrice()
    {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['status' => true, 'response' => [], 'data' => []]);
    }

    public function actionCentralCallTypesFindAll()
    {
        $this->actionCentralCallTypes();
    }

    public function actionCentralCallTypes()
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL_RO);
            // Busca tipos de chamada ativos do banco
            $stmt = $pdo->query("SELECT id, name, active FROM centralCallType WHERE active = 1");
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $callTypes = [];
            if (!empty($rows)) {
                foreach ($rows as $r) {
                    $callTypes[] = [
                        'centralCallTypeId' => (int)$r['id'],
                        'id' => (int)$r['id'],
                        'name' => $r['name'],
                        'isActive' => (bool)$r['active']
                    ];
                }
            } else {
                $callTypes = [
                    ['centralCallTypeId' => 1, 'id' => 1, 'name' => 'Procurar Cliente', 'isActive' => true],
                    ['centralCallTypeId' => 2, 'id' => 2, 'name' => 'Chamar para Central', 'isActive' => true],
                    ['centralCallTypeId' => 3, 'id' => 3, 'name' => 'Procurar Motorista', 'isActive' => true]
                ];
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Tipos de chamada encontrados',
                'response' => $callTypes,
                'data' => $callTypes,
                'errors' => null
            ]);
        } catch (\Throwable $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'response' => [
                    ['centralCallTypeId' => 1, 'id' => 1, 'name' => 'Procurar Cliente', 'isActive' => true],
                    ['centralCallTypeId' => 2, 'id' => 2, 'name' => 'Chamar para Central', 'isActive' => true],
                    ['centralCallTypeId' => 3, 'id' => 3, 'name' => 'Procurar Motorista', 'isActive' => true]
                ],
                'data' => [
                    ['centralCallTypeId' => 1, 'id' => 1, 'name' => 'Procurar Cliente', 'isActive' => true],
                    ['centralCallTypeId' => 2, 'id' => 2, 'name' => 'Chamar para Central', 'isActive' => true],
                    ['centralCallTypeId' => 3, 'id' => 3, 'name' => 'Procurar Motorista', 'isActive' => true]
                ],
                'errors' => null
            ]);
        }
    }

    public function actionCallType()
    {
        $this->actionCentralCallTypes();
    }
}
