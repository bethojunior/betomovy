<?php

namespace app\controllers;

use app\utils\Connection;
use Exception;
use PDO;

class LoginController extends ApiController
{
    public function actionIndex()
    {
        $raw = file_get_contents('php://input');
        $json = json_decode($raw, true);
        
        $email = $json['email'] ?? $_POST['email'] ?? null;
        $password = $json['password'] ?? $_POST['password'] ?? null;

        if (empty($email) || empty($password)) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Email e senha são obrigatórios',
                'data' => null,
                'response' => null,
                'errors' => ['message' => 'Email e senha são obrigatórios']
            ]);
            return;
        }

        try {
            $pdo = Connection::open(Connection::DB_MYSQL);

            $stmt = $pdo->prepare("SELECT * FROM user WHERE email = :email AND statusId = 1 LIMIT 1");
            $stmt->execute([':email' => trim($email)]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user) {
                // Also check if user exists regardless of statusId
                $stmt = $pdo->prepare("SELECT * FROM user WHERE email = :email LIMIT 1");
                $stmt->execute([':email' => trim($email)]);
                $user = $stmt->fetch(PDO::FETCH_ASSOC);
            }

            if (!$user) {
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode([
                    'status' => false,
                    'message' => 'Usuário ou senha inválido',
                    'data' => null,
                    'response' => null,
                    'errors' => ['message' => 'Usuário ou senha inválido']
                ]);
                return;
            }

            // Check password
            $passValid = false;
            $dbPass = (string)($user['password'] ?? '');

            if (base64_encode($password) === $dbPass) {
                $passValid = true;
            } elseif (password_verify($password, $dbPass)) {
                $passValid = true;
            } elseif ($password === $dbPass) {
                $passValid = true;
            } elseif (md5($password) === $dbPass) {
                $passValid = true;
            }

            if (!$passValid) {
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode([
                    'status' => false,
                    'message' => 'Usuário ou senha inválido',
                    'data' => null,
                    'response' => null,
                    'errors' => ['message' => 'Usuário ou senha inválido']
                ]);
                return;
            }

            // Generate API token
            $apiToken = password_hash($user['idUser'] . '_' . time(), PASSWORD_BCRYPT);

            // Update user with api_token
            $upd = $pdo->prepare("UPDATE user SET api_token = :token WHERE idUser = :userId");
            $upd->execute([':token' => $apiToken, ':userId' => $user['idUser']]);

            // Ensure partner record exists and has api_token
            $stmtP = $pdo->prepare("SELECT idPartner FROM partner WHERE userId = :userId LIMIT 1");
            $stmtP->execute([':userId' => $user['idUser']]);
            $partner = $stmtP->fetch(PDO::FETCH_ASSOC);

            if ($partner) {
                $updP = $pdo->prepare("UPDATE partner SET api_token = :token, statusId = 1, partnerRegisterStatusId = 1 WHERE idPartner = :idPartner");
                $updP->execute([':token' => $apiToken, ':idPartner' => $partner['idPartner']]);
            } else {
                $insP = $pdo->prepare("INSERT INTO partner (userId, partnerRegisterStatusId, api_token, created_at, updated_at) VALUES (:userId, 1, :token, NOW(), NOW())");
                $insP->execute([':userId' => $user['idUser'], ':token' => $apiToken]);
            }

            // Fetch centrals for this user
            $stmtC = $pdo->prepare("
                SELECT c.*, cu.id as cuId, cu.isAdmin 
                FROM central c
                LEFT JOIN centralUser cu ON c.id = cu.centralId
                WHERE cu.userId = :userId OR c.responsibleId = :userId
            ");
            $stmtC->execute([':userId' => $user['idUser']]);
            $centralsRaw = $stmtC->fetchAll(PDO::FETCH_ASSOC);

            $centralUserList = [];
            $seenCentral = [];
            foreach ($centralsRaw as $cRow) {
                if (isset($seenCentral[$cRow['id']])) {
                    continue;
                }
                $seenCentral[$cRow['id']] = true;

                $centralUserList[] = (object)[
                    'id' => (int)($cRow['cuId'] ?? $cRow['id']),
                    'centralId' => (int)$cRow['id'],
                    'userId' => (int)$user['idUser'],
                    'isAdmin' => (int)($cRow['isAdmin'] ?? 1),
                    'central' => (object)[
                        'id' => (int)$cRow['id'],
                        'name' => $cRow['name'],
                        'latitude' => $cRow['latitude'],
                        'longitude' => $cRow['longitude'],
                        'address' => $cRow['address'],
                        'logo' => $cRow['logo'] ?: 'default.jpg',
                        'responsibleId' => (int)$cRow['responsibleId'],
                        'balanceId' => $cRow['balanceId'],
                        'key_app_partner' => $cRow['key_app_partner'],
                        'statusId' => (int)($cRow['statusId'] ?? 1)
                    ]
                ];
            }

            $userPayload = [
                'idUser' => (int)$user['idUser'],
                'name' => $user['name'],
                'nickname' => $user['nickname'] ?? $user['name'],
                'email' => $user['email'],
                'phone' => $user['phone'],
                'api_token' => $apiToken,
                'token' => $apiToken,
                'central_user' => $centralUserList,
                'key_app_partner' => $user['key_app_partner'] ?? null
            ];

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Login efetuado com sucesso',
                'response' => $userPayload,
                'data' => $userPayload,
                'errors' => null
            ]);
        } catch (Exception $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao realizar login: ' . $e->getMessage(),
                'data' => null,
                'response' => null,
                'errors' => ['message' => $e->getMessage()]
            ]);
        }
    }
}
