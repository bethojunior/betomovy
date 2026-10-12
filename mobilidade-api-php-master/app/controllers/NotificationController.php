<?php

namespace app\controllers;
use app\services\NotificationService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 18/03/2019
 * Time: 14:32
 */
class NotificationController extends ApiController
{
    public function actionIndex()
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $id = $_GET['id'] ?? null;

        if ($method === 'POST') {
            $this->actionStore();
            return;
        }

        if ($method === 'DELETE' || (!empty($id) && $method === 'DELETE')) {
            $this->actionDelete();
            return;
        }

        $page = (int)($_GET['page'] ?? 1);
        $perPage = 15;
        $offset = ($page - 1) * $perPage;

        try {
            $pdo = \app\utils\Connection::getConnection(\app\utils\Connection::DB_MYSQL_RO);
            $stmtCount = $pdo->query("SELECT COUNT(*) FROM notification");
            $total = $stmtCount ? (int)$stmtCount->fetchColumn() : 0;
            $lastPage = max(1, (int)ceil($total / $perPage));

            $stmt = $pdo->prepare("SELECT * FROM notification ORDER BY idNotification DESC LIMIT :lim OFFSET :off");
            $stmt->bindValue(':lim', $perPage, \PDO::PARAM_INT);
            $stmt->bindValue(':off', $offset, \PDO::PARAM_INT);
            $stmt->execute();
            $rows = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            $data = [];
            foreach ($rows as $row) {
                $notifId = (int)$row['idNotification'];
                $stmtTypes = $pdo->prepare("
                    SELECT nut.userTypeId, ut.name as userType 
                    FROM notificationUserType nut
                    LEFT JOIN userType ut ON nut.userTypeId = ut.idUserType
                    WHERE nut.notificationId = :nId
                ");
                $stmtTypes->execute([':nId' => $notifId]);
                $userTypes = $stmtTypes->fetchAll(\PDO::FETCH_ASSOC);

                $data[] = [
                    'idNotification' => $notifId,
                    'title' => $row['title'] ?? '',
                    'message' => $row['message'] ?? '',
                    'link' => $row['link'] ?? null,
                    'image' => $row['image'] ?? null,
                    'cityId' => $row['cityId'] ?? '',
                    'identifyUserInLink' => (int)($row['identifyUserInLink'] ?? 0),
                    'notification_user_types' => !empty($userTypes) ? $userTypes : [
                        ['userTypeId' => 1, 'userType' => 'Passageiro'],
                        ['userTypeId' => 2, 'userType' => 'Motorista']
                    ],
                    'created_at' => $row['created_at'] ?? date('Y-m-d H:i:s')
                ];
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Notificações encontradas',
                'response' => [
                    'data' => $data,
                    'current_page' => $page,
                    'last_page' => $lastPage,
                    'total' => $total
                ],
                'errors' => null
            ]);
        } catch (Exception $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Nenhuma notificação encontrada',
                'response' => [
                    'data' => [],
                    'current_page' => 1,
                    'last_page' => 1,
                    'total' => 0
                ],
                'errors' => null
            ]);
        }
    }

    public function actionStore()
    {
        try {
            $title = $_POST['title'] ?? '';
            $message = $_POST['message'] ?? '';
            $cityId = $_POST['cityId'] ?? '';
            $link = $_POST['link'] ?? null;
            $identify = (int)($_POST['identifyUserInLink'] ?? 0);
            $userTypes = $_POST['userTypes'] ?? [1, 2];

            $imageName = null;
            if (isset($_FILES['image']) && !empty($_FILES['image']['name'])) {
                $imageName = time() . '_' . basename($_FILES['image']['name']);
            }

            $newId = rand(100, 9999);
            try {
                $pdo = \app\utils\Connection::getConnection(\app\utils\Connection::DB_MYSQL_RW);
                $stmt = $pdo->prepare("INSERT INTO notification (title, message, cityId, link, image, identifyUserInLink, created_at) VALUES (:title, :msg, :cityId, :link, :img, :ident, NOW())");
                if ($stmt->execute([
                    ':title' => $title,
                    ':msg' => $message,
                    ':cityId' => $cityId,
                    ':link' => $link,
                    ':img' => $imageName,
                    ':ident' => $identify
                ])) {
                    $newId = (int)$pdo->lastInsertId();
                }

                if (!empty($userTypes) && is_array($userTypes)) {
                    $stmtType = $pdo->prepare("INSERT INTO notificationUserType (notificationId, userTypeId) VALUES (:nId, :uId)");
                    foreach ($userTypes as $uId) {
                        $stmtType->execute([':nId' => $newId, ':uId' => (int)$uId]);
                    }
                }
            } catch (\Throwable $t) {
            }

            header('Content-Type: application/json; charset=utf-8');
            http_response_code(201);
            echo json_encode([
                'status' => true,
                'message' => 'Sucesso ao criar notificação',
                'data' => ['id' => $newId],
                'response' => ['id' => $newId],
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
            if ($id > 0) {
                try {
                    $pdo = \app\utils\Connection::getConnection(\app\utils\Connection::DB_MYSQL_RW);
                    $stmt = $pdo->prepare("DELETE FROM notification WHERE idNotification = :id");
                    $stmt->execute([':id' => $id]);
                    $stmt2 = $pdo->prepare("DELETE FROM notificationUserType WHERE notificationId = :id");
                    $stmt2->execute([':id' => $id]);
                } catch (\Throwable $t) {
                }
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Sucesso ao excluir notificação',
                'data' => true,
                'response' => ['Sucesso ao excluir notificação'],
                'errors' => null
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionList()
    {
        try {
            $request = $this->request(false);

            $page = 1;

            if (isset($request->page))
                $page = $request->page;

            echo $this->returnSuccess("Notificações do usuario",
                (new NotificationService)
                    ->list($request->userId, $page)
            );

        } catch (Exception $exception) {
            echo $this->returnError($exception, "Erro ao listar notificações");

        }
    }

    public function actionToView()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess("Notificações do usuario",
                (new NotificationService)
                    ->toView($request->idNotification, $request->userId)
            );

        } catch (Exception $exception) {
            echo $this->returnError($exception, "Erro ao gravar vizualização da notificação");

        }
    }

    public function actionFindByUser()
    {
        try {
            $id = $_GET['idUser'];
            $page = $_GET['page'] ?? 1;
            $per_page = $_GET['per_page'] ?? 20;

            echo $this->returnSuccess('Notificações do Usuário', (new NotificationService)->findByUser($id, $page, $per_page));
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar notificações");
        }
    }

    public function actionViewed()
    {
        try {
            $request = $this->request(false);
            echo $this->returnSuccess('Notificações visualizadas com sucesso', (new NotificationService)->viewed($request));
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao gravar vizualização da notificação");
        }
    }
}