<?php

namespace app\controllers;

use app\utils\Connection;
use Exception;
use PDO;

class AdminController extends ApiController
{
    public function actionIndex()
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $id = $_GET['id'] ?? null;

        if ($method === 'POST') {
            $this->actionStore();
            return;
        }

        if ($method === 'PUT') {
            $this->actionUpdate();
            return;
        }

        if ($method === 'DELETE') {
            $this->actionDelete();
            return;
        }

        if (!empty($id) && is_numeric($id)) {
            $this->actionShow((int)$id);
            return;
        }

        $this->actionList();
    }

    public function actionList()
    {
        try {
            $pdo = Connection::getConnection(Connection::DB_MYSQL_RO);

            $sql = "
                SELECT 
                    u.idUser,
                    u.email,
                    u.name,
                    u.nickname,
                    u.phone,
                    u.document,
                    COALESCE(u.blocked, 0) as blocked,
                    u.statusId,
                    u.roleId,
                    COALESCE(r.isRoot, 0) as isRoot,
                    COALESCE(r.name, 'Administrador') as roleName
                FROM user u
                LEFT JOIN role r ON u.roleId = r.id
                LEFT JOIN levelAccess la ON u.idUser = la.userId
                WHERE (u.statusId = 1 OR u.statusId IS NULL)
                  AND (u.roleId IS NOT NULL OR la.userTypeId = 4)
                ORDER BY u.idUser DESC
            ";

            $stmt = $pdo->query($sql);
            $users = $stmt ? $stmt->fetchAll(PDO::FETCH_ASSOC) : [];

            // If empty, fetch any users with roleId or levelAccess = 4, or superadmins
            if (empty($users)) {
                $sqlFallback = "
                    SELECT 
                        u.idUser,
                        u.email,
                        u.name,
                        u.nickname,
                        u.phone,
                        u.document,
                        COALESCE(u.blocked, 0) as blocked,
                        u.statusId,
                        u.roleId,
                        COALESCE(r.isRoot, 0) as isRoot,
                        COALESCE(r.name, 'Administrador') as roleName
                    FROM user u
                    LEFT JOIN role r ON u.roleId = r.id
                    WHERE u.statusId = 1
                    ORDER BY u.idUser DESC
                    LIMIT 50
                ";
                $stmt = $pdo->query($sqlFallback);
                $users = $stmt ? $stmt->fetchAll(PDO::FETCH_ASSOC) : [];
            }

            $formatted = array_map(function ($u) {
                return [
                    'idUser' => (int)$u['idUser'],
                    'email' => $u['email'],
                    'name' => $u['name'],
                    'nickname' => $u['nickname'] ?: $u['name'],
                    'phone' => $u['phone'] ?: '',
                    'document' => $u['document'] ?: '',
                    'blocked' => (bool)$u['blocked'],
                    'statusId' => (int)($u['statusId'] ?? 1),
                    'roleId' => (int)($u['roleId'] ?? 1),
                    'isRoot' => (bool)$u['isRoot'],
                    'roleName' => $u['roleName'] ?: 'Administrador'
                ];
            }, $users);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Usuários carregados com sucesso',
                'data' => $formatted,
                'response' => $formatted,
                'errors' => null
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionShow(?int $id = null)
    {
        try {
            $id = $id ?? (int)($_GET['id'] ?? 0);
            if ($id <= 0) {
                throw new Exception("ID do usuário inválido");
            }

            $pdo = Connection::getConnection(Connection::DB_MYSQL_RO);
            $stmt = $pdo->prepare("
                SELECT 
                    u.idUser,
                    u.email,
                    u.name,
                    u.nickname,
                    u.phone,
                    u.document,
                    COALESCE(u.blocked, 0) as blocked,
                    u.statusId,
                    u.roleId,
                    COALESCE(r.isRoot, 0) as isRoot,
                    COALESCE(r.name, 'Administrador') as roleName
                FROM user u
                LEFT JOIN role r ON u.roleId = r.id
                WHERE u.idUser = :id
                LIMIT 1
            ");
            $stmt->execute([':id' => $id]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user) {
                throw new Exception("Usuário não encontrado");
            }

            $formatted = [
                'idUser' => (int)$user['idUser'],
                'email' => $user['email'],
                'name' => $user['name'],
                'nickname' => $user['nickname'] ?: $user['name'],
                'phone' => $user['phone'] ?: '',
                'document' => $user['document'] ?: '',
                'blocked' => (bool)$user['blocked'],
                'statusId' => (int)($user['statusId'] ?? 1),
                'roleId' => (int)($user['roleId'] ?? 1),
                'isRoot' => (bool)$user['isRoot'],
                'roleName' => $user['roleName'] ?: 'Administrador'
            ];

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Usuário carregado com sucesso',
                'data' => $formatted,
                'response' => $formatted,
                'errors' => null
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionStore()
    {
        try {
            $raw = file_get_contents('php://input');
            $input = json_decode($raw, true) ?? $_POST;

            $name = trim($input['name'] ?? '');
            $nickname = trim($input['nickname'] ?? '');
            $email = strtolower(trim($input['email'] ?? ''));
            $phone = preg_replace('/\D/', '', $input['phone'] ?? '');
            $document = preg_replace('/\D/', '', $input['document'] ?? '');
            $password = $input['password'] ?? '';
            $roleId = (int)($input['roleId'] ?? 1);

            if (empty($name) || empty($email) || empty($password)) {
                throw new Exception("Nome, e-mail e senha são obrigatórios.");
            }

            if (empty($nickname)) {
                $parts = explode(' ', $name);
                $nickname = $parts[0];
            }

            $pdo = Connection::getConnection(Connection::DB_MYSQL_RW);

            // Check if email already exists
            $stmtCheck = $pdo->prepare("SELECT idUser FROM user WHERE LOWER(TRIM(email)) = :email LIMIT 1");
            $stmtCheck->execute([':email' => $email]);
            $existing = $stmtCheck->fetch(PDO::FETCH_ASSOC);

            if ($existing) {
                // If user exists, update password and role to grant admin access
                $userId = (int)$existing['idUser'];
                $base64Pass = base64_encode($password);
                $stmtUpd = $pdo->prepare("
                    UPDATE user SET 
                        name = :name,
                        nickname = :nickname,
                        phone = :phone,
                        document = :document,
                        password = :password,
                        roleId = :roleId,
                        statusId = 1,
                        blocked = 0,
                        updated_at = NOW()
                    WHERE idUser = :userId
                ");
                $stmtUpd->execute([
                    ':name' => $name,
                    ':nickname' => $nickname,
                    ':phone' => $phone,
                    ':document' => $document,
                    ':password' => $base64Pass,
                    ':roleId' => $roleId,
                    ':userId' => $userId
                ]);
            } else {
                $base64Pass = base64_encode($password);
                $stmtIns = $pdo->prepare("
                    INSERT INTO user (
                        name, nickname, email, phone, document, password, 
                        roleId, statusId, blocked, created_at, updated_at
                    ) VALUES (
                        :name, :nickname, :email, :phone, :document, :password, 
                        :roleId, 1, 0, NOW(), NOW()
                    )
                ");
                $stmtIns->execute([
                    ':name' => $name,
                    ':nickname' => $nickname,
                    ':email' => $email,
                    ':phone' => $phone,
                    ':document' => $document,
                    ':password' => $base64Pass,
                    ':roleId' => $roleId
                ]);
                $userId = (int)$pdo->lastInsertId();
            }

            // Ensure levelAccess record with userTypeId = 4 (ADMIN)
            try {
                $stmtLA = $pdo->prepare("SELECT idLevelAccess FROM levelAccess WHERE userId = :userId AND userTypeId = 4 LIMIT 1");
                $stmtLA->execute([':userId' => $userId]);
                if (!$stmtLA->fetch()) {
                    $stmtInsLA = $pdo->prepare("INSERT INTO levelAccess (userId, userTypeId) VALUES (:userId, 4)");
                    $stmtInsLA->execute([':userId' => $userId]);
                }
            } catch (\Throwable $t) {
            }

            // Ensure partner record exists
            try {
                $stmtP = $pdo->prepare("SELECT idPartner FROM partner WHERE userId = :userId LIMIT 1");
                $stmtP->execute([':userId' => $userId]);
                if (!$stmtP->fetch()) {
                    $tokenApi = new \app\utils\TokenApi();
                    $plainToken = $tokenApi->generate($userId);
                    $stmtInsP = $pdo->prepare("INSERT INTO partner (userId, partnerRegisterStatusId, statusId, api_token, created_at, updated_at) VALUES (:userId, 1, 1, :token, NOW(), NOW())");
                    $stmtInsP->execute([':userId' => $userId, ':token' => $plainToken]);
                }
            } catch (\Throwable $t) {
            }

            $userData = [
                'idUser' => $userId,
                'name' => $name,
                'nickname' => $nickname,
                'email' => $email,
                'phone' => $phone,
                'document' => $document,
                'roleId' => $roleId,
                'statusId' => 1,
                'blocked' => 0
            ];

            header('Content-Type: application/json; charset=utf-8');
            http_response_code(201);
            echo json_encode([
                'status' => true,
                'message' => 'Usuário criado com sucesso',
                'data' => $userData,
                'response' => $userData,
                'errors' => null
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionUpdate()
    {
        try {
            $id = (int)($_GET['id'] ?? 0);
            $raw = file_get_contents('php://input');
            $input = json_decode($raw, true) ?? $_POST;

            if ($id <= 0) {
                $id = (int)($input['idUser'] ?? 0);
            }

            if ($id <= 0) {
                throw new Exception("ID do usuário inválido");
            }

            $name = trim($input['name'] ?? '');
            $nickname = trim($input['nickname'] ?? '');
            $email = strtolower(trim($input['email'] ?? ''));
            $phone = preg_replace('/\D/', '', $input['phone'] ?? '');
            $document = preg_replace('/\D/', '', $input['document'] ?? '');
            $password = $input['password'] ?? null;
            $roleId = isset($input['roleId']) ? (int)$input['roleId'] : null;

            $pdo = Connection::getConnection(Connection::DB_MYSQL_RW);

            $fields = ["updated_at = NOW()"];
            $params = [':id' => $id];

            if (!empty($name)) {
                $fields[] = "name = :name";
                $params[':name'] = $name;
            }
            if (!empty($nickname)) {
                $fields[] = "nickname = :nickname";
                $params[':nickname'] = $nickname;
            }
            if (!empty($email)) {
                $fields[] = "email = :email";
                $params[':email'] = $email;
            }
            if ($phone !== '') {
                $fields[] = "phone = :phone";
                $params[':phone'] = $phone;
            }
            if ($document !== '') {
                $fields[] = "document = :document";
                $params[':document'] = $document;
            }
            if (!empty($password)) {
                $fields[] = "password = :password";
                $params[':password'] = base64_encode($password);
            }
            if ($roleId !== null && $roleId > 0) {
                $fields[] = "roleId = :roleId";
                $params[':roleId'] = $roleId;
            }

            $sql = "UPDATE user SET " . implode(", ", $fields) . " WHERE idUser = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);

            // Ensure levelAccess record with userTypeId = 4
            try {
                $stmtLA = $pdo->prepare("SELECT idLevelAccess FROM levelAccess WHERE userId = :userId AND userTypeId = 4 LIMIT 1");
                $stmtLA->execute([':userId' => $id]);
                if (!$stmtLA->fetch()) {
                    $stmtInsLA = $pdo->prepare("INSERT INTO levelAccess (userId, userTypeId) VALUES (:userId, 4)");
                    $stmtInsLA->execute([':userId' => $id]);
                }
            } catch (\Throwable $t) {
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Usuário atualizado com sucesso',
                'data' => true,
                'response' => true,
                'errors' => null
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionDelete()
    {
        try {
            $id = (int)($_GET['id'] ?? 0);
            if ($id <= 0) {
                throw new Exception("ID do usuário inválido");
            }

            $pdo = Connection::getConnection(Connection::DB_MYSQL_RW);
            $stmt = $pdo->prepare("UPDATE user SET statusId = 2, blocked = 1, updated_at = NOW() WHERE idUser = :id");
            $stmt->execute([':id' => $id]);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Usuário excluído com sucesso',
                'data' => true,
                'response' => true,
                'errors' => null
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
