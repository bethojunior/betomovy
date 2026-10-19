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
