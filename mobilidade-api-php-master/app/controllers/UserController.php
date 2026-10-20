<?php

namespace app\controllers;

use app\dao\UserDao;
use app\dao\UserTypeDao;
use app\services\UserDuplicateCheckService;
use app\services\UserService;
use app\utils\Headers;
use app\utils\Connection;
use PDO;
use Exception;
use app\model\User;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 13/07/2018
 * Time: 15:52
 */
class UserController extends ApiController
{
    protected $userDao;

    public function __construct()
    {
        $this->userDao = new UserDao;
    }

    public function actionAuthenticate()
    {
        $user = new User($this->request());

        try {
            echo $this->returnSuccess("Sucesso", $this->userDao->authenticate($user));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionLogin()
    {
        $this->actionAuthenticate();
    }

    public function actionRegister()
    {
        try {
            if (!empty($_POST)) {
                $data = (object)$_POST;
            } else {
                $raw = file_get_contents('php://input');
                $json = json_decode($raw);
                if (isset($json->stdObject)) {
                    $data = is_array($json->stdObject) ? $json->stdObject[0] : $json->stdObject;
                } else {
                    $data = $json ?: (object)[];
                }
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

            $user = (new \app\dao\CustomerDao)->register($data, $_FILES ?? null);

            echo $this->returnSuccess("Cadastrado com sucesso", [
                'user' => $user ? (is_object($user) && method_exists($user, 'toStdClass') ? $user->toStdClass() : $user) : true
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionCheckAccountAppPartner()
    {
        try {
            $email = $this->request()->email;

            echo $this->returnSuccess("Sucesso", $this->userDao->checkAccountAppPartner($email));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionCheckEmail()
    {
        try {
            echo $this->returnSuccess("Email existe", $this->userDao->checkEmail($this->request()->email));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionCheckPhone()
    {
        try {
            $request = $this->request() ?? (object) $this->requestQuery();
            $userTypeIds = (new UserDuplicateCheckService)->resolveUserTypeIdsFromRequest($request);
            $phone = $request->phone ?? null;

            echo $this->returnSuccess(
                "Telefone já cadastrado",
                $this->userDao->checkPhone($phone, $userTypeIds)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionCheckDocument()
    {
        try {
            $request = $this->request() ?? (object) $this->requestQuery();
            $userTypeIds = (new UserDuplicateCheckService)->resolveUserTypeIdsFromRequest($request);
            $document = $request->document ?? null;

            echo $this->returnSuccess(
                "Documento existe",
                $this->userDao->checkDocument($document, $userTypeIds)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionUpdateCustomerDocs()
    {
        try {
            $photos = $_FILES;
            $request = $_POST;

            $result = (new UserService)
                ->updateCustomerDocs(Headers::getUserId(), $photos, $request);

            echo $this->returnSuccess("Sucesso", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao reenviar os documentos");
        }
    }

    public function actionUpdateCustomerPhotosRG()
    {
        try {
            $photos = $_FILES;
            $result = (new UserService)
                ->updateCustomerPhotosRG(Headers::getUserId(), $photos);

            echo $this->returnSuccess("Sucesso", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao reenviar os documentos");
        }
    }

    public function actionGetUserTypes()
    {
        try {
            echo $this->returnSuccess("Tipos de Usuários",
                (new UserTypeDao)->getAll()
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionChangeProfile()
    {
        try {
            $userId = $_POST['userId'];
            $photo = $_FILES['photo'];
            $result = (new UserService)
                ->changeProfile($userId, $photo);

            echo $this->returnSuccess("Sucesso", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao reenviar os documentos");
        }
    }

    public function actionRemoveAccountRequest()
    {
        try {
            $request = $this->request(false);
            $userId = Headers::getUserId();

            $result = (new UserService)
                ->removeAccountRequest($userId, $request);

            echo $this->returnSuccess("Sucesso", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao remover dados da conta");
        }
    }

    public function actionRemoveAccountsRequest()
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL);
            $type = isset($_GET['type']) ? strtoupper(trim($_GET['type'])) : 'CUSTOMER';
            if (!in_array($type, ['CUSTOMER', 'DRIVER'])) {
                $type = 'CUSTOMER';
            }

            $page = max(1, (int)($_GET['page'] ?? 1));
            $perPage = 10;
            $offset = ($page - 1) * $perPage;

            // Total count
            $stmtCount = $pdo->prepare("SELECT COUNT(*) FROM removeAccountRequest WHERE type = :type AND deleted_at IS NULL");
            $stmtCount->execute([':type' => $type]);
            $total = (int)$stmtCount->fetchColumn();

            $sql = "
                SELECT 
                    rar.id,
                    rar.userId,
                    rar.userIdWhoDeleted,
                    rar.cityId,
                    COALESCE(c.nome, '') AS cityName,
                    rar.type,
                    rar.reason,
                    rar.details,
                    rar.ip,
                    rar.platform,
                    DATE_FORMAT(rar.created_at, '%Y-%m-%dT%H:%i:%s') AS created_at,
                    COALESCE(u.name, 'Usuário') AS userName,
                    COALESCE(u.phone, '') AS userPhone
                FROM removeAccountRequest rar
                LEFT JOIN user u ON u.idUser = rar.userId
                LEFT JOIN city c ON c.id = rar.cityId
                WHERE rar.type = :type AND rar.deleted_at IS NULL
                ORDER BY rar.id DESC
                LIMIT :limit OFFSET :offset
            ";
            $stmt = $pdo->prepare($sql);
            $stmt->bindValue(':type', $type, PDO::PARAM_STR);
            $stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Format items
            $data = [];
            foreach ($rows as $row) {
                $data[] = [
                    'id' => (int)$row['id'],
                    'userId' => (int)$row['userId'],
                    'userIdWhoDeleted' => $row['userIdWhoDeleted'] ? (int)$row['userIdWhoDeleted'] : null,
                    'cityId' => $row['cityId'] ? (int)$row['cityId'] : 0,
                    'cityName' => $row['cityName'] ?: 'Não informada',
                    'type' => $row['type'],
                    'reason' => trim($row['reason'] ?? '') ?: 'Exclusão solicitada pelo usuário',
                    'details' => trim($row['details'] ?? '') ?: '-',
                    'ip' => $row['ip'] ?? '',
                    'platform' => strtolower(trim($row['platform'] ?? '')) ?: 'android',
                    'created_at' => $row['created_at'] ?: date('Y-m-d\TH:i:s'),
                    'userName' => trim($row['userName'] ?? '') ?: 'Usuário',
                    'userPhone' => trim($row['userPhone'] ?? ''),
                ];
            }

            $lastPage = max(1, (int)ceil($total / $perPage));
            $paginationMeta = [
                'current_page' => $page,
                'data' => $data,
                'first_page_url' => "/user/removeAccountsRequest?page=1",
                'from' => $total > 0 ? ($offset + 1) : 0,
                'last_page' => $lastPage,
                'last_page_url' => "/user/removeAccountsRequest?page={$lastPage}",
                'next_page_url' => ($page < $lastPage) ? "/user/removeAccountsRequest?page=" . ($page + 1) : null,
                'path' => "/user/removeAccountsRequest",
                'per_page' => (string)$perPage,
                'prev_page_url' => ($page > 1) ? "/user/removeAccountsRequest?page=" . ($page - 1) : null,
                'to' => min($offset + $perPage, $total),
                'total' => $total,
            ];

            echo $this->returnSuccess("Sucesso", $paginationMeta);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao listar solicitações de exclusão");
        }
    }

    public function actionRemoveAccountUser()
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL);
            $userId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
            if (!$userId) {
                $raw = file_get_contents('php://input');
                $json = json_decode($raw, true);
                $userId = (int)($json['id'] ?? $json['userId'] ?? 0);
            }

            if ($userId <= 0) {
                throw new Exception("ID do usuário inválido");
            }

            // Desativar usuário (statusId = 2)
            $stmtUser = $pdo->prepare("UPDATE user SET statusId = 2, updated_at = NOW() WHERE idUser = :userId");
            $stmtUser->execute([':userId' => $userId]);

            // Desativar também em driver se for motorista
            $stmtDriver = $pdo->prepare("UPDATE driver SET statusId = 2 WHERE userId = :userId");
            $stmtDriver->execute([':userId' => $userId]);

            // Finalizar solicitação de exclusão
            $adminId = 1;
            try {
                $adminId = Headers::getUserId() ?: 1;
            } catch (\Throwable $t) {}

            $stmtReq = $pdo->prepare("UPDATE removeAccountRequest SET deleted_at = NOW(), userIdWhoDeleted = :adminId, updated_at = NOW() WHERE userId = :userId AND deleted_at IS NULL");
            $stmtReq->execute([
                ':adminId' => $adminId,
                ':userId' => $userId,
            ]);

            echo $this->returnSuccess("Usuário excluído com sucesso", true);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao excluir usuário");
        }
    }

    public function actionCancelRemoveAccountUser()
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL);
            $userId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
            if (!$userId) {
                $raw = file_get_contents('php://input');
                $json = json_decode($raw, true);
                $userId = (int)($json['id'] ?? $json['userId'] ?? 0);
            }

            if ($userId <= 0) {
                throw new Exception("ID do usuário inválido");
            }

            // Apenas cancela a solicitação (marca deleted_at para não aparecer mais como pendente, sem desativar a conta)
            $stmtReq = $pdo->prepare("UPDATE removeAccountRequest SET deleted_at = NOW(), updated_at = NOW() WHERE userId = :userId AND deleted_at IS NULL");
            $stmtReq->execute([':userId' => $userId]);

            echo $this->returnSuccess("Solicitação cancelada com sucesso", true);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao cancelar solicitação de exclusão");
        }
    }

    public function actionCentral()
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL);
            $userId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
            if (!$userId) {
                $raw = file_get_contents('php://input');
                $json = json_decode($raw, true);
                $userId = (int)($json['id'] ?? $json['userId'] ?? 0);
            }

            if ($userId <= 0) {
                throw new Exception("ID do usuário inválido");
            }

            // Desvincular usuário da central (statusId = 2)
            $stmt = $pdo->prepare("UPDATE centralUser SET statusId = 2, updated_at = NOW() WHERE userId = :userId");
            $stmt->execute([':userId' => $userId]);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Usuário desvinculado da central com sucesso',
                'response' => true
            ]);
        } catch (Exception $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao desvincular usuário da central: ' . $e->getMessage(),
                'response' => false
            ]);
        }
    }
}