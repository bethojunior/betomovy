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
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        if ($method === 'POST' && isset($_POST['_method'])) {
            $method = strtoupper($_POST['_method']);
        }

        switch ($method) {
            case 'POST':
                $this->handleRegister();
                break;
            case 'PUT':
                $this->handleUpdate();
                break;
            case 'DELETE':
                $this->handleDelete();
                break;
            case 'GET':
            default:
                $this->handleList();
                break;
        }
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
            $responsibleId = !empty($_POST['responsibleId']) ? (int)$_POST['responsibleId'] : null;
            $centralCallDriver = $_POST['centralCallDriver'] ?? 'all';
            $syncCustomers = isset($_POST['syncCustomers']) ? (int)$_POST['syncCustomers'] : 1;
            $showAllPrices = isset($_POST['showAllPrices']) ? (int)$_POST['showAllPrices'] : 1;
            $enableCustomRadiusCentral = isset($_POST['enableCustomRadiusCentral']) ? (int)$_POST['enableCustomRadiusCentral'] : 0;
            $placesSearchRadius = !empty($_POST['placesSearchRadius']) ? (int)$_POST['placesSearchRadius'] : null;
            $discount_type = $_POST['discount_type'] ?? null;
            $discount_value = isset($_POST['discount_value']) && $_POST['discount_value'] !== '' ? (float)$_POST['discount_value'] : null;

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
            if (empty($name) && empty($userName) && empty($responsibleId)) {
                $raw = file_get_contents('php://input');
                $json = json_decode($raw, true);
                if ($json) {
                    $name = $json['name'] ?? null;
                    $address = $json['address'] ?? null;
                    $latitude = $json['latitude'] ?? null;
                    $longitude = $json['longitude'] ?? null;
                    $appPartner = $json['app_partner'] ?? null;
                    $responsibleId = !empty($json['responsibleId']) ? (int)$json['responsibleId'] : null;
                    $centralCallDriver = $json['centralCallDriver'] ?? 'all';
                    $syncCustomers = isset($json['syncCustomers']) ? (int)$json['syncCustomers'] : 1;
                    $showAllPrices = isset($json['showAllPrices']) ? (int)$json['showAllPrices'] : 1;
                    $enableCustomRadiusCentral = isset($json['enableCustomRadiusCentral']) ? (int)$json['enableCustomRadiusCentral'] : 0;
                    $placesSearchRadius = !empty($json['placesSearchRadius']) ? (int)$json['placesSearchRadius'] : null;
                    $discount_type = $json['discount_type'] ?? null;
                    $discount_value = isset($json['discount_value']) ? (float)$json['discount_value'] : null;

                    if (isset($json['user']) && is_array($json['user'])) {
                        $userName = $json['user']['name'] ?? null;
                        $userEmail = $json['user']['email'] ?? null;
                        $userPhone = $json['user']['phone'] ?? null;
                        $userPassword = $json['user']['password'] ?? null;
                    }
                }
            }

            $userId = null;

            if ($responsibleId && $responsibleId > 0) {
                // User already exists
                $stmtCheckU = $pdo->prepare("SELECT idUser, name, email, phone FROM user WHERE idUser = :uid LIMIT 1");
                $stmtCheckU->execute([':uid' => $responsibleId]);
                $userRow = $stmtCheckU->fetch(PDO::FETCH_ASSOC);

                if (!$userRow) {
                    header('Content-Type: application/json; charset=utf-8');
                    echo json_encode([
                        'status' => false,
                        'message' => 'Usuário responsável não encontrado',
                        'data' => null,
                        'response' => null,
                        'errors' => ['message' => 'Usuário responsável não encontrado']
                    ]);
                    return;
                }

                $userId = (int)$userRow['idUser'];
                $userName = $userRow['name'];
                $cleanEmail = $userRow['email'];
                $cleanPhone = preg_replace('/\D/', '', (string)$userRow['phone']);
            } else {
                // New user validation
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

                $cleanPhone = preg_replace('/\D/', '', (string)$userPhone);
                $cleanEmail = strtolower(trim($userEmail));
                $encodedPass = base64_encode($userPassword);

                // Check if user already exists
                $stmtU = $pdo->prepare("SELECT idUser, password FROM user WHERE email = :email LIMIT 1");
                $stmtU->execute([':email' => $cleanEmail]);
                $existingUser = $stmtU->fetch(PDO::FETCH_ASSOC);

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
            }

            if (empty($name)) {
                $name = 'Central ' . $userName;
            }

            if (empty($address)) {
                $address = 'Endereço Principal';
            }

            // Create Balance for central/customer
            $insB = $pdo->prepare("
                INSERT INTO balance (balance, blockedBalance, blockedBalanceToPay, tripBalance, withheldBalance)
                VALUES (0.00, 0.00, 0.00, 0.00, 0.00)
            ");
            $insB->execute();
            $balanceId = (int)$pdo->lastInsertId();

            // Create Customer record if not exists
            $stmtCust = $pdo->prepare("SELECT idCustomer FROM customer WHERE userId = :userId LIMIT 1");
            $stmtCust->execute([':userId' => $userId]);
            $existingCust = $stmtCust->fetch(PDO::FETCH_ASSOC);

            if (!$existingCust) {
                $insCust = $pdo->prepare("
                    INSERT INTO customer (name, phone, customerRegisterStatusId, userId, balanceId)
                    VALUES (:name, :phone, 1, :userId, :balanceId)
                ");
                $insCust->execute([
                    ':name' => $userName,
                    ':phone' => $cleanPhone ?: ($userPhone ?? ''),
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
                INSERT INTO central (
                    name, latitude, longitude, address, logo, 
                    responsibleId, balanceId, key_app_partner, statusId, active,
                    centralCallDriver, syncCustomers, showAllPrices,
                    enableCustomRadiusCentral, placesSearchRadius, discount_type, discount_value,
                    created_at, updated_at
                ) VALUES (
                    :name, :lat, :lng, :address, :logo, 
                    :responsibleId, :balanceId, :keyAppPartner, 1, 1,
                    :centralCallDriver, :syncCustomers, :showAllPrices,
                    :enableCustomRadiusCentral, :placesSearchRadius, :discount_type, :discount_value,
                    NOW(), NOW()
                )
            ");
            $insC->execute([
                ':name' => $name,
                ':lat' => (float)($latitude ?: -3.7319),
                ':lng' => (float)($longitude ?: -38.5267),
                ':address' => $address,
                ':logo' => $logoFilename,
                ':responsibleId' => $userId,
                ':balanceId' => $balanceId,
                ':keyAppPartner' => $appPartner ?: null,
                ':centralCallDriver' => $centralCallDriver,
                ':syncCustomers' => $syncCustomers,
                ':showAllPrices' => $showAllPrices,
                ':enableCustomRadiusCentral' => $enableCustomRadiusCentral,
                ':placesSearchRadius' => $placesSearchRadius,
                ':discount_type' => $discount_type,
                ':discount_value' => $discount_value
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
                'centralCallDriver' => $centralCallDriver,
                'syncCustomers' => $syncCustomers,
                'showAllPrices' => $showAllPrices,
                'enableCustomRadiusCentral' => $enableCustomRadiusCentral,
                'placesSearchRadius' => $placesSearchRadius,
                'discount_type' => $discount_type,
                'discount_value' => $discount_value,
                'statusId' => 1,
                'active' => 1
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

    private function handleUpdate()
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL);
            $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

            $raw = file_get_contents('php://input');
            $data = json_decode($raw, true) ?: $_POST;

            if ($id <= 0 && !empty($data['id'])) {
                $id = (int)$data['id'];
            }

            if ($id <= 0) {
                throw new Exception("ID da central não informado");
            }

            // Extract fields to update
            $name = $data['name'] ?? null;
            $address = $data['address'] ?? null;
            $latitude = isset($data['latitude']) && $data['latitude'] !== '' ? (float)$data['latitude'] : null;
            $longitude = isset($data['longitude']) && $data['longitude'] !== '' ? (float)$data['longitude'] : null;
            $centralCallDriver = $data['centralCallDriver'] ?? null;
            $syncCustomers = isset($data['syncCustomers']) ? (int)$data['syncCustomers'] : null;
            $showAllPrices = isset($data['showAllPrices']) ? (int)$data['showAllPrices'] : null;
            $enableCustomRadiusCentral = isset($data['enableCustomRadiusCentral']) ? (int)$data['enableCustomRadiusCentral'] : null;
            $placesSearchRadius = isset($data['placesSearchRadius']) ? ($data['placesSearchRadius'] !== '' ? (int)$data['placesSearchRadius'] : null) : null;
            $discount_type = $data['discount_type'] ?? null;
            $discount_value = isset($data['discount_value']) ? ($data['discount_value'] !== '' ? (float)$data['discount_value'] : null) : null;

            $stmt = $pdo->prepare("
                UPDATE central SET
                    name = COALESCE(:name, name),
                    address = COALESCE(:address, address),
                    latitude = COALESCE(:latitude, latitude),
                    longitude = COALESCE(:longitude, longitude),
                    centralCallDriver = COALESCE(:centralCallDriver, centralCallDriver),
                    syncCustomers = COALESCE(:syncCustomers, syncCustomers),
                    showAllPrices = COALESCE(:showAllPrices, showAllPrices),
                    enableCustomRadiusCentral = COALESCE(:enableCustomRadiusCentral, enableCustomRadiusCentral),
                    placesSearchRadius = :placesSearchRadius,
                    discount_type = :discount_type,
                    discount_value = :discount_value,
                    updated_at = NOW()
                WHERE id = :id
            ");

            $stmt->execute([
                ':name' => $name,
                ':address' => $address,
                ':latitude' => $latitude,
                ':longitude' => $longitude,
                ':centralCallDriver' => $centralCallDriver,
                ':syncCustomers' => $syncCustomers,
                ':showAllPrices' => $showAllPrices,
                ':enableCustomRadiusCentral' => $enableCustomRadiusCentral,
                ':placesSearchRadius' => $placesSearchRadius,
                ':discount_type' => $discount_type,
                ':discount_value' => $discount_value,
                ':id' => $id
            ]);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Central atualizada com sucesso',
                'response' => true,
                'data' => true
            ]);
        } catch (Exception $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao atualizar central: ' . $e->getMessage(),
                'response' => false,
                'data' => false
            ]);
        }
    }

    private function handleDelete()
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL);
            $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
            if ($id <= 0) {
                $raw = file_get_contents('php://input');
                $data = json_decode($raw, true) ?: $_POST;
                $id = (int)($data['id'] ?? 0);
            }

            if ($id <= 0) {
                throw new Exception("ID da central não informado");
            }

            $stmt = $pdo->prepare("UPDATE central SET statusId = 2, active = 0, updated_at = NOW() WHERE id = :id");
            $stmt->execute([':id' => $id]);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Central removida com sucesso',
                'response' => true,
                'data' => true
            ]);
        } catch (Exception $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao remover central: ' . $e->getMessage(),
                'response' => false,
                'data' => false
            ]);
        }
    }

    private function handleList()
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL_RO);
            $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

            if ($id > 0) {
                $stmt = $pdo->prepare("
                    SELECT 
                        c.*,
                        COALESCE(b.tripBalance, b.balance, 0.00) AS tripBalance,
                        COALESCE(b.balance, 0.00) AS balance,
                        u.name AS responsibleName,
                        u.email AS responsibleEmail,
                        u.phone AS phone
                    FROM central c
                    LEFT JOIN balance b ON b.idBalance = c.balanceId
                    LEFT JOIN user u ON u.idUser = c.responsibleId
                    WHERE c.id = :id
                    LIMIT 1
                ");
                $stmt->execute([':id' => $id]);
                $central = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($central) {
                    $central['active'] = (int)($central['active'] ?? 0);
                    $central['responsible'] = [
                        'id' => (int)($central['responsibleId'] ?? 0),
                        'name' => $central['responsibleName'] ?? '',
                        'email' => $central['responsibleEmail'] ?? '',
                        'phone' => $central['phone'] ?? ''
                    ];

                    header('Content-Type: application/json; charset=utf-8');
                    echo json_encode([
                        'status' => true,
                        'message' => 'Sucesso',
                        'response' => $central,
                        'data' => $central,
                        'errors' => null
                    ]);
                    return;
                }
            }

            $page = max(1, (int)($_GET['page'] ?? 1));
            $limit = 50;
            $offset = ($page - 1) * $limit;
            $nameSearch = trim($_GET['name'] ?? '');

            $where = "WHERE (c.statusId = 1 OR c.statusId IS NULL)";
            $params = [];

            if ($nameSearch !== '') {
                $where .= " AND c.name LIKE :searchName";
                $params[':searchName'] = "%{$nameSearch}%";
            }

            $stmtCount = $pdo->prepare("SELECT COUNT(*) FROM central c {$where}");
            $stmtCount->execute($params);
            $total = (int)$stmtCount->fetchColumn();

            $sql = "
                SELECT 
                    c.*,
                    COALESCE(b.tripBalance, b.balance, 0.00) AS tripBalance,
                    COALESCE(b.balance, 0.00) AS balance,
                    u.name AS responsibleName,
                    u.email AS responsibleEmail,
                    u.phone AS phone
                FROM central c
                LEFT JOIN balance b ON b.idBalance = c.balanceId
                LEFT JOIN user u ON u.idUser = c.responsibleId
                {$where}
                ORDER BY c.id DESC
                LIMIT {$limit} OFFSET {$offset}
            ";

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $centrals = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($centrals as &$c) {
                $c['active'] = (int)($c['active'] ?? 0);
                $c['tripBalance'] = $c['tripBalance'] !== null ? (float)$c['tripBalance'] : null;
                $c['responsible'] = [
                    'id' => (int)($c['responsibleId'] ?? 0),
                    'name' => $c['responsibleName'] ?? '',
                    'email' => $c['responsibleEmail'] ?? '',
                    'phone' => $c['phone'] ?? ''
                ];
            }
            unset($c);

            $lastPage = max(1, (int)ceil($total / $limit));
            $hasMore = ($offset + count($centrals)) < $total;
            $hasPrev = $page > 1;

            $nextPageUrl = $hasMore ? "central?page=" . ($page + 1) . "&name=" . urlencode($nameSearch) : null;
            $prevPageUrl = $hasPrev ? "central?page=" . ($page - 1) . "&name=" . urlencode($nameSearch) : null;

            $paginated = [
                'data' => $centrals,
                'current_page' => $page,
                'last_page' => $lastPage,
                'total' => $total,
                'next_page_url' => $nextPageUrl,
                'prev_page_url' => $prevPageUrl
            ];

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Sucesso',
                'response' => $paginated,
                'data' => $paginated,
                'errors' => null
            ]);
        } catch (Exception $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => $e->getMessage(),
                'data' => ['data' => []],
                'response' => ['data' => []],
                'errors' => ['message' => $e->getMessage()]
            ]);
        }
    }

    public function actionBlock()
    {
        try {
            $id = (int)($_GET['id'] ?? 0);
            if ($id <= 0) {
                throw new Exception("ID da central inválido");
            }

            $pdo = Connection::open(Connection::DB_MYSQL);
            $stmt = $pdo->prepare("UPDATE central SET active = 0, updated_at = NOW() WHERE id = :id");
            $stmt->execute([':id' => $id]);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Central bloqueada com sucesso',
                'response' => true
            ]);
        } catch (Exception $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao bloquear central: ' . $e->getMessage(),
                'response' => false
            ]);
        }
    }

    public function actionActivate()
    {
        try {
            $id = (int)($_GET['id'] ?? 0);
            if ($id <= 0) {
                throw new Exception("ID da central inválido");
            }

            $pdo = Connection::open(Connection::DB_MYSQL);
            $stmt = $pdo->prepare("UPDATE central SET active = 1, updated_at = NOW() WHERE id = :id");
            $stmt->execute([':id' => $id]);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Central ativada com sucesso',
                'response' => true
            ]);
        } catch (Exception $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao ativar central: ' . $e->getMessage(),
                'response' => false
            ]);
        }
    }

    public function actionUpdateLogo()
    {
        try {
            $id = (int)($_GET['id'] ?? 0);
            if ($id <= 0) {
                throw new Exception("ID da central inválido");
            }

            $logoFilename = null;
            if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
                $ext = pathinfo($_FILES['logo']['name'], PATHINFO_EXTENSION) ?: 'png';
                $logoFilename = 'central_' . $id . '_' . time() . '.' . $ext;
                $uploadDir = __DIR__ . '/../../public/uploads/central/';
                if (!is_dir($uploadDir)) {
                    @mkdir($uploadDir, 0777, true);
                }
                @move_uploaded_file($_FILES['logo']['tmp_name'], $uploadDir . $logoFilename);

                $pdo = Connection::open(Connection::DB_MYSQL);
                $stmt = $pdo->prepare("UPDATE central SET logo = :logo, updated_at = NOW() WHERE id = :id");
                $stmt->execute([':logo' => $logoFilename, ':id' => $id]);
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Logo atualizado com sucesso',
                'response' => ['logo' => $logoFilename]
            ]);
        } catch (Exception $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao atualizar logo: ' . $e->getMessage(),
                'response' => null
            ]);
        }
    }

    public function actionBalance()
    {
        try {
            $raw = file_get_contents('php://input');
            $data = json_decode($raw, true) ?: $_POST;

            $centralId = (int)($data['centralId'] ?? 0);
            $type = (string)($data['type'] ?? '1');
            $value = (float)($data['value'] ?? 0);

            if ($centralId <= 0 || $value <= 0) {
                throw new Exception("Central e valor são obrigatórios e devem ser maiores que zero");
            }

            $pdo = Connection::open(Connection::DB_MYSQL);

            // Find balanceId from central
            $stmtC = $pdo->prepare("SELECT id, balanceId FROM central WHERE id = :id LIMIT 1");
            $stmtC->execute([':id' => $centralId]);
            $central = $stmtC->fetch(PDO::FETCH_ASSOC);

            if (!$central) {
                throw new Exception("Central não encontrada");
            }

            $balanceId = (int)($central['balanceId'] ?? 0);

            if ($balanceId <= 0) {
                $stmtInsB = $pdo->prepare("INSERT INTO balance (balance, tripBalance, blockedBalance, withheldBalance, blockedBalanceToPay) VALUES (0.00, 0.00, 0.00, 0.00, 0.00)");
                $stmtInsB->execute();
                $balanceId = (int)$pdo->lastInsertId();

                $stmtUpdC = $pdo->prepare("UPDATE central SET balanceId = :bid WHERE id = :id");
                $stmtUpdC->execute([':bid' => $balanceId, ':id' => $centralId]);
            }

            // type '1' or 'credit' = add; type '2' or 'debit' = subtract
            $isAdd = ($type === '1' || strtolower($type) === 'credit' || strtolower($type) === 'adicionar');

            if ($isAdd) {
                $stmtB = $pdo->prepare("UPDATE balance SET balance = balance + :v, tripBalance = tripBalance + :v WHERE idBalance = :bid");
            } else {
                $stmtB = $pdo->prepare("UPDATE balance SET balance = balance - :v, tripBalance = tripBalance - :v WHERE idBalance = :bid");
            }
            $stmtB->execute([':v' => $value, ':bid' => $balanceId]);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Saldo atualizado com sucesso!',
                'response' => true
            ]);
        } catch (Exception $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao atualizar saldo: ' . $e->getMessage(),
                'response' => false
            ]);
        }
    }

    public function actionUser()
    {
        try {
            $centralId = (int)($_GET['id'] ?? 0);
            if ($centralId <= 0) {
                throw new Exception("ID da central inválido");
            }

            $pdo = Connection::open(Connection::DB_MYSQL_RO);
            $stmt = $pdo->prepare("
                SELECT 
                    cu.id,
                    cu.centralId,
                    cu.userId,
                    cu.isAdmin,
                    u.idUser,
                    u.name,
                    u.email,
                    u.phone
                FROM centralUser cu
                INNER JOIN user u ON u.idUser = cu.userId
                WHERE cu.centralId = :cid AND cu.statusId = 1
                ORDER BY u.name ASC
            ");
            $stmt->execute([':cid' => $centralId]);
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $formatted = [];
            foreach ($users as $u) {
                $formatted[] = [
                    'id' => (int)$u['id'],
                    'centralId' => (int)$u['centralId'],
                    'userId' => (int)$u['userId'],
                    'idUser' => (int)$u['idUser'],
                    'isAdmin' => (bool)$u['isAdmin'],
                    'name' => $u['name'],
                    'email' => $u['email'],
                    'phone' => $u['phone']
                ];
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Usuários encontrados',
                'response' => $formatted,
                'data' => $formatted
            ]);
        } catch (Exception $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao buscar usuários: ' . $e->getMessage(),
                'response' => [],
                'data' => []
            ]);
        }
    }

    public function actionUserEligible()
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL_RO);
            $search = trim($_GET['search'] ?? '');
            $page = max(1, (int)($_GET['page'] ?? 1));
            $limit = 20;
            $offset = ($page - 1) * $limit;

            $params = [];
            $where = "WHERE (u.statusId = 1 OR u.statusId IS NULL)";
            if ($search !== '') {
                $where .= " AND (u.name LIKE :s OR u.email LIKE :s OR u.phone LIKE :s)";
                $params[':s'] = "%{$search}%";
            }

            $stmtCount = $pdo->prepare("SELECT COUNT(*) FROM user u {$where}");
            $stmtCount->execute($params);
            $total = (int)$stmtCount->fetchColumn();

            $sql = "SELECT u.idUser AS id, u.name AS text, u.email, u.phone 
                    FROM user u 
                    {$where} 
                    ORDER BY u.name ASC 
                    LIMIT {$limit} OFFSET {$offset}";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $hasMore = ($offset + count($users)) < $total;
            $nextPageUrl = $hasMore ? "central/user/eligible?page=" . ($page + 1) . "&search=" . urlencode($search) : null;

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Usuários encontrados',
                'response' => [
                    'data' => $users,
                    'current_page' => $page,
                    'total' => $total,
                    'next_page_url' => $nextPageUrl
                ],
                'data' => [
                    'data' => $users,
                    'current_page' => $page,
                    'total' => $total,
                    'next_page_url' => $nextPageUrl
                ]
            ]);
        } catch (Exception $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao buscar usuários: ' . $e->getMessage(),
                'response' => ['data' => [], 'next_page_url' => null],
                'data' => ['data' => [], 'next_page_url' => null]
            ]);
        }
    }

    public function actionUserInsert()
    {
        try {
            $raw = file_get_contents('php://input');
            $data = json_decode($raw, true) ?: $_POST;

            $centralId = (int)($data['centralId'] ?? 0);
            $userId = (int)($data['userId'] ?? 0);
            $isAdmin = !empty($data['isAdmin']) ? 1 : 0;

            if ($centralId <= 0 || $userId <= 0) {
                throw new Exception("Central e usuário são obrigatórios");
            }

            $pdo = Connection::open(Connection::DB_MYSQL);

            // Check if user is already linked to this central
            $stmtCheck = $pdo->prepare("SELECT id, statusId FROM centralUser WHERE centralId = :cid AND userId = :uid LIMIT 1");
            $stmtCheck->execute([':cid' => $centralId, ':uid' => $userId]);
            $existing = $stmtCheck->fetch(PDO::FETCH_ASSOC);

            if ($existing) {
                if ((int)$existing['statusId'] === 1) {
                    header('Content-Type: application/json; charset=utf-8');
                    echo json_encode([
                        'status' => false,
                        'message' => 'Este usuário já está cadastrado na central.',
                        'response' => null
                    ]);
                    return;
                } else {
                    $stmtUpd = $pdo->prepare("UPDATE centralUser SET statusId = 1, isAdmin = :isAdmin, updated_at = NOW() WHERE id = :id");
                    $stmtUpd->execute([':isAdmin' => $isAdmin, ':id' => $existing['id']]);
                }
            } else {
                $stmtIns = $pdo->prepare("INSERT INTO centralUser (centralId, userId, isAdmin, statusId, created_at, updated_at) VALUES (:cid, :uid, :isAdmin, 1, NOW(), NOW())");
                $stmtIns->execute([':cid' => $centralId, ':uid' => $userId, ':isAdmin' => $isAdmin]);
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Usuário adicionado com sucesso!',
                'response' => true
            ]);
        } catch (Exception $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao adicionar usuário: ' . $e->getMessage(),
                'response' => false
            ]);
        }
    }

    public function actionCentralCallDriver()
    {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'status' => true,
            'message' => 'Sucesso',
            'response' => [
                'all' => 'Todos os motoristas',
                'only_app' => 'Apenas motoristas do app',
                'only_central_drivers' => 'Apenas motoristas da central'
            ],
            'data' => [
                'all' => 'Todos os motoristas',
                'only_app' => 'Apenas motoristas do app',
                'only_central_drivers' => 'Apenas motoristas da central'
            ]
        ]);
    }

    public function actionDriver()
    {
        if (strpos($_SERVER['REQUEST_URI'] ?? '', '/positions') !== false) {
            $this->actionDriverPositions();
            return;
        }

        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

        if ($method === 'POST') {
            try {
                $data = $this->request();
                $centralId = (int)($data->centralId ?? ($_GET['id'] ?? 0));
                $driverId = (int)($data->driverId ?? 0);
                $isFavorite = !empty($data->isFavorite) ? 1 : 0;

                if (!$centralId || !$driverId) {
                    throw new \Exception("Central e Motorista são obrigatórios");
                }

                $pdo = Connection::open(Connection::DB_MYSQL_RW);
                $stmt = $pdo->prepare("SELECT id FROM centralDriver WHERE centralId = :cid AND driverId = :did");
                $stmt->execute([':cid' => $centralId, ':did' => $driverId]);
                $existing = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($existing) {
                    $upd = $pdo->prepare("UPDATE centralDriver SET isFavorite = :fav, updated_at = NOW() WHERE id = :id");
                    $upd->execute([':fav' => $isFavorite, ':id' => $existing['id']]);
                } else {
                    $ins = $pdo->prepare("INSERT INTO centralDriver (centralId, driverId, isFavorite, created_at, updated_at) VALUES (:cid, :did, :fav, NOW(), NOW())");
                    $ins->execute([':cid' => $centralId, ':did' => $driverId, ':fav' => $isFavorite]);
                }

                echo $this->returnSuccess("Motorista vinculado com sucesso à central");
            } catch (\Throwable $e) {
                echo $this->returnError($e);
            }
            return;
        }

        if ($method === 'DELETE') {
            try {
                $centralId = (int)($_GET['id'] ?? 0);
                $driverId = (int)($_GET['driverId'] ?? ($_GET['idDriver'] ?? 0));
                if (!$driverId && isset($_GET['reference'])) {
                    $driverId = (int)$_GET['reference'];
                }

                if (!$centralId || !$driverId) {
                    throw new \Exception("Central e Motorista são obrigatórios");
                }

                $pdo = Connection::open(Connection::DB_MYSQL_RW);
                $stmt = $pdo->prepare("DELETE FROM centralDriver WHERE centralId = :cid AND driverId = :did");
                $stmt->execute([':cid' => $centralId, ':did' => $driverId]);

                echo $this->returnSuccess("Motorista removido da central com sucesso");
            } catch (\Throwable $e) {
                echo $this->returnError($e);
            }
            return;
        }

        try {
            $pdo = Connection::open(Connection::DB_MYSQL_RO);
            $centralId = (int)($_GET['id'] ?? 0);
            $page = max(1, (int)($_GET['page'] ?? 1));
            $limit = 20;
            $offset = ($page - 1) * $limit;

            // Show ALL registered drivers — only exclude deleted (statusId = 2 on user)
            $where = ["(u.statusId IS NULL OR u.statusId != 2)"];
            $params = [];
            $whereSql = implode(' AND ', $where);

            $countStmt = $pdo->prepare("SELECT COUNT(*) FROM driver d INNER JOIN user u ON d.userId = u.idUser WHERE {$whereSql}");
            $countStmt->execute($params);
            $total = (int)$countStmt->fetchColumn();
            $lastPage = max(1, (int)ceil($total / $limit));

            $stmt = $pdo->prepare("SELECT d.idDriver, d.userId, u.name, u.phone, u.document, u.email, u.created_at, d.status, d.last_lat, d.last_lon, coalesce(d.profileImage, u.profilePhoto, '') as profileImage, d.driverRegisterStatusId
                    FROM driver d
                    INNER JOIN user u ON d.userId = u.idUser
                    WHERE {$whereSql}
                    ORDER BY d.idDriver DESC
                    LIMIT {$limit} OFFSET {$offset}");
            $stmt->execute($params);
            $drivers = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $formatted = [];
            foreach ($drivers as $d) {
                $formatted[] = [
                    'idDriver' => (int)$d['idDriver'],
                    'userId' => (int)$d['userId'],
                    'profileImageUrl' => $d['profileImage'] ?? '',
                    'name' => $d['name'],
                    'driverRegisterStatusId' => (int)($d['driverRegisterStatusId'] ?? 0),
                    'user' => [
                        'name' => $d['name'],
                        'email' => $d['email'],
                        'phone' => $d['phone'],
                        'document' => $d['document'],
                        'created_at' => $d['created_at'],
                    ],
                    'status' => $d['status'],
                    'blockedId' => null,
                ];
            }

            $prevPageUrl = $page > 1 ? "?page=" . ($page - 1) : null;
            $nextPageUrl = $page < $lastPage ? "?page=" . ($page + 1) : null;

            $resData = [
                'current_page' => $page,
                'last_page' => $lastPage,
                'total' => $total,
                'per_page' => $limit,
                'prev_page_url' => $prevPageUrl,
                'next_page_url' => $nextPageUrl,
                'data' => $formatted,
            ];

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'response' => $resData,
                'data' => $formatted,
                'current_page' => $page,
                'last_page' => $lastPage,
                'total' => $total,
                'prev_page_url' => $prevPageUrl,
                'next_page_url' => $nextPageUrl,
                'errors' => null
            ]);
        } catch (\Throwable $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => $e->getMessage(),
                'error' => $e->getMessage(),
                'response' => ['current_page' => 1, 'last_page' => 1, 'total' => 0, 'data' => []],
                'data' => []
            ]);
        }
    }

    public function actionDriverActive()
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL_RO);
            $centralId = (int)($_GET['id'] ?? 0);
            $page = max(1, (int)($_GET['page'] ?? 1));
            $limit = 20;
            $offset = ($page - 1) * $limit;
            $filter = trim($_GET['filter'] ?? '');

            // Base query for active / approved drivers
            $where = ["(d.driverRegisterStatusId = 1 OR d.driverRegisterStatusId IS NULL)"];
            $params = [':centralId' => $centralId];

            // If central has explicit records in centralDriver, prioritize them; else show active drivers in city / system
            if ($centralId > 0) {
                $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM centralDriver WHERE centralId = :cid");
                $checkStmt->execute([':cid' => $centralId]);
                $hasExplicit = ((int)$checkStmt->fetchColumn()) > 0;

                if ($hasExplicit) {
                    $where[] = "cd.id IS NOT NULL";
                }
            }

            // Apply filter
            if ($filter === 'favorite') {
                $where[] = "COALESCE(cd.isFavorite, 0) = 1";
            } elseif ($filter === 'disponivel' || $filter === 'online') {
                $where[] = "d.status = 'disponivel'";
            } elseif ($filter === 'corrida') {
                $where[] = "d.status = 'corrida'";
            } elseif ($filter === 'desligado' || $filter === 'offline') {
                $where[] = "d.status = 'desligado'";
            }

            $whereSql = implode(' AND ', $where);

            $countSql = "SELECT COUNT(*)
                         FROM driver d
                         INNER JOIN user u ON d.userId = u.idUser
                         LEFT JOIN centralDriver cd ON cd.driverId = d.idDriver AND cd.centralId = :centralId
                         WHERE {$whereSql}";
            $countStmt = $pdo->prepare($countSql);
            $countStmt->execute($params);
            $total = (int)$countStmt->fetchColumn();
            $lastPage = max(1, (int)ceil($total / $limit));

            $sql = "SELECT d.idDriver, d.userId, u.name, u.phone, u.document, u.email, u.created_at,
                           d.status, d.last_lat, d.last_lon, d.profileImage, d.profileImageUrl,
                           COALESCE(cd.isFavorite, 0) AS isFavorite
                    FROM driver d
                    INNER JOIN user u ON d.userId = u.idUser
                    LEFT JOIN centralDriver cd ON cd.driverId = d.idDriver AND cd.centralId = :centralId
                    WHERE {$whereSql}
                    ORDER BY COALESCE(cd.isFavorite, 0) DESC, (d.status = 'disponivel') DESC, (d.status = 'corrida') DESC, u.name ASC
                    LIMIT {$limit} OFFSET {$offset}";

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $formatted = [];
            foreach ($rows as $row) {
                $profilePic = $row['profileImageUrl'] ?? '';
                if (!$profilePic && !empty($row['profileImage'])) {
                    $profilePic = 'https://api.movymob.com/uploads/driver/' . $row['profileImage'];
                }
                $formatted[] = [
                    'idDriver' => (int)$row['idDriver'],
                    'userId' => (int)$row['userId'],
                    'name' => $row['name'],
                    'phone' => $row['phone'],
                    'email' => $row['email'],
                    'status' => $row['status'] ?: 'desligado',
                    'isFavorite' => (int)$row['isFavorite'],
                    'profileImageUrl' => $profilePic,
                    'code' => 'MO' . str_pad($row['idDriver'], 5, '0', STR_PAD_LEFT),
                    'user' => [
                        'name' => $row['name'],
                        'phone' => $row['phone'],
                        'email' => $row['email'],
                        'created_at' => $row['created_at']
                    ]
                ];
            }

            $prevPageUrl = $page > 1 ? "?page=" . ($page - 1) : null;
            $nextPageUrl = $page < $lastPage ? "?page=" . ($page + 1) : null;

            $resData = [
                'current_page' => $page,
                'last_page' => $lastPage,
                'total' => $total,
                'per_page' => $limit,
                'prev_page_url' => $prevPageUrl,
                'next_page_url' => $nextPageUrl,
                'data' => $formatted
            ];

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'response' => $resData,
                'data' => $formatted
            ]);
        } catch (\Throwable $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => $e->getMessage(),
                'response' => ['current_page' => 1, 'last_page' => 1, 'total' => 0, 'data' => []],
                'data' => []
            ]);
        }
    }

    public function actionFavoriteDriver()
    {
        try {
            $data = $this->request();
            $centralId = (int)($data->centralId ?? ($data['centralId'] ?? 0));
            $driverId = (int)($data->driverId ?? ($data['driverId'] ?? 0));
            $isFavorite = isset($data->isFavorite) ? (int)$data->isFavorite : (isset($data['isFavorite']) ? (int)$data['isFavorite'] : 1);

            if (!$centralId || !$driverId) {
                throw new \Exception("Central e Motorista são obrigatórios");
            }

            $pdo = Connection::open(Connection::DB_MYSQL_RW);
            $stmt = $pdo->prepare("SELECT id FROM centralDriver WHERE centralId = :cid AND driverId = :did");
            $stmt->execute([':cid' => $centralId, ':did' => $driverId]);
            $existing = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($existing) {
                $upd = $pdo->prepare("UPDATE centralDriver SET isFavorite = :fav, updated_at = NOW() WHERE id = :id");
                $upd->execute([':fav' => $isFavorite, ':id' => $existing['id']]);
            } else {
                $ins = $pdo->prepare("INSERT INTO centralDriver (centralId, driverId, isFavorite, created_at, updated_at) VALUES (:cid, :did, :fav, NOW(), NOW())");
                $ins->execute([':cid' => $centralId, ':did' => $driverId, ':fav' => $isFavorite]);
            }

            echo $this->returnSuccess("Status de favorito atualizado com sucesso");
        } catch (\Throwable $e) {
            echo $this->returnError($e);
        }
    }

    public function actionDriverPositions()
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL_RO);
            $statusParam = $_GET['status'] ?? 'disponivel,corrida,online,available,busy,in_progress';
            $statusList = array_filter(array_map('trim', explode(',', $statusParam)));
            if (empty($statusList)) {
                $statusList = ['disponivel', 'corrida', 'online', 'available', 'busy', 'in_progress'];
            }
            $expandedStatuses = [];
            foreach ($statusList as $st) {
                $expandedStatuses[] = addslashes($st);
                if ($st === 'disponivel') {
                    $expandedStatuses[] = 'online';
                    $expandedStatuses[] = 'available';
                } elseif ($st === 'online') {
                    $expandedStatuses[] = 'disponivel';
                    $expandedStatuses[] = 'available';
                } elseif ($st === 'corrida') {
                    $expandedStatuses[] = 'busy';
                    $expandedStatuses[] = 'in_progress';
                    $expandedStatuses[] = 'boarding';
                    $expandedStatuses[] = 'accepted';
                }
            }
            $expandedStatuses = array_unique($expandedStatuses);
            $inClause = "'" . implode("','", $expandedStatuses) . "'";

            $sql = "SELECT d.idDriver, d.userId, d.cityId, d.last_lat AS latitude, d.last_lon AS longitude, 
                           d.status, u.name, u.phone, d.profileImage,
                           CASE 
                               WHEN d.profileImage IS NOT NULL AND d.profileImage != '' AND d.profileImage NOT LIKE '%/%'
                               THEN CONCAT('https://api.movymob.com/uploads/driver/', d.profileImage)
                               ELSE NULL 
                           END AS iconMapDriver,
                           c.plate, c.model, c.color
                    FROM driver d
                    INNER JOIN user u ON d.userId = u.idUser
                    LEFT JOIN car c ON d.idDriver = c.driverId AND c.deleted_at IS NULL
                    WHERE d.last_lat IS NOT NULL 
                      AND d.last_lat != '' 
                      AND d.last_lat != 0
                      AND d.last_lon IS NOT NULL 
                      AND d.last_lon != ''
                      AND d.last_lon != 0
                      AND (d.driverRegisterStatusId = 1 OR d.driverRegisterStatusId IS NULL)
                      AND (u.statusId = 1 OR u.statusId IS NULL)
                      AND d.status IN ({$inClause})
                    ORDER BY d.idDriver DESC
                    LIMIT 200";

            $stmt = $pdo->query($sql);
            $drivers = $stmt ? $stmt->fetchAll(PDO::FETCH_ASSOC) : [];

            $formatted = array_map(function($row) {
                return [
                    'idDriver' => (int)$row['idDriver'],
                    'userId' => (int)$row['userId'],
                    'cityId' => $row['cityId'] ? (int)$row['cityId'] : null,
                    'latitude' => (float)$row['latitude'],
                    'longitude' => (float)$row['longitude'],
                    'name' => $row['name'],
                    'nickname' => $row['name'],
                    'phone' => $row['phone'] ?? '',
                    'status' => $row['status'],
                    'profileImage' => $row['profileImage'],
                    'iconMapDriver' => $row['iconMapDriver'],
                    'car' => [
                        'plate' => $row['plate'] ?? '',
                        'model' => $row['model'] ?? '',
                        'color' => $row['color'] ?? '',
                    ]
                ];
            }, $drivers);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Posições encontradas',
                'response' => $formatted,
                'data' => $formatted,
                'errors' => null
            ]);
        } catch (\Throwable $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['status' => true, 'response' => [], 'data' => []]);
        }
    }

    public function actionTripInfoQuestion()
    {
        header('Content-Type: application/json; charset=utf-8');
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $centralId = (int)($_GET['id'] ?? 0);

        preg_match('#/tripInfoQuestion/(\d+)#i', $_SERVER['REQUEST_URI'] ?? '', $m);
        $questionId = !empty($m[1]) ? (int)$m[1] : (int)($_GET['idQuestion'] ?? ($_GET['subId'] ?? 0));

        if ($method === 'POST') {
            try {
                $data = $this->request();
                $title = trim($data->title ?? '');
                $required = !empty($data->required) ? 1 : 0;

                if (empty($title)) {
                    throw new \Exception("Título da pergunta é obrigatório");
                }

                $pdo = Connection::open(Connection::DB_MYSQL_RW);
                $stmt = $pdo->prepare("INSERT INTO centralTripInfoQuestion (title, required, centralId, created_at, updated_at) VALUES (:title, :required, :cid, NOW(), NOW())");
                $stmt->execute([
                    ':title' => $title,
                    ':required' => $required,
                    ':cid' => $centralId ?: null,
                ]);

                $newId = (int)$pdo->lastInsertId();
                echo json_encode([
                    'status' => true,
                    'message' => 'Campo dinâmico cadastrado com sucesso',
                    'response' => ['id' => $newId, 'title' => $title, 'required' => $required],
                    'data' => ['id' => $newId, 'title' => $title, 'required' => $required],
                    'errors' => null
                ]);
            } catch (\Throwable $e) {
                echo json_encode([
                    'status' => false,
                    'message' => $e->getMessage(),
                    'response' => null,
                    'errors' => [$e->getMessage()]
                ]);
            }
            return;
        }

        if ($method === 'PUT' || $method === 'PATCH') {
            try {
                $data = $this->request();
                $title = trim($data->title ?? '');
                $required = !empty($data->required) ? 1 : 0;

                if (!$questionId) {
                    throw new \Exception("ID da pergunta não informado");
                }
                if (empty($title)) {
                    throw new \Exception("Título da pergunta é obrigatório");
                }

                $pdo = Connection::open(Connection::DB_MYSQL_RW);
                $stmt = $pdo->prepare("UPDATE centralTripInfoQuestion SET title = :title, required = :required, updated_at = NOW() WHERE id = :qid");
                $stmt->execute([
                    ':title' => $title,
                    ':required' => $required,
                    ':qid' => $questionId,
                ]);

                echo json_encode([
                    'status' => true,
                    'message' => 'Campo dinâmico atualizado com sucesso',
                    'response' => ['id' => $questionId, 'title' => $title, 'required' => $required],
                    'data' => ['id' => $questionId, 'title' => $title, 'required' => $required],
                    'errors' => null
                ]);
            } catch (\Throwable $e) {
                echo json_encode([
                    'status' => false,
                    'message' => $e->getMessage(),
                    'response' => null,
                    'errors' => [$e->getMessage()]
                ]);
            }
            return;
        }

        if ($method === 'DELETE') {
            try {
                if (!$questionId) {
                    throw new \Exception("ID da pergunta não informado");
                }

                $pdo = Connection::open(Connection::DB_MYSQL_RW);
                $stmt = $pdo->prepare("UPDATE centralTripInfoQuestion SET deleted_at = NOW(), updated_at = NOW() WHERE id = :qid");
                $stmt->execute([':qid' => $questionId]);

                echo json_encode([
                    'status' => true,
                    'message' => 'Campo dinâmico removido com sucesso',
                    'response' => true,
                    'data' => true,
                    'errors' => null
                ]);
            } catch (\Throwable $e) {
                echo json_encode([
                    'status' => false,
                    'message' => $e->getMessage(),
                    'response' => null,
                    'errors' => [$e->getMessage()]
                ]);
            }
            return;
        }

        // GET single or list
        try {
            $pdo = Connection::open(Connection::DB_MYSQL_RO);

            if ($questionId > 0) {
                $stmt = $pdo->prepare("SELECT id, title, required, centralId, created_at, updated_at FROM centralTripInfoQuestion WHERE id = :qid AND deleted_at IS NULL LIMIT 1");
                $stmt->execute([':qid' => $questionId]);
                $question = $stmt->fetch(PDO::FETCH_ASSOC);

                if (!$question) {
                    throw new \Exception("Pergunta não encontrada");
                }

                echo json_encode([
                    'status' => true,
                    'message' => 'Pergunta encontrada',
                    'response' => $question,
                    'data' => $question,
                    'errors' => null
                ]);
                return;
            }

            $stmt = $pdo->prepare("SELECT id, title, required, centralId, created_at, updated_at FROM centralTripInfoQuestion WHERE (centralId = :cid OR centralId IS NULL OR centralId = 0) AND deleted_at IS NULL ORDER BY id DESC");
            $stmt->execute([':cid' => $centralId]);
            $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                'status' => true,
                'message' => 'Campos dinâmicos encontrados',
                'response' => $questions,
                'data' => $questions,
                'errors' => null
            ]);
        } catch (\Throwable $e) {
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
        $this->fetchTrips(false);
    }

    public function actionTripActivesRealtime()
    {
        $this->fetchTrips(true);
    }

    private function fetchTrips(bool $onlyActivesByDefault = false)
    {
        header('Content-Type: application/json; charset=utf-8');
        try {
            $centralId = (int)($_GET['id'] ?? ($_GET['idCentral'] ?? 0));
            $page = max(1, (int)($_GET['page'] ?? 1));
            $perPage = max(1, (int)($_GET['per_page'] ?? 15));
            $offset = ($page - 1) * $perPage;

            $statusFilter = $_GET['status'] ?? null;
            $flowFilter = $_GET['flow'] ?? null;
            $customerNameFilter = $_GET['customerName'] ?? null;
            $driverNameFilter = $_GET['driverName'] ?? null;
            $driverIdFilter = $_GET['driverId'] ?? null;
            $dateFilter = $_GET['date'] ?? null;

            $pdo = Connection::open(Connection::DB_MYSQL_RW);

            $activeStatuses = ['searching', 'searching_favorite', 'pre_accepted', 'accepted', 'boarding', 'in_progress', 'scheduled'];

            $where = ["1=1"];
            $params = [];

            if ($centralId > 0) {
                $where[] = "(trip.centralId = :centralId OR trip.driverId IN (SELECT driverId FROM centralDriver WHERE centralId = :centralIdDrivers AND statusId = 1))";
                $params[':centralId'] = $centralId;
                $params[':centralIdDrivers'] = $centralId;
            }

            if (!empty($statusFilter)) {
                $where[] = "trip.status = :status";
                $params[':status'] = $statusFilter;
            } elseif ($onlyActivesByDefault) {
                $inStatuses = "'" . implode("','", $activeStatuses) . "'";
                $where[] = "trip.status IN ({$inStatuses})";
            }

            if (!empty($driverIdFilter)) {
                $where[] = "trip.driverId = :driverIdFilter";
                $params[':driverIdFilter'] = (int)$driverIdFilter;
            }

            if (!empty($dateFilter)) {
                if (is_array($dateFilter) && count($dateFilter) >= 2 && !empty($dateFilter[0]) && !empty($dateFilter[1])) {
                    $where[] = "DATE(trip.date) >= :dStart AND DATE(trip.date) <= :dEnd";
                    $params[':dStart'] = $dateFilter[0];
                    $params[':dEnd'] = $dateFilter[1];
                } elseif (is_string($dateFilter) && !empty($dateFilter)) {
                    $where[] = "DATE(trip.date) = :dSingle";
                    $params[':dSingle'] = $dateFilter;
                }
            }

            if (!empty($flowFilter)) {
                $where[] = "trip.flow = :flow";
                $params[':flow'] = $flowFilter;
            }

            if (!empty($customerNameFilter)) {
                $where[] = "(u.nickname LIKE :cName OR u.name LIKE :cName2 OR tc.name LIKE :cName3 OR cc.name LIKE :cName4)";
                $params[':cName'] = "%{$customerNameFilter}%";
                $params[':cName2'] = "%{$customerNameFilter}%";
                $params[':cName3'] = "%{$customerNameFilter}%";
                $params[':cName4'] = "%{$customerNameFilter}%";
            }

            if (!empty($driverNameFilter)) {
                $where[] = "(ud.nickname LIKE :dName OR ud.name LIKE :dName2)";
                $params[':dName'] = "%{$driverNameFilter}%";
                $params[':dName2'] = "%{$driverNameFilter}%";
            }

            $whereSql = implode(" AND ", $where);

            // Count total scheduled trips for this central
            $schedWhere = $centralId > 0
                ? "trip.status = 'scheduled' AND (trip.centralId = :sCentralId OR trip.driverId IN (SELECT driverId FROM centralDriver WHERE centralId = :sCentralIdDrivers AND statusId = 1))"
                : "trip.status = 'scheduled'";
            $schedParams = $centralId > 0 ? [':sCentralId' => $centralId, ':sCentralIdDrivers' => $centralId] : [];
            $stmtSched = $pdo->prepare("SELECT COUNT(*) FROM trip WHERE {$schedWhere}");
            $stmtSched->execute($schedParams);
            $scheduledTotal = (int)$stmtSched->fetchColumn();

            // Count total matching active trips
            $countSql = "
                SELECT COUNT(DISTINCT trip.idTrip)
                FROM trip
                LEFT JOIN `user` u ON trip.userId = u.idUser
                LEFT JOIN tripCustomer tc ON trip.tripCustomerId = tc.id
                LEFT JOIN centralCustomer cc ON trip.centralCustomerId = cc.id
                LEFT JOIN driver d ON trip.driverId = d.idDriver
                LEFT JOIN `user` ud ON d.userId = ud.idUser
                WHERE {$whereSql}
            ";
            $stmtCount = $pdo->prepare($countSql);
            $stmtCount->execute($params);
            $total = (int)$stmtCount->fetchColumn();

            // Select matching trip references
            $selectSql = "
                SELECT 
                    trip.idTrip,
                    trip.tripReference,
                    trip.status,
                    trip.flow,
                    trip.price,
                    trip.date,
                    trip.centralId,
                    trip.driverId,
                    trip.userId,
                    trip.canceledBy,
                    COALESCE(tpf.name, 'Dinheiro') AS paymentForm,
                    COALESCE(ta.situation, '') AS situation,
                    COALESCE(tc.name, cc.name, u.nickname, u.name, '') AS customerName,
                    COALESCE(tc.phone, cc.phone, u.phone, '') AS customerPhone,
                    COALESCE(ud.nickname, ud.name, '') AS driverName,
                    COALESCE(ud.phone, '') AS driverPhone,
                    COALESCE(orig.address, '') AS originAddress,
                    orig.latitude AS originLat,
                    orig.longitude AS originLng,
                    COALESCE(dest.address, '') AS destinationAddress,
                    dest.latitude AS destinationLat,
                    dest.longitude AS destinationLng,
                    ts.schedule AS scheduledDate
                FROM trip
                LEFT JOIN tripPaymentForm tpf ON trip.tripPaymentFormId = tpf.idTripPaymentForm
                LEFT JOIN tripAudit ta ON trip.tripAuditId = ta.id
                LEFT JOIN `user` u ON trip.userId = u.idUser
                LEFT JOIN tripCustomer tc ON trip.tripCustomerId = tc.id
                LEFT JOIN centralCustomer cc ON trip.centralCustomerId = cc.id
                LEFT JOIN driver d ON trip.driverId = d.idDriver
                LEFT JOIN `user` ud ON d.userId = ud.idUser
                LEFT JOIN origin orig ON trip.originId = orig.idOrigin
                LEFT JOIN destination dest ON trip.destinationId = dest.idDestination
                LEFT JOIN tripScheduled ts ON trip.tripReference = ts.tripReference
                WHERE {$whereSql}
                ORDER BY 
                    CASE WHEN trip.status = 'scheduled' THEN 0 ELSE 1 END ASC,
                    trip.date DESC
                LIMIT :limit OFFSET :offset
            ";
            $stmtSelect = $pdo->prepare($selectSql);
            foreach ($params as $k => $v) {
                $stmtSelect->bindValue($k, $v);
            }
            $stmtSelect->bindValue(':limit', $perPage, PDO::PARAM_INT);
            $stmtSelect->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmtSelect->execute();
            $rows = $stmtSelect->fetchAll(PDO::FETCH_ASSOC);

            // Fetch waypoints for retrieved trips
            $waypointMap = [];
            if (!empty($rows)) {
                $refs = array_column($rows, 'tripReference');
                $placeholders = implode(',', array_fill(0, count($refs), '?'));
                try {
                    $stmtWay = $pdo->prepare("SELECT tripReference, latitude, longitude, address FROM tripWayPoints WHERE tripReference IN ({$placeholders}) ORDER BY id ASC");
                    $stmtWay->execute($refs);
                    $allWay = $stmtWay->fetchAll(PDO::FETCH_ASSOC);
                    foreach ($allWay as $way) {
                        $way['name'] = $way['address'] ?? '';
                        $waypointMap[$way['tripReference']][] = (object)$way;
                    }
                } catch (\Throwable $wEx) {}
            }

            // Build trip objects
            $tripDao = new \app\dao\TripDao();
            $trips = [];
            foreach ($rows as $row) {
                try {
                    $foundTrip = $tripDao->find($row['tripReference'], false);
                    if ($foundTrip) {
                        $trips[] = $foundTrip;
                        continue;
                    }
                } catch (\Throwable $e) {}

                // Structured fallback trip object ensuring all properties needed by selectTrip.js exist
                $trips[] = (object)[
                    'idTrip' => $row['idTrip'],
                    'tripReference' => $row['tripReference'],
                    'status' => $row['status'],
                    'flow' => $row['flow'],
                    'price' => $row['price'] ?? '0.00',
                    'date' => $row['date'],
                    'paymentForm' => $row['paymentForm'],
                    'situation' => $row['situation'],
                    'canceledBy' => $row['canceledBy'],
                    'customer' => (object)[
                        'name' => $row['customerName'],
                        'phone' => $row['customerPhone']
                    ],
                    'centralCustomer' => (object)[
                        'name' => $row['customerName'],
                        'phone' => $row['customerPhone']
                    ],
                    'driver' => !empty($row['driverId']) ? (object)[
                        'id' => $row['driverId'],
                        'name' => $row['driverName'],
                        'phone' => $row['driverPhone']
                    ] : null,
                    'origin' => (object)[
                        'address' => $row['originAddress'],
                        'name' => $row['originAddress'],
                        'latitude' => $row['originLat'],
                        'longitude' => $row['originLng']
                    ],
                    'destination' => (object)[
                        'address' => $row['destinationAddress'],
                        'name' => $row['destinationAddress'],
                        'latitude' => $row['destinationLat'],
                        'longitude' => $row['destinationLng']
                    ],
                    'tripWayPoints' => $waypointMap[$row['tripReference']] ?? [],
                    'schedule' => !empty($row['scheduledDate']) ? (object)[
                        'schedule' => $row['scheduledDate']
                    ] : null
                ];
            }

            $lastPage = $total > 0 ? (int)ceil($total / $perPage) : 1;

            $tripsPagination = [
                'current_page' => $page,
                'data' => $trips,
                'first_page_url' => null,
                'from' => $total > 0 ? $offset + 1 : null,
                'last_page' => $lastPage,
                'last_page_url' => null,
                'next_page_url' => $page < $lastPage ? true : null,
                'path' => null,
                'per_page' => $perPage,
                'prev_page_url' => $page > 1 ? true : null,
                'to' => min($offset + $perPage, $total),
                'total' => $total
            ];

            echo json_encode([
                'status' => true,
                'message' => 'Viagens listadas com sucesso',
                'response' => [
                    'trips' => $tripsPagination,
                    'current_page' => $page,
                    'last_page' => $lastPage,
                    'total' => $total,
                    'per_page' => $perPage,
                    'data' => $trips,
                    'scheduledTotal' => $scheduledTotal
                ],
                'data' => $tripsPagination,
                'current_page' => $page,
                'last_page' => $lastPage,
                'total' => $total,
                'scheduledTotal' => $scheduledTotal
            ]);
        } catch (\Throwable $e) {
            echo json_encode([
                'status' => false,
                'message' => $e->getMessage(),
                'response' => [
                    'trips' => [
                        'current_page' => 1,
                        'data' => [],
                        'total' => 0
                    ],
                    'data' => [],
                    'scheduledTotal' => 0
                ]
            ]);
        }
    }

    public function actionPrice()
    {
        $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        try {
            $pdo = Connection::open(Connection::DB_MYSQL);
            $uriPath = trim(parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH), '/');
            $parts = explode('/', $uriPath);
            $lastPart = end($parts);
            $idFromPath = is_numeric($lastPart) ? (int)$lastPart : 0;

            // Extract centralId from /central/{id}/price or query
            $centralId = 0;
            if (isset($parts[0]) && $parts[0] === 'central' && isset($parts[1]) && is_numeric($parts[1])) {
                $centralId = (int)$parts[1];
            }
            if ($centralId <= 0) {
                $centralId = (int)($_GET['centralId'] ?? 0);
            }

            $cityId = (int)($_SERVER['HTTP_CITYID'] ?? ($_SERVER['HTTP_CITY_ID'] ?? ($_GET['cityId'] ?? 0)));
            if ($cityId <= 0) {
                $cityId = 5605;
            }

            if ($method === 'DELETE') {
                $id = (int)($_GET['id'] ?? $idFromPath);
                if ($id > 0) {
                    $pdo->prepare("UPDATE price SET statusId = 2, updated_at = NOW() WHERE id = :id")->execute([':id' => $id]);
                }
                echo $this->returnSuccess('Tarifa removida com sucesso', true);
                return;
            }

            if ($method === 'POST' || $method === 'PUT') {
                $raw = file_get_contents('php://input');
                $data = json_decode($raw, true) ?: $_POST;

                $tripTypeId = (int)($data['tripTypeId'] ?? 0);
                $tag = (string)($data['tag'] ?? '');
                $color = (string)($data['color'] ?? '#000000');
                $min_price = (float)($data['min_price'] ?? 0);
                $base_price = (float)($data['base_price'] ?? 0);
                $km_price = (float)($data['km_price'] ?? 0);
                $minute_price = (float)($data['minute_price'] ?? 0);
                $tax_price = (float)($data['tax_price'] ?? 0);
                $another_fee = (float)($data['another_fee'] ?? 0);
                $waypoint_price = (float)($data['waypoint_price'] ?? 0);
                $postCityId = (int)($data['cityId'] ?? $cityId);

                $targetId = $idFromPath > 0 ? $idFromPath : (int)($data['id'] ?? 0);

                if ($targetId > 0) {
                    $upd = $pdo->prepare("
                        UPDATE price SET
                            tag = :tag,
                            color = :color,
                            min_price = :min_price,
                            base_price = :base_price,
                            km_price = :km_price,
                            minute_price = :minute_price,
                            tax_price = :tax_price,
                            another_fee = :another_fee,
                            waypoint_price = :waypoint_price,
                            statusId = 1,
                            updated_at = NOW()
                        WHERE id = :id
                    ");
                    $upd->execute([
                        ':tag' => $tag,
                        ':color' => $color,
                        ':min_price' => $min_price,
                        ':base_price' => $base_price,
                        ':km_price' => $km_price,
                        ':minute_price' => $minute_price,
                        ':tax_price' => $tax_price,
                        ':another_fee' => $another_fee,
                        ':waypoint_price' => $waypoint_price,
                        ':id' => $targetId
                    ]);
                    echo $this->returnSuccess('Tarifa atualizada com sucesso', ['id' => $targetId]);
                    return;
                }

                // Check existing active price for this city and tripType
                $check = $pdo->prepare("SELECT id FROM price WHERE cityId = :cityId AND tripTypeId = :tripTypeId AND statusId = 1 LIMIT 1");
                $check->execute([':cityId' => $postCityId, ':tripTypeId' => $tripTypeId]);
                $existing = $check->fetch(PDO::FETCH_ASSOC);

                if ($existing) {
                    $upd = $pdo->prepare("
                        UPDATE price SET
                            tag = :tag,
                            color = :color,
                            min_price = :min_price,
                            base_price = :base_price,
                            km_price = :km_price,
                            minute_price = :minute_price,
                            tax_price = :tax_price,
                            another_fee = :another_fee,
                            waypoint_price = :waypoint_price,
                            updated_at = NOW()
                        WHERE id = :id
                    ");
                    $upd->execute([
                        ':tag' => $tag,
                        ':color' => $color,
                        ':min_price' => $min_price,
                        ':base_price' => $base_price,
                        ':km_price' => $km_price,
                        ':minute_price' => $minute_price,
                        ':tax_price' => $tax_price,
                        ':another_fee' => $another_fee,
                        ':waypoint_price' => $waypoint_price,
                        ':id' => (int)$existing['id']
                    ]);
                    echo $this->returnSuccess('Tarifa atualizada com sucesso', ['id' => (int)$existing['id']]);
                    return;
                }

                $ins = $pdo->prepare("
                    INSERT INTO price (
                        cityId, tripTypeId, tag, color,
                        min_price, base_price, km_price, minute_price,
                        tax_price, another_fee, waypoint_price,
                        statusId, created_at, updated_at
                    ) VALUES (
                        :cityId, :tripTypeId, :tag, :color,
                        :min_price, :base_price, :km_price, :minute_price,
                        :tax_price, :another_fee, :waypoint_price,
                        1, NOW(), NOW()
                    )
                ");
                $ins->execute([
                    ':cityId' => $postCityId,
                    ':tripTypeId' => $tripTypeId,
                    ':tag' => $tag,
                    ':color' => $color,
                    ':min_price' => $min_price,
                    ':base_price' => $base_price,
                    ':km_price' => $km_price,
                    ':minute_price' => $minute_price,
                    ':tax_price' => $tax_price,
                    ':another_fee' => $another_fee,
                    ':waypoint_price' => $waypoint_price
                ]);
                $newId = (int)$pdo->lastInsertId();
                echo $this->returnSuccess('Tarifa salva com sucesso', ['id' => $newId]);
                return;
            }

            // GET method: list prices
            $stmt = $pdo->prepare("
                SELECT 
                    p.id,
                    p.cityId,
                    p.tripTypeId,
                    p.min_price,
                    p.base_price,
                    p.km_price,
                    p.minute_price,
                    p.tax_price,
                    p.tax_price_type,
                    p.tax_price_description,
                    p.another_fee,
                    p.another_fee_type,
                    p.another_fee_description,
                    p.waypoint_price,
                    p.tag,
                    p.color,
                    p.statusId,
                    tt.idTripType,
                    tt.type,
                    COALESCE(tt.name, tt.type) as tripTypeName,
                    tt.description as tripTypeDescription,
                    tt.picture as tripTypePicture,
                    COALESCE(tt.serviceOption, 0) as serviceOption
                FROM price p
                LEFT JOIN tripType tt ON p.tripTypeId = tt.idTripType
                WHERE p.statusId = 1
                  AND (p.cityId = :cityId OR :cityIdZero = 0)
                ORDER BY p.cityId ASC, (p.`order` IS NULL) ASC, p.`order` ASC, p.id ASC
            ");
            $stmt->execute([':cityId' => $cityId, ':cityIdZero' => $cityId]);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

            $result = array_map(function ($row) {
                $tId = (int)($row['idTripType'] ?? $row['tripTypeId']);
                $row['trip_type'] = [
                    'idTripType' => $tId,
                    'id' => $tId,
                    'type' => $row['type'] ?? $row['tripTypeName'] ?? $row['tag'] ?? ('Tarifa ' . $tId),
                    'name' => $row['tripTypeName'] ?? $row['type'] ?? $row['tag'] ?? ('Tarifa ' . $tId),
                    'description' => $row['tripTypeDescription'] ?? '',
                    'picture' => $row['tripTypePicture'] ?? '',
                    'serviceOption' => (int)($row['serviceOption'] ?? 0)
                ];
                return $row;
            }, $rows);

            echo $this->returnSuccess('Preços encontrados', $result);
        } catch (\Throwable $e) {
            echo $this->returnError($e, 'Erro ao processar tarifas');
        }
    }

    public function actionPriceRange()
    {
        $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        try {
            $pdo = Connection::open(Connection::DB_MYSQL);
            $cityId = isset($_GET['cityId']) ? (int)$_GET['cityId'] : 0;

            if ($method === 'DELETE') {
                $id = (int)($_GET['id'] ?? 0);
                if ($id <= 0) {
                    $parts = explode('/', trim(parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH), '/'));
                    $id = (int)end($parts);
                }
                $pdo->prepare("UPDATE priceRange SET statusId = 2, updated_at = NOW() WHERE id = :id")
                    ->execute([':id' => $id]);
                echo $this->returnSuccess('Faixa removida', true);
                return;
            }

            if ($method === 'POST' || $method === 'PUT') {
                $raw = file_get_contents('php://input');
                $data = json_decode($raw, true) ?: $_POST;
                $ins = $pdo->prepare("
                    INSERT INTO priceRange (cityId, tripTypeId, description, min_value, max_value, new_value, statusId, created_at, updated_at)
                    VALUES (:cityId, :tripTypeId, :description, :min_value, :max_value, :new_value, 1, NOW(), NOW())
                ");
                $ins->execute([
                    ':cityId' => (int)($data['cityId'] ?? $cityId),
                    ':tripTypeId' => (int)($data['tripTypeId'] ?? 0),
                    ':description' => (string)($data['description'] ?? ''),
                    ':min_value' => (float)($data['min_value'] ?? 0),
                    ':max_value' => (float)($data['max_value'] ?? 0),
                    ':new_value' => (float)($data['new_value'] ?? 0),
                ]);
                echo $this->returnSuccess('Faixa criada', ['id' => (int)$pdo->lastInsertId()]);
                return;
            }

            $sql = "
                SELECT pr.id, pr.cityId, pr.tripTypeId, pr.description, pr.min_value, pr.max_value, pr.new_value, pr.statusId
                FROM priceRange pr
                WHERE pr.statusId = 1
            ";
            $params = [];
            if ($cityId > 0) {
                $sql .= " AND pr.cityId = :cityId";
                $params[':cityId'] = $cityId;
            }
            $sql .= " ORDER BY pr.id DESC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
            echo $this->returnSuccess('Faixas encontradas', $rows);
        } catch (\Throwable $e) {
            echo $this->returnError($e, 'Erro ao processar faixa de preço');
        }
    }

    public function actionFee()
    {
        $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        try {
            if ($method === 'POST' || $method === 'PUT') {
                $raw = file_get_contents('php://input');
                $data = json_decode($raw, true);
                if (!is_array($data) || empty($data)) {
                    $data = $_POST;
                }

                $pdo = Connection::open(Connection::DB_MYSQL);
                $pdo->prepare("UPDATE centralFee SET statusId = 2 WHERE statusId = 1")->execute();

                $returnFee = isset($data['returnFee']) ? (float)$data['returnFee'] : 0;
                $isByKm = !empty($data['isByKm']) ? 1 : 0;
                $paidByCentral = !empty($data['paidByCentral']) ? 1 : 0;

                $ins = $pdo->prepare("
                    INSERT INTO centralFee (returnFee, isByKm, paidByCentral, statusId, created_at, updated_at)
                    VALUES (:returnFee, :isByKm, :paidByCentral, 1, NOW(), NOW())
                ");
                $ins->execute([
                    ':returnFee' => $returnFee,
                    ':isByKm' => $isByKm,
                    ':paidByCentral' => $paidByCentral,
                ]);

                echo $this->returnSuccess('Taxa atualizada', [
                    'id' => (int)$pdo->lastInsertId(),
                    'returnFee' => $returnFee,
                    'isByKm' => (bool)$isByKm,
                    'paidByCentral' => (bool)$paidByCentral,
                    'statusId' => 1,
                ]);
                return;
            }

            $pdo = Connection::open(Connection::DB_MYSQL_RO);
            $stmt = $pdo->query("SELECT id, returnFee, isByKm, paidByCentral, statusId FROM centralFee WHERE statusId = 1 ORDER BY id DESC LIMIT 1");
            $fee = $stmt ? $stmt->fetch(PDO::FETCH_ASSOC) : null;
            if (!$fee) {
                $fee = [
                    'id' => 0,
                    'returnFee' => 0.0,
                    'isByKm' => false,
                    'paidByCentral' => false,
                    'statusId' => 1,
                ];
            } else {
                $fee['id'] = (int)$fee['id'];
                $fee['returnFee'] = (float)$fee['returnFee'];
                $fee['isByKm'] = (bool)(int)$fee['isByKm'];
                $fee['paidByCentral'] = (bool)(int)$fee['paidByCentral'];
                $fee['statusId'] = (int)$fee['statusId'];
            }
            echo $this->returnSuccess('Taxa da central recuperada', $fee);
        } catch (\Throwable $e) {
            echo $this->returnError($e, 'Erro ao processar taxa da central');
        }
    }

    public function actionVoucherPurchasePaymentFindAll()
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL_RO);
            $stmt = $pdo->query("
                SELECT
                    cvp.id,
                    cvp.paymentFormId,
                    cvp.isActive,
                    pf.name AS name
                FROM centralVoucherPurchasePayment cvp
                JOIN paymentForm pf ON pf.idPaymentForm = cvp.paymentFormId
                WHERE cvp.statusId = 1
            ");
            $rows = $stmt ? $stmt->fetchAll(PDO::FETCH_ASSOC) : [];
            foreach ($rows as &$row) {
                $row['id'] = (int)$row['id'];
                $row['paymentFormId'] = (int)$row['paymentFormId'];
                $row['isActive'] = (int)$row['isActive'];
            }
            echo $this->returnSuccess('Formas de pagamento encontradas', $rows);
        } catch (\Throwable $e) {
            echo $this->returnError($e, 'Erro ao listar formas de pagamento');
        }
    }

    public function actionVoucherPurchasePaymentUpdatePaymentForm()
    {
        try {
            $raw = file_get_contents('php://input');
            $data = json_decode($raw, true);
            if (!is_array($data)) {
                $data = $_POST;
            }
            // Axios pode enviar array raiz; Laravel/PHP às vezes embrulha
            if (isset($data[0]) && is_array($data[0])) {
                $items = $data;
            } elseif (isset($data['data']) && is_array($data['data'])) {
                $items = $data['data'];
            } else {
                $items = array_values(array_filter($data, 'is_array'));
            }

            if (empty($items)) {
                echo $this->returnError(new Exception('Payload inválido'), 'Nenhum pagamento enviado');
                return;
            }

            $pdo = Connection::open(Connection::DB_MYSQL);
            $upd = $pdo->prepare("
                UPDATE centralVoucherPurchasePayment
                SET isActive = :isActive, updated_at = NOW()
                WHERE paymentFormId = :paymentFormId AND statusId = 1
            ");
            foreach ($items as $item) {
                if (!isset($item['paymentFormId'])) {
                    continue;
                }
                $upd->execute([
                    ':isActive' => !empty($item['isActive']) ? 1 : 0,
                    ':paymentFormId' => (int)$item['paymentFormId'],
                ]);
            }

            echo $this->returnSuccess('Formas de pagamento atualizadas', true);
        } catch (\Throwable $e) {
            echo $this->returnError($e, 'Erro ao atualizar formas de pagamento');
        }
    }

    public function actionCentralCallTypesFindAll()
    {
        $this->actionCentralCallTypes();
    }

    public function actionCentralCallTypesUpdate()
    {
        try {
            $raw = file_get_contents('php://input');
            $data = json_decode($raw, true);
            if (!is_array($data)) {
                $data = $_POST;
            }
            $items = isset($data[0]) ? $data : array_values(array_filter($data, 'is_array'));

            $pdo = Connection::open(Connection::DB_MYSQL);
            $upd = $pdo->prepare("
                UPDATE centralCallTypeConfig
                SET isActive = :isActive, updated_at = NOW()
                WHERE centralCallTypeId = :centralCallTypeId
            ");
            foreach ($items as $item) {
                if (!isset($item['centralCallTypeId'])) {
                    continue;
                }
                $upd->execute([
                    ':isActive' => !empty($item['isActive']) ? 1 : 0,
                    ':centralCallTypeId' => (int)$item['centralCallTypeId'],
                ]);
            }
            echo $this->returnSuccess('Tipos de chamado atualizados', true);
        } catch (\Throwable $e) {
            echo $this->returnError($e, 'Erro ao atualizar tipos de chamado');
        }
    }

    public function actionCentralCallTypes()
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL_RO);
            $stmt = $pdo->query("
                SELECT
                    ctc.id,
                    ctc.centralCallTypeId,
                    ctc.isActive,
                    ct.name AS name
                FROM centralCallTypeConfig ctc
                JOIN centralCallType ct ON ct.id = ctc.centralCallTypeId
            ");
            $rows = $stmt ? $stmt->fetchAll(PDO::FETCH_ASSOC) : [];

            $callTypes = [];
            if (!empty($rows)) {
                foreach ($rows as $r) {
                    $callTypes[] = [
                        'id' => (int)$r['id'],
                        'centralCallTypeId' => (int)$r['centralCallTypeId'],
                        'name' => $r['name'],
                        'isActive' => (int)$r['isActive'],
                    ];
                }
            } else {
                $callTypes = [
                    ['centralCallTypeId' => 1, 'id' => 1, 'name' => 'Procurar Cliente', 'isActive' => 1],
                    ['centralCallTypeId' => 2, 'id' => 2, 'name' => 'Chamar para Central', 'isActive' => 1],
                    ['centralCallTypeId' => 3, 'id' => 3, 'name' => 'Procurar Motorista', 'isActive' => 1],
                ];
            }

            echo $this->returnSuccess('Tipos de chamada encontrados', $callTypes);
        } catch (\Throwable $e) {
            echo $this->returnSuccess('Tipos de chamada padrão', [
                ['centralCallTypeId' => 1, 'id' => 1, 'name' => 'Procurar Cliente', 'isActive' => 1],
                ['centralCallTypeId' => 2, 'id' => 2, 'name' => 'Chamar para Central', 'isActive' => 1],
                ['centralCallTypeId' => 3, 'id' => 3, 'name' => 'Procurar Motorista', 'isActive' => 1],
            ]);
        }
    }

    public function actionCallType()
    {
        $this->actionCentralCallTypes();
    }

    public function actionZone()
    {
        try {
            $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
            if ($method === 'POST' && isset($_POST['_method'])) {
                $method = strtoupper($_POST['_method']);
            }

            $centralId = (int)($_GET['id'] ?? ($_GET['idCentral'] ?? 0));
            $pdo = Connection::open(Connection::DB_MYSQL);

            if ($method === 'POST' || $method === 'PUT') {
                $raw = file_get_contents('php://input');
                $data = json_decode($raw, true) ?: $_POST;

                $radius = isset($data['radius']) ? (float)$data['radius'] : 5;
                $greaterRadius = isset($data['greaterRadius']) ? (float)$data['greaterRadius'] : ($radius * 2);
                $idZone = isset($_GET['subId']) ? (int)$_GET['subId'] : (isset($data['id']) ? (int)$data['id'] : 0);

                if ($idZone > 0) {
                    try {
                        $stmt = $pdo->prepare("UPDATE zone SET radius = :radius, greaterRadius = :greaterRadius WHERE idZone = :idZone");
                        $stmt->execute([':radius' => $radius, ':greaterRadius' => $greaterRadius, ':idZone' => $idZone]);
                    } catch (\Throwable $e) {}
                } else {
                    try {
                        $chk = $pdo->query("SELECT idZone FROM zone ORDER BY idZone ASC LIMIT 1")->fetch(PDO::FETCH_ASSOC);
                        if ($chk) {
                            $idZone = (int)$chk['idZone'];
                            $stmt = $pdo->prepare("UPDATE zone SET radius = :radius, greaterRadius = :greaterRadius WHERE idZone = :idZone");
                            $stmt->execute([':radius' => $radius, ':greaterRadius' => $greaterRadius, ':idZone' => $idZone]);
                        } else {
                            $stmt = $pdo->prepare("INSERT INTO zone (name, radius, greaterRadius, statusId, `order`, time) VALUES ('Central Zone', :radius, :greaterRadius, 1, 1, 60)");
                            $stmt->execute([':radius' => $radius, ':greaterRadius' => $greaterRadius]);
                            $idZone = (int)$pdo->lastInsertId();
                        }
                    } catch (\Throwable $e) {
                        $idZone = 1;
                    }
                }

                if ($centralId > 0) {
                    try {
                        $updCentral = $pdo->prepare("UPDATE central SET enableCustomRadiusCentral = 1, placesSearchRadius = :radius WHERE id = :id");
                        $updCentral->execute([':radius' => (int)$radius, ':id' => $centralId]);
                    } catch (\Throwable $e) {}
                }

                header('Content-Type: application/json; charset=utf-8');
                echo json_encode([
                    'status' => true,
                    'message' => 'Raio salvo com sucesso',
                    'response' => [
                        'idZone' => $idZone,
                        'radius' => $radius,
                        'greaterRadius' => $greaterRadius
                    ],
                    'data' => [
                        'idZone' => $idZone,
                        'radius' => $radius,
                        'greaterRadius' => $greaterRadius
                    ],
                    'errors' => null
                ]);
                return;
            }

            // GET request
            $zone = null;
            try {
                $stmt = $pdo->query("SELECT idZone, radius, COALESCE(greaterRadius, radius * 2) as greaterRadius FROM zone ORDER BY idZone ASC LIMIT 1");
                $zone = $stmt->fetch(PDO::FETCH_ASSOC);
            } catch (\Throwable $e) {}

            if (!$zone && $centralId > 0) {
                try {
                    $stmtC = $pdo->prepare("SELECT placesSearchRadius FROM central WHERE id = :id");
                    $stmtC->execute([':id' => $centralId]);
                    $cRow = $stmtC->fetch(PDO::FETCH_ASSOC);
                    $rad = (float)($cRow['placesSearchRadius'] ?? 5);
                    $zone = [
                        'idZone' => 1,
                        'radius' => $rad > 0 ? $rad : 5,
                        'greaterRadius' => ($rad > 0 ? $rad : 5) * 2
                    ];
                } catch (\Throwable $e) {}
            }

            if (!$zone) {
                $zone = [
                    'idZone' => 1,
                    'radius' => 5,
                    'greaterRadius' => 15
                ];
            } else {
                $zone['idZone'] = (int)$zone['idZone'];
                $zone['radius'] = (float)$zone['radius'];
                $zone['greaterRadius'] = (float)$zone['greaterRadius'];
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Sucesso',
                'response' => $zone,
                'data' => $zone,
                'errors' => null
            ]);
        } catch (\Throwable $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao processar raio: ' . $e->getMessage(),
                'response' => null,
                'data' => null,
                'errors' => ['message' => $e->getMessage()]
            ]);
        }
    }
}
