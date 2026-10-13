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
            $pdo = Connection::open(Connection::DB_MYSQL);

            // Ensure role table exists
            try {
                $pdo->exec("
                    CREATE TABLE IF NOT EXISTS role (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(255) NOT NULL,
                        support TINYINT(1) DEFAULT 0,
                        isRoot TINYINT(1) DEFAULT 0,
                        statusId INT DEFAULT 1,
                        active TINYINT(1) DEFAULT 1,
                        created_at DATETIME NULL,
                        updated_at DATETIME NULL
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                ");
                $pdo->exec("
                    INSERT IGNORE INTO role (id, name, support, isRoot, statusId, active) VALUES 
                    (1, 'Super Administrador', 0, 1, 1, 1),
                    (2, 'Administrador', 0, 0, 1, 1),
                    (3, 'Suporte / Atendimento', 1, 0, 1, 1),
                    (4, 'Operador Financeiro', 0, 0, 1, 1);
                ");
            } catch (\Throwable $t) {
            }

            // Ensure levelAccess table exists
            try {
                $pdo->exec("
                    CREATE TABLE IF NOT EXISTS levelAccess (
                        idLevelAccess INT AUTO_INCREMENT PRIMARY KEY,
                        userId INT NOT NULL,
                        userTypeId INT NOT NULL,
                        created_at DATETIME NULL,
                        INDEX(userId),
                        INDEX(userTypeId)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                ");
            } catch (\Throwable $t) {
            }

            // Ensure roleId column exists on user table
            try {
                $pdo->exec("ALTER TABLE user ADD COLUMN roleId INT NULL DEFAULT 1");
            } catch (\Throwable $t) {
            }
            try {
                $pdo->exec("ALTER TABLE user ADD COLUMN blocked TINYINT(1) DEFAULT 0");
            } catch (\Throwable $t) {
            }

            $users = [];
            try {
                $sql = "
                    SELECT DISTINCT
                        u.idUser,
                        u.email,
                        u.name,
                        COALESCE(u.nickname, u.name) as nickname,
                        COALESCE(u.phone, '') as phone,
                        COALESCE(u.document, '') as document,
                        COALESCE(u.blocked, 0) as blocked,
                        COALESCE(u.statusId, 1) as statusId,
                        COALESCE(u.roleId, 1) as roleId,
                        COALESCE(r.isRoot, 0) as isRoot,
                        COALESCE(r.name, 'Administrador') as roleName
                    FROM user u
                    LEFT JOIN role r ON u.roleId = r.id
                    LEFT JOIN levelAccess la ON u.idUser = la.userId
                    WHERE (u.email IS NOT NULL AND u.email != '')
                      AND (la.userTypeId = 4 OR (u.roleId IS NOT NULL AND u.roleId > 0) OR u.idUser IN (SELECT userId FROM centralUser))
                      AND (u.statusId != 2 OR u.statusId IS NULL)
                    ORDER BY u.idUser DESC
                ";
                $stmt = $pdo->query($sql);
                $users = $stmt ? $stmt->fetchAll(PDO::FETCH_ASSOC) : [];
            } catch (\Throwable $t) {
                // Resilient fallback query without joining role
                try {
                    $sqlFallback = "
                        SELECT 
                            u.idUser,
                            u.email,
                            u.name,
                            COALESCE(u.nickname, u.name) as nickname,
                            COALESCE(u.phone, '') as phone,
                            COALESCE(u.document, '') as document,
                            COALESCE(u.blocked, 0) as blocked,
                            COALESCE(u.statusId, 1) as statusId,
                            COALESCE(u.roleId, 1) as roleId,
                            IF(COALESCE(u.roleId, 1) = 1, 1, 0) as isRoot,
                            'Administrador' as roleName
                        FROM user u
                        WHERE (u.statusId != 2 OR u.statusId IS NULL)
                          AND (u.email IS NOT NULL AND u.email != '')
                          AND (u.roleId IS NOT NULL OR u.idUser IN (SELECT userId FROM centralUser))
                        ORDER BY u.idUser DESC
                        LIMIT 100
                    ";
                    $stmt = $pdo->query($sqlFallback);
                    $users = $stmt ? $stmt->fetchAll(PDO::FETCH_ASSOC) : [];
                } catch (\Throwable $t2) {
                    try {
                        $sqlSimple = "
                            SELECT 
                                u.idUser,
                                u.email,
                                u.name,
                                COALESCE(u.nickname, u.name) as nickname,
                                COALESCE(u.phone, '') as phone,
                                COALESCE(u.document, '') as document,
                                COALESCE(u.blocked, 0) as blocked,
                                COALESCE(u.statusId, 1) as statusId,
                                1 as roleId,
                                1 as isRoot,
                                'Administrador' as roleName
                            FROM user u
                            WHERE (u.email IS NOT NULL AND u.email != '')
                              AND (u.statusId != 2 OR u.statusId IS NULL)
                            ORDER BY u.idUser DESC
                            LIMIT 50
                        ";
                        $stmt = $pdo->query($sqlSimple);
                        $users = $stmt ? $stmt->fetchAll(PDO::FETCH_ASSOC) : [];
                    } catch (\Throwable $t3) {
                    }
                }
            }

            // If empty, fetch any users with email
            if (empty($users)) {
                try {
                    $sqlFallback = "
                        SELECT 
                            u.idUser,
                            u.email,
                            u.name,
                            COALESCE(u.nickname, u.name) as nickname,
                            COALESCE(u.phone, '') as phone,
                            COALESCE(u.document, '') as document,
                            COALESCE(u.blocked, 0) as blocked,
                            COALESCE(u.statusId, 1) as statusId,
                            1 as roleId,
                            1 as isRoot,
                            'Administrador' as roleName
                        FROM user u
                        WHERE (u.email IS NOT NULL AND u.email != '')
                          AND (u.statusId != 2 OR u.statusId IS NULL)
                        ORDER BY u.idUser DESC
                        LIMIT 50
                    ";
                    $stmt = $pdo->query($sqlFallback);
                    $users = $stmt ? $stmt->fetchAll(PDO::FETCH_ASSOC) : [];
                } catch (\Throwable $t4) {
                }
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

            $pdo = Connection::open(Connection::DB_MYSQL);
            $user = null;
            try {
                $stmt = $pdo->prepare("
                    SELECT 
                        u.idUser,
                        u.email,
                        u.name,
                        COALESCE(u.nickname, u.name) as nickname,
                        COALESCE(u.phone, '') as phone,
                        COALESCE(u.document, '') as document,
                        COALESCE(u.blocked, 0) as blocked,
                        COALESCE(u.statusId, 1) as statusId,
                        COALESCE(u.roleId, 1) as roleId,
                        COALESCE(r.isRoot, 0) as isRoot,
                        COALESCE(r.name, 'Administrador') as roleName
                    FROM user u
                    LEFT JOIN role r ON u.roleId = r.id
                    WHERE u.idUser = :id
                    LIMIT 1
                ");
                $stmt->execute([':id' => $id]);
                $user = $stmt->fetch(PDO::FETCH_ASSOC);
            } catch (\Throwable $t) {
                try {
                    $stmt = $pdo->prepare("
                        SELECT 
                            u.idUser,
                            u.email,
                            u.name,
                            COALESCE(u.nickname, u.name) as nickname,
                            COALESCE(u.phone, '') as phone,
                            COALESCE(u.document, '') as document,
                            0 as blocked,
                            COALESCE(u.statusId, 1) as statusId,
                            1 as roleId,
                            1 as isRoot,
                            'Administrador' as roleName
                        FROM user u
                        WHERE u.idUser = :id
                        LIMIT 1
                    ");
                    $stmt->execute([':id' => $id]);
                    $user = $stmt->fetch(PDO::FETCH_ASSOC);
                } catch (\Throwable $t2) {
                    $user = null;
                }
            }

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
            if ($roleId <= 0) {
                $roleId = 1;
            }

            if (empty($name) || empty($email) || empty($password)) {
                throw new Exception("Nome, e-mail e senha são obrigatórios.");
            }

            if (empty($nickname)) {
                $parts = explode(' ', $name);
                $nickname = $parts[0];
            }

            $pdo = Connection::open(Connection::DB_MYSQL);

            // Ensure role exists in table BEFORE inserting user to satisfy foreign key constraint
            try {
                $stmtR = $pdo->prepare("SELECT id FROM role WHERE id = :roleId LIMIT 1");
                $stmtR->execute([':roleId' => $roleId]);
                if (!$stmtR->fetch()) {
                    if ($roleId == 2) {
                        $pdo->exec("INSERT INTO role (id, name, statusId, isRoot, support, created_at, updated_at) VALUES (2, 'Administrador', 1, 0, 0, NOW(), NOW())");
                    } elseif ($roleId == 3) {
                        $pdo->exec("INSERT INTO role (id, name, statusId, isRoot, support, created_at, updated_at) VALUES (3, 'Gestor', 1, 0, 0, NOW(), NOW())");
                    } elseif ($roleId == 4) {
                        $pdo->exec("INSERT INTO role (id, name, statusId, isRoot, support, created_at, updated_at) VALUES (4, 'Suporte', 1, 0, 1, NOW(), NOW())");
                    } else {
                        // Fallback: check if role 1 exists
                        $chk1 = $pdo->query("SELECT id FROM role WHERE id = 1 LIMIT 1");
                        if (!$chk1 || !$chk1->fetch()) {
                            $pdo->exec("INSERT INTO role (id, name, statusId, isRoot, support, created_at, updated_at) VALUES (1, 'Super Administrador', 1, 1, 0, NOW(), NOW())");
                        }
                        $roleId = 1;
                    }
                }
            } catch (\Throwable $t) {
                $roleId = 1;
            }

            // Check if roleId column exists in user table
            $hasRoleIdCol = true;
            try {
                $chk = $pdo->query("SHOW COLUMNS FROM user LIKE 'roleId'");
                $hasRoleIdCol = ($chk && $chk->fetch());
            } catch (\Throwable $t) {
                $hasRoleIdCol = false;
            }

            $base64Pass = base64_encode($password);

            // Check if email already exists
            $stmtCheck = $pdo->prepare("SELECT idUser FROM user WHERE LOWER(TRIM(email)) = :email LIMIT 1");
            $stmtCheck->execute([':email' => $email]);
            $existing = $stmtCheck->fetch(PDO::FETCH_ASSOC);

            if ($existing) {
                // If user exists, update password, role and reactivate user
                $userId = (int)$existing['idUser'];
                if ($hasRoleIdCol) {
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
                    $stmtUpd = $pdo->prepare("
                        UPDATE user SET 
                            name = :name,
                            nickname = :nickname,
                            phone = :phone,
                            document = :document,
                            password = :password,
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
                        ':userId' => $userId
                    ]);
                }
            } else {
                $tokenApi = new \app\utils\TokenApi();
                $plainToken = $tokenApi->generate(time());
                // In MySQL strict mode, registered_in enum allows 'mobilidade' or 'delivery'
                if ($hasRoleIdCol) {
                    $stmtIns = $pdo->prepare("
                        INSERT INTO user (
                            name, nickname, email, phone, document, password, 
                            roleId, statusId, blocked, api_token, registered_in, created_at, updated_at
                        ) VALUES (
                            :name, :nickname, :email, :phone, :document, :password, 
                            :roleId, 1, 0, :token, 'mobilidade', NOW(), NOW()
                        )
                    ");
                    $stmtIns->execute([
                        ':name' => $name,
                        ':nickname' => $nickname,
                        ':email' => $email,
                        ':phone' => $phone,
                        ':document' => $document,
                        ':password' => $base64Pass,
                        ':roleId' => $roleId,
                        ':token' => $plainToken
                    ]);
                } else {
                    $stmtIns = $pdo->prepare("
                        INSERT INTO user (
                            name, nickname, email, phone, document, password, 
                            statusId, blocked, api_token, registered_in, created_at, updated_at
                        ) VALUES (
                            :name, :nickname, :email, :phone, :document, :password, 
                            1, 0, :token, 'mobilidade', NOW(), NOW()
                        )
                    ");
                    $stmtIns->execute([
                        ':name' => $name,
                        ':nickname' => $nickname,
                        ':email' => $email,
                        ':phone' => $phone,
                        ':document' => $document,
                        ':password' => $base64Pass,
                        ':token' => $plainToken
                    ]);
                }
                $userId = (int)$pdo->lastInsertId();
            }

            // Ensure levelAccess record with userTypeId = 4 (ADMIN / CENTRAL)
            try {
                $stmtLA = $pdo->prepare("SELECT idLevelAccess FROM levelAccess WHERE userId = :userId AND userTypeId = 4 LIMIT 1");
                $stmtLA->execute([':userId' => $userId]);
                if (!$stmtLA->fetch()) {
                    $stmtInsLA = $pdo->prepare("INSERT INTO levelAccess (userId, userTypeId) VALUES (:userId, 4)");
                    $stmtInsLA->execute([':userId' => $userId]);
                }
            } catch (\Throwable $t) {
            }

            // Ensure user api_token and partner record exist
            $plainToken = null;
            try {
                $tokenApi = new \app\utils\TokenApi();
                $plainToken = $tokenApi->generate($userId);

                $stmtTok = $pdo->prepare("UPDATE user SET api_token = :token, statusId = 1, blocked = 0 WHERE idUser = :userId AND (api_token IS NULL OR api_token = '')");
                $stmtTok->execute([':token' => $plainToken, ':userId' => $userId]);

                $stmtP = $pdo->prepare("SELECT idPartner FROM partner WHERE userId = :userId LIMIT 1");
                $stmtP->execute([':userId' => $userId]);
                $partnerRow = $stmtP->fetch(PDO::FETCH_ASSOC);
                if ($partnerRow) {
                    $pdo->prepare("UPDATE partner SET statusId = 1, partnerRegisterStatusId = 1, api_token = :token WHERE idPartner = :pId")
                        ->execute([':token' => $plainToken, ':pId' => $partnerRow['idPartner']]);
                } else {
                    $stmtInsP = $pdo->prepare("INSERT INTO partner (userId, partnerRegisterStatusId, statusId, api_token, created_at, updated_at) VALUES (:userId, 1, 1, :token, NOW(), NOW())");
                    $stmtInsP->execute([':userId' => $userId, ':token' => $plainToken]);
                }
            } catch (\Throwable $t) {
            }

            // Ensure centralUser link exists so user can access central panel immediately
            try {
                $stmtCU = $pdo->prepare("SELECT id FROM centralUser WHERE userId = :userId LIMIT 1");
                $stmtCU->execute([':userId' => $userId]);
                if (!$stmtCU->fetch()) {
                    $cId = 1;
                    $stmtC = $pdo->query("SELECT id FROM central WHERE statusId = 1 ORDER BY id ASC LIMIT 1");
                    if ($stmtC && ($rowC = $stmtC->fetch(PDO::FETCH_ASSOC))) {
                        $cId = (int)$rowC['id'];
                    }
                    $insCU = $pdo->prepare("INSERT INTO centralUser (centralId, userId, isAdmin, statusId, created_at, updated_at) VALUES (:cId, :uId, 1, 1, NOW(), NOW())");
                    $insCU->execute([':cId' => $cId, ':uId' => $userId]);
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
                $id = (int)($input['idUser'] ?? $input['id'] ?? 0);
            }

            if ($id <= 0) {
                // Try from request uri: /admin/123
                $path = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
                $parts = explode('/', trim($path, '/'));
                $last = end($parts);
                if (is_numeric($last)) {
                    $id = (int)$last;
                }
            }

            if ($id <= 0) {
                throw new Exception("ID do usuário inválido");
            }

            $name = trim($input['name'] ?? '');
            $nickname = trim($input['nickname'] ?? '');
            $email = strtolower(trim($input['email'] ?? ''));
            $phone = isset($input['phone']) ? preg_replace('/\D/', '', $input['phone']) : null;
            $document = isset($input['document']) ? preg_replace('/\D/', '', $input['document']) : null;
            $password = $input['password'] ?? null;
            $roleId = isset($input['roleId']) ? (int)$input['roleId'] : null;

            $pdo = Connection::open(Connection::DB_MYSQL);

            $fields = ["updated_at = NOW()", "statusId = 1", "blocked = 0"];
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
            if ($phone !== null && $phone !== '') {
                $fields[] = "phone = :phone";
                $params[':phone'] = $phone;
            }
            if ($document !== null && $document !== '') {
                $fields[] = "document = :document";
                $params[':document'] = $document;
            }
            if (!empty($password)) {
                $fields[] = "password = :password";
                $params[':password'] = base64_encode($password);
            }

            // Check if roleId column exists
            $hasRoleIdCol = true;
            try {
                $chk = $pdo->query("SHOW COLUMNS FROM user LIKE 'roleId'");
                $hasRoleIdCol = ($chk && $chk->fetch());
            } catch (\Throwable $t) {
                $hasRoleIdCol = false;
            }

            if ($roleId !== null && $roleId > 0 && $hasRoleIdCol) {
                // Ensure role exists
                try {
                    $stmtR = $pdo->prepare("SELECT id FROM role WHERE id = :roleId LIMIT 1");
                    $stmtR->execute([':roleId' => $roleId]);
                    if (!$stmtR->fetch()) {
                        $roleId = 1;
                    }
                } catch (\Throwable $t) {
                    $roleId = 1;
                }
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

            // Ensure centralUser exists
            try {
                $stmtCU = $pdo->prepare("SELECT id FROM centralUser WHERE userId = :userId LIMIT 1");
                $stmtCU->execute([':userId' => $id]);
                if (!$stmtCU->fetch()) {
                    $cId = 1;
                    $stmtC = $pdo->query("SELECT id FROM central WHERE statusId = 1 ORDER BY id ASC LIMIT 1");
                    if ($stmtC && ($rowC = $stmtC->fetch(PDO::FETCH_ASSOC))) {
                        $cId = (int)$rowC['id'];
                    }
                    $insCU = $pdo->prepare("INSERT INTO centralUser (centralId, userId, isAdmin, statusId, created_at, updated_at) VALUES (:cId, :uId, 1, 1, NOW(), NOW())");
                    $insCU->execute([':cId' => $cId, ':uId' => $id]);
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
                $raw = file_get_contents('php://input');
                $input = json_decode($raw, true) ?? $_POST;
                $id = (int)($input['idUser'] ?? $input['id'] ?? 0);
            }

            if ($id <= 0) {
                $path = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
                $parts = explode('/', trim($path, '/'));
                $last = end($parts);
                if (is_numeric($last)) {
                    $id = (int)$last;
                }
            }

            if ($id <= 0) {
                throw new Exception("ID do usuário inválido");
            }

            $pdo = Connection::open(Connection::DB_MYSQL);
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
