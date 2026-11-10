<?php

namespace app\controllers;

use app\services\DocUserService;
use app\utils\Headers;
use app\utils\Connection;
use Exception;
use PDO;

class DocUserController extends ApiController
{
    /**
     * Default REST action for /docUser and /docUser/{id}
     */
    public function actionIndex()
    {
        try {
            $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
            $id = isset($_GET['id']) && is_numeric($_GET['id']) ? (int)$_GET['id'] : null;
            $pdo = Connection::open(Connection::DB_MYSQL_RW);

            if ($method === 'PUT' || ($method === 'POST' && $id !== null && empty($_FILES))) {
                // Atualizar status do documento (docUser)
                if (!$id) {
                    throw new Exception("ID do documento não informado");
                }

                $rawInput = file_get_contents('php://input');
                $body = json_decode($rawInput, true);
                if (!is_array($body)) {
                    $body = $_POST;
                }

                $docStatusId = isset($body['docStatusId']) ? (int)$body['docStatusId'] : null;
                if ($docStatusId === null) {
                    throw new Exception("docStatusId não informado");
                }

                $stmt = $pdo->prepare("
                    UPDATE docUser 
                    SET docStatusId = :docStatusId, updated_at = NOW() 
                    WHERE id = :id
                ");
                $stmt->execute([
                    ':docStatusId' => $docStatusId,
                    ':id' => $id
                ]);

                // Busca o registro atualizado para retorno
                $stmtGet = $pdo->prepare("
                    SELECT 
                        du.id, du.docId, du.userId, du.text, du.image, du.pdf, du.docStatusId,
                        ds.name as docStatus, d.label, d.description
                    FROM docUser du
                    LEFT JOIN doc d ON du.docId = d.id
                    LEFT JOIN docStatus ds ON du.docStatusId = ds.id
                    WHERE du.id = :id
                    LIMIT 1
                ");
                $stmtGet->execute([':id' => $id]);
                $updatedDoc = $stmtGet->fetch(PDO::FETCH_ASSOC);

                echo $this->returnSuccess("Status do documento alterado com sucesso", $updatedDoc);
                return;
            }

            if ($method === 'POST') {
                // Solicitar novo documento para usuário / motorista
                $rawInput = file_get_contents('php://input');
                $body = json_decode($rawInput, true);
                if (!is_array($body)) {
                    $body = $_POST;
                }

                $docId = isset($body['docId']) ? (int)$body['docId'] : null;
                $docStatusId = isset($body['docStatusId']) ? (int)$body['docStatusId'] : 2;
                $userId = isset($body['userId']) ? (int)$body['userId'] : null;

                if (!$docId || !$userId) {
                    throw new Exception("Documento (docId) e Usuário (userId) são obrigatórios");
                }

                // Verifica se já existe esse documento para esse usuário
                $stmtCheck = $pdo->prepare("
                    SELECT id FROM docUser 
                    WHERE userId = :userId AND docId = :docId AND statusId = 1 AND deleted_at IS NULL
                    LIMIT 1
                ");
                $stmtCheck->execute([':userId' => $userId, ':docId' => $docId]);
                $existing = $stmtCheck->fetch(PDO::FETCH_ASSOC);

                if ($existing) {
                    $stmtUp = $pdo->prepare("
                        UPDATE docUser 
                        SET docStatusId = :docStatusId, updated_at = NOW() 
                        WHERE id = :id
                    ");
                    $stmtUp->execute([
                        ':docStatusId' => $docStatusId,
                        ':id' => $existing['id']
                    ]);
                    $targetId = (int)$existing['id'];
                } else {
                    $stmtIns = $pdo->prepare("
                        INSERT INTO docUser (docId, userId, docStatusId, statusId, created_at, updated_at)
                        VALUES (:docId, :userId, :docStatusId, 1, NOW(), NOW())
                    ");
                    $stmtIns->execute([
                        ':docId' => $docId,
                        ':userId' => $userId,
                        ':docStatusId' => $docStatusId
                    ]);
                    $targetId = (int)$pdo->lastInsertId();
                }

                echo $this->returnSuccess("Documento solicitado com sucesso", ['id' => $targetId, 'docId' => $docId, 'userId' => $userId]);
                return;
            }

            if ($method === 'GET') {
                if ($id) {
                    $stmtGet = $pdo->prepare("
                        SELECT 
                            du.id, du.docId, du.userId, du.text, du.image, du.pdf, du.docStatusId,
                            ds.name as docStatus, d.label, d.description
                        FROM docUser du
                        LEFT JOIN doc d ON du.docId = d.id
                        LEFT JOIN docStatus ds ON du.docStatusId = ds.id
                        WHERE du.id = :id
                        LIMIT 1
                    ");
                    $stmtGet->execute([':id' => $id]);
                    $doc = $stmtGet->fetch(PDO::FETCH_ASSOC);
                    echo $this->returnSuccess("Documento encontrado", $doc);
                    return;
                }

                $userId = isset($_GET['userId']) ? (int)$_GET['userId'] : Headers::getUserId();
                $result = (new DocUserService)->find($userId);
                echo $this->returnSuccess("Documentos encontrados", $result);
                return;
            }

            echo $this->returnSuccess("OK");
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    /**
     * POST /docUser/{id}/image
     */
    public function actionImage()
    {
        try {
            $id = isset($_GET['id']) && is_numeric($_GET['id']) ? (int)$_GET['id'] : null;
            if (!$id) {
                throw new Exception("ID do documento não informado");
            }

            if (empty($_FILES['image']) && empty($_FILES['file'])) {
                throw new Exception("Arquivo de imagem não enviado");
            }

            $file = $_FILES['image'] ?? $_FILES['file'];
            if ($file['error'] !== UPLOAD_ERR_OK) {
                throw new Exception("Erro no upload do arquivo (código {$file['error']})");
            }

            $pdo = Connection::open(Connection::DB_MYSQL_RW);

            // Buscar dados atuais do docUser
            $stmt = $pdo->prepare("SELECT id, userId, docId FROM docUser WHERE id = :id LIMIT 1");
            $stmt->execute([':id' => $id]);
            $doc = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$doc) {
                throw new Exception("Documento não encontrado");
            }

            // Gerar nome único de arquivo
            $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
            if (empty($ext)) $ext = 'jpg';
            $filename = time() . '_' . uniqid() . '.' . $ext;

            // Diretório local de uploads como fallback
            $uploadDir = realpath(__DIR__ . '/../../public/uploads') ?: (__DIR__ . '/../../public/uploads');
            $userDocsDir = $uploadDir . '/user/' . $doc['userId'] . '/docs';
            if (!is_dir($userDocsDir)) {
                @mkdir($userDocsDir, 0777, true);
            }
            $targetPath = $userDocsDir . '/' . $filename;
            move_uploaded_file($file['tmp_name'], $targetPath);

            // Atualiza no banco
            $stmtUp = $pdo->prepare("UPDATE docUser SET image = :image, updated_at = NOW() WHERE id = :id");
            $stmtUp->execute([
                ':image' => $filename,
                ':id' => $id
            ]);

            $storageUrl = rtrim((string)(\app\model\Config::get('link_storage_pictures') ?: 'https://api.movymob.com/'), '/') . '/';
            $imageUrl = $storageUrl . 'user/' . $doc['userId'] . '/docs/' . $filename;

            echo $this->returnSuccess("Imagem do documento enviada com sucesso", [
                'id' => $id,
                'image' => $imageUrl,
                'filename' => $filename
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionFind()
    {
        try {
            $result = (new DocUserService)
                ->find(Headers::getUserId());

            echo $this->returnSuccess("Documentos encontrados", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar documentos do usuário");
        }
    }

    public function actionSend()
    {
        try {
            $result = (new DocUserService)
                ->send(Headers::getUserId(), $_POST, $_FILES);

            echo $this->returnSuccess("Documento enviado", $result);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
