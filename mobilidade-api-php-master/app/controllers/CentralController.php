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
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['status' => true, 'response' => [], 'data' => []]);
    }

    public function actionCustomer()
    {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['status' => true, 'response' => ['data' => []], 'data' => ['data' => []]]);
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

    public function actionZone()
    {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['status' => true, 'response' => [], 'data' => []]);
    }
}
