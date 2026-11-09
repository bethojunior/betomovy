<?php

namespace app\controllers;

use app\utils\Connection;
use app\utils\Photo;
use app\utils\S3;
use Exception;
use PDO;
use Throwable;

class Config_app_partnersController extends ApiController
{
    public function actionIndex()
    {
        $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        $id = $_GET['id'] ?? null;

        if ($method === 'DELETE' && $id) {
            $this->handleDelete($id);
            return;
        }

        if ($method === 'POST') {
            if ($id) {
                $this->handleUpdate($id);
            } else {
                $this->handleCreate();
            }
            return;
        }

        if ($method === 'PUT' && $id) {
            $this->handleUpdate($id);
            return;
        }

        if ($id) {
            $this->handleGetOne($id);
            return;
        }

        $this->actionFind();
    }

    public function actionFind()
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL_RO);
            $stmt = $pdo->query("SELECT id, name_app, `key`, logo_app, primary_color, secondary_color, text_color, phone_support, statusId FROM config_apps_partners WHERE (statusId = 1 OR statusId IS NULL) ORDER BY name_app ASC");
            $partners = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($partners as &$p) {
                $p['id'] = (int)$p['id'];
                $p['logo_app'] = $this->formatLogoUrl($p['logo_app'] ?? '');
            }
            unset($p);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Parceiros encontrados',
                'response' => $partners,
                'data' => $partners,
                'errors' => null
            ]);
        } catch (Throwable $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Nenhum parceiro',
                'response' => [],
                'data' => [],
                'errors' => null
            ]);
        }
    }

    public function actionFindAll()
    {
        $this->actionFind_all();
    }

    public function actionFind_all()
    {
        try {
            $page = max(1, (int)($_GET['page'] ?? 1));
            $limit = 10;
            $offset = ($page - 1) * $limit;

            $pdo = Connection::open(Connection::DB_MYSQL_RO);

            $countStmt = $pdo->query("SELECT COUNT(*) FROM config_apps_partners WHERE (statusId = 1 OR statusId IS NULL)");
            $total = (int)$countStmt->fetchColumn();
            $lastPage = max(1, ceil($total / $limit));

            $stmt = $pdo->prepare("SELECT id, name_app, `key`, logo_app, primary_color, secondary_color, text_color, phone_support, statusId, created_at, updated_at FROM config_apps_partners WHERE (statusId = 1 OR statusId IS NULL) ORDER BY id DESC LIMIT :limit OFFSET :offset");
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            $partners = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($partners as &$p) {
                $p['id'] = (int)$p['id'];
                $p['logo_app'] = $this->formatLogoUrl($p['logo_app'] ?? '');
            }
            unset($p);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Configurações de aplicativos parceiros listadas',
                'response' => [
                    'current_page' => $page,
                    'last_page' => $lastPage,
                    'total' => $total,
                    'data' => $partners
                ],
                'data' => $partners,
                'errors' => null
            ]);
        } catch (Throwable $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao listar parceiros: ' . $e->getMessage(),
                'response' => [
                    'current_page' => 1,
                    'last_page' => 1,
                    'total' => 0,
                    'data' => []
                ],
                'errors' => [$e->getMessage()]
            ]);
        }
    }

    private function handleGetOne($id)
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL_RO);
            $stmt = $pdo->prepare("SELECT id, name_app, `key`, logo_app, primary_color, secondary_color, text_color, phone_support, statusId FROM config_apps_partners WHERE id = :id LIMIT 1");
            $stmt->execute([':id' => $id]);
            $partner = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($partner) {
                $partner['id'] = (int)$partner['id'];
                $partner['logo_app'] = $this->formatLogoUrl($partner['logo_app'] ?? '');
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode([
                    'status' => true,
                    'message' => 'Parceiro encontrado',
                    'response' => $partner,
                    'data' => $partner,
                    'errors' => null
                ]);
            } else {
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode([
                    'status' => false,
                    'message' => 'Parceiro não encontrado',
                    'response' => null,
                    'errors' => ['Parceiro não encontrado']
                ]);
            }
        } catch (Throwable $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => $e->getMessage(),
                'errors' => [$e->getMessage()]
            ]);
        }
    }

    private function handleCreate()
    {
        try {
            $raw = file_get_contents('php://input');
            $json = json_decode($raw, true) ?: [];

            $nameApp = $_POST['name_app'] ?? $json['name_app'] ?? '';
            $key = $_POST['key'] ?? $json['key'] ?? strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $nameApp));
            $primaryColor = $_POST['primary_color'] ?? $json['primary_color'] ?? '#000000';
            $secondaryColor = $_POST['secondary_color'] ?? $json['secondary_color'] ?? '#ffffff';
            $textColor = $_POST['text_color'] ?? $json['text_color'] ?? '#ffffff';
            $phoneSupport = $_POST['phone_support'] ?? $json['phone_support'] ?? null;
            $logoApp = $this->handleLogoUpload() ?: ($_POST['logo_app'] ?? $json['logo_app'] ?? '');

            if (empty($nameApp)) {
                throw new Exception("Nome do aplicativo parceiro é obrigatório");
            }

            $pdo = Connection::open(Connection::DB_MYSQL);
            $stmt = $pdo->prepare("INSERT INTO config_apps_partners (`key`, name_app, logo_app, primary_color, secondary_color, text_color, phone_support, statusId, created_at, updated_at) VALUES (:key, :name_app, :logo_app, :primary_color, :secondary_color, :text_color, :phone_support, 1, NOW(), NOW())");
            $stmt->execute([
                ':key' => $key,
                ':name_app' => $nameApp,
                ':logo_app' => $logoApp,
                ':primary_color' => $primaryColor,
                ':secondary_color' => $secondaryColor,
                ':text_color' => $textColor,
                ':phone_support' => $phoneSupport
            ]);

            $newId = (int)$pdo->lastInsertId();

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Configuração adicionada com sucesso',
                'response' => ['id' => $newId],
                'data' => ['id' => $newId],
                'errors' => null
            ]);
        } catch (Throwable $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => $e->getMessage(),
                'response' => [$e->getMessage()],
                'errors' => [$e->getMessage()]
            ]);
        }
    }

    private function handleUpdate($id)
    {
        try {
            $raw = file_get_contents('php://input');
            $json = json_decode($raw, true) ?: [];

            $nameApp = $_POST['name_app'] ?? $json['name_app'] ?? null;
            $key = $_POST['key'] ?? $json['key'] ?? null;
            $primaryColor = $_POST['primary_color'] ?? $json['primary_color'] ?? null;
            $secondaryColor = $_POST['secondary_color'] ?? $json['secondary_color'] ?? null;
            $textColor = $_POST['text_color'] ?? $json['text_color'] ?? null;
            $phoneSupport = $_POST['phone_support'] ?? $json['phone_support'] ?? null;
            $logoApp = $this->handleLogoUpload() ?: ($_POST['logo_app'] ?? $json['logo_app'] ?? null);

            $pdo = Connection::open(Connection::DB_MYSQL);

            $fields = ["updated_at = NOW()"];
            $params = [':id' => $id];

            if ($nameApp !== null && $nameApp !== '') {
                $fields[] = "name_app = :name_app";
                $params[':name_app'] = $nameApp;
            }
            if ($key !== null && $key !== '') {
                $fields[] = "`key` = :key";
                $params[':key'] = $key;
            }
            if ($primaryColor !== null && $primaryColor !== '') {
                $fields[] = "primary_color = :primary_color";
                $params[':primary_color'] = $primaryColor;
            }
            if ($secondaryColor !== null && $secondaryColor !== '') {
                $fields[] = "secondary_color = :secondary_color";
                $params[':secondary_color'] = $secondaryColor;
            }
            if ($textColor !== null && $textColor !== '') {
                $fields[] = "text_color = :text_color";
                $params[':text_color'] = $textColor;
            }
            if ($phoneSupport !== null) {
                $fields[] = "phone_support = :phone_support";
                $params[':phone_support'] = $phoneSupport;
            }
            if ($logoApp !== null && $logoApp !== '') {
                $fields[] = "logo_app = :logo_app";
                $params[':logo_app'] = $logoApp;
            }

            $sql = "UPDATE config_apps_partners SET " . implode(", ", $fields) . " WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Configuração atualizada com sucesso',
                'response' => true,
                'data' => true,
                'errors' => null
            ]);
        } catch (Throwable $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => $e->getMessage(),
                'response' => [$e->getMessage()],
                'errors' => [$e->getMessage()]
            ]);
        }
    }

    private function handleDelete($id)
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL);
            // Soft delete if statusId exists, otherwise hard delete
            $stmt = $pdo->prepare("UPDATE config_apps_partners SET statusId = 2, updated_at = NOW() WHERE id = :id");
            $stmt->execute([':id' => $id]);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Configuração deletada com sucesso',
                'response' => true,
                'data' => true,
                'errors' => null
            ]);
        } catch (Throwable $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => $e->getMessage(),
                'response' => [$e->getMessage()],
                'errors' => [$e->getMessage()]
            ]);
        }
    }

    private function handleLogoUpload(): ?string
    {
        if (isset($_FILES['logo_app']) && is_uploaded_file($_FILES['logo_app']['tmp_name'])) {
            try {
                $ext = strtolower(pathinfo($_FILES['logo_app']['name'], PATHINFO_EXTENSION)) ?: 'png';
                $safeName = 'cap_' . time() . '_' . mt_rand(100, 999) . '.' . $ext;
                $s3 = new S3();
                $s3->uploadSingle('appPartner/' . $safeName, $_FILES['logo_app']['tmp_name']);
                return $s3->getUrl('appPartner/' . $safeName);
            } catch (Throwable $t) {
                $uploadDir = __DIR__ . '/../../public/uploads/appPartner/';
                if (!is_dir($uploadDir)) {
                    @mkdir($uploadDir, 0777, true);
                }
                $ext = strtolower(pathinfo($_FILES['logo_app']['name'], PATHINFO_EXTENSION)) ?: 'png';
                $safeName = 'cap_' . time() . '_' . mt_rand(100, 999) . '.' . $ext;
                if (@move_uploaded_file($_FILES['logo_app']['tmp_name'], $uploadDir . $safeName)) {
                    $baseUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://" . ($_SERVER['HTTP_HOST'] ?? 'localhost');
                    return $baseUrl . '/uploads/appPartner/' . $safeName;
                }
            }
        }
        return null;
    }

    private function formatLogoUrl($url): string
    {
        if (empty($url)) return '';
        if (strpos($url, 'http://') === 0 || strpos($url, 'https://') === 0) {
            return $url;
        }
        $minio = 'https://minio.704app.com.br/rota101fb704/';
        return $minio . ltrim($url, '/');
    }
}
