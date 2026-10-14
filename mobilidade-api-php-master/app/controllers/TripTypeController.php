<?php

namespace app\controllers;

use app\services\TripTypeService;
use Exception;
use PDO;

class TripTypeController extends ApiController
{
    public function actionIndex()
    {
        $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        $id = $_GET['id'] ?? null;

        if ($method === 'POST') {
            if ($id) {
                return $this->actionUpdate($id);
            }
            return $this->actionStore();
        }

        try {
            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);

            $stmt = $pdo->query("
                SELECT 
                    tt.idTripType,
                    tt.idTripType as id,
                    tt.type,
                    COALESCE(tt.name, tt.type) as name,
                    tt.description,
                    tt.picture,
                    tt.statusId,
                    COALESCE(tt.serviceOption, 0) as serviceOption,
                    tt.gender_id,
                    COALESCE(g.name, 'todos') as gender_name
                FROM tripType tt
                LEFT JOIN gender g ON tt.gender_id = g.id
                WHERE tt.statusId = 1
                ORDER BY tt.idTripType ASC
            ");
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $storage = 'https://minio.704app.com.br/rota101fb704/';
            try {
                $storageVal = \app\model\Config::get('link_storage_pictures');
                if (!empty($storageVal)) {
                    $storage = $storageVal;
                }
            } catch (\Throwable $t) {}
            $storage = rtrim($storage, '/') . '/';

            $list = array_map(function ($row) use ($storage) {
                $rawPic = $row['picture'] ?? '';
                if ($rawPic && strpos($rawPic, 'http') !== 0) {
                    $row['picture'] = $storage . 'tripType/' . ltrim($rawPic, '/');
                }
                $row['gender'] = [
                    'id' => (int)($row['gender_id'] ?? 1),
                    'name' => $row['gender_name'] ?? 'todos'
                ];
                return $row;
            }, $rows);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Tipos de viagem encontrados',
                'data' => $list,
                'response' => $list,
                'errors' => null
            ]);
        } catch (\Throwable $e) {
            $this->actionActives();
        }
    }

    public function actionUpdate($id = null)
    {
        try {
            $id = $id ?: ($_GET['id'] ?? null);
            if (!$id) {
                echo $this->returnError(null, "ID não informado", 400);
                return;
            }

            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
            $type = $_POST['type'] ?? null;
            $description = $_POST['description'] ?? null;
            $genderId = isset($_POST['gender_id']) ? (int)$_POST['gender_id'] : null;

            $pictureFilename = null;
            if (!empty($_FILES['picture']['tmp_name'])) {
                $ext = pathinfo($_FILES['picture']['name'], PATHINFO_EXTENSION) ?: 'png';
                $pictureFilename = bin2hex(random_bytes(16)) . '.' . $ext;
                $targetDir = __DIR__ . '/../../public/webfiles/uploads/tripType/';
                if (!is_dir($targetDir)) {
                    @mkdir($targetDir, 0777, true);
                }
                @move_uploaded_file($_FILES['picture']['tmp_name'], $targetDir . $pictureFilename);
            }

            $fields = [];
            $params = [':id' => $id];

            if ($type !== null) {
                $fields[] = 'type = :type';
                $params[':type'] = trim($type);
            }
            if ($description !== null) {
                $fields[] = 'description = :description';
                $params[':description'] = trim($description);
            }
            if ($genderId !== null) {
                $fields[] = 'gender_id = :genderId';
                $params[':genderId'] = $genderId;
            }
            if ($pictureFilename !== null) {
                $fields[] = 'picture = :picture';
                $params[':picture'] = $pictureFilename;
            }

            if (!empty($fields)) {
                $sql = "UPDATE tripType SET " . implode(', ', $fields) . " WHERE idTripType = :id";
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
            }

            echo $this->returnSuccess("Tipo de chamado editado com sucesso!", ['id' => $id]);
        } catch (\Throwable $e) {
            echo $this->returnError($e, "Erro ao editar tipo de chamado");
        }
    }

    public function actionStore()
    {
        try {
            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
            $type = trim($_POST['type'] ?? '');
            $description = trim($_POST['description'] ?? '');
            $genderId = (int)($_POST['gender_id'] ?? 1);

            $pictureFilename = 'carro_eco.png';
            if (!empty($_FILES['picture']['tmp_name'])) {
                $ext = pathinfo($_FILES['picture']['name'], PATHINFO_EXTENSION) ?: 'png';
                $pictureFilename = bin2hex(random_bytes(16)) . '.' . $ext;
                $targetDir = __DIR__ . '/../../public/webfiles/uploads/tripType/';
                if (!is_dir($targetDir)) {
                    @mkdir($targetDir, 0777, true);
                }
                @move_uploaded_file($_FILES['picture']['tmp_name'], $targetDir . $pictureFilename);
            }

            $stmt = $pdo->prepare("
                INSERT INTO tripType (type, description, picture, gender_id, showType, statusId)
                VALUES (:type, :description, :picture, :gender_id, 1, 1)
            ");
            $stmt->execute([
                ':type' => $type,
                ':description' => $description,
                ':picture' => $pictureFilename,
                ':gender_id' => $genderId,
            ]);

            echo $this->returnSuccess("Tipo de chamado criado com sucesso!", ['id' => $pdo->lastInsertId()]);
        } catch (\Throwable $e) {
            echo $this->returnError($e, "Erro ao criar tipo de chamado");
        }
    }

    public function actionActives()
    {
        try {
            echo $this->returnSuccess("Tipos de viagens encontradas",
                (new TripTypeService)
                    ->findActives()
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar tipos de viagens");
        }
    }

    public function actionFindByLocale()
    {
        try {
            $result = (new TripTypeService)
                ->findByLocale($this->requestQuery());

            echo $this->returnSuccess("Sucesso", $result);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}