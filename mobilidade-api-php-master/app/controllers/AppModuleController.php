<?php

namespace app\controllers;

use app\utils\Connection;
use app\utils\Photo;
use app\utils\S3;
use Exception;
use Throwable;

class AppModuleController extends ApiController
{
    /**
     * List all modules with their active status and logo
     */
    public function actionIndex()
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL_RW);

            $sql = "
                SELECT 
                    am.id AS moduleId,
                    am.name AS name,
                    COALESCE(aam.id, am.id) AS id,
                    aam.logo AS logo,
                    COALESCE(CAST(aam.isActive AS UNSIGNED), 0) AS isActive
                FROM appModules am
                LEFT JOIN appActiveModules aam ON (am.id = aam.appModuleId AND aam.statusId = 1)
                ORDER BY am.id ASC
            ";

            $stmt = $pdo->query($sql);
            $rows = $stmt ? $stmt->fetchAll(\PDO::FETCH_ASSOC) : [];

            $data = [];
            foreach ($rows as $row) {
                $data[] = [
                    'id' => (int)$row['id'],
                    'moduleId' => (int)$row['moduleId'],
                    'name' => $row['name'],
                    'moduleName' => $row['name'],
                    'isActive' => (int)$row['isActive'],
                    'logo' => !empty($row['logo']) ? (string)$row['logo'] : '',
                ];
            }

            echo $this->returnSuccess("Módulos encontrados", $data);
        } catch (Throwable $e) {
            echo $this->returnError($e, "Erro ao buscar os módulos");
        }
    }

    /**
     * Update module status or logo
     */
    public function actionUpdate()
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL_RW);

            $rawInput = file_get_contents('php://input');
            $data = json_decode($rawInput, true);
            if (!is_array($data)) {
                $data = $_POST;
            }

            $id = (int)($data['id'] ?? 0);
            $isActive = isset($data['isActive']) ? (int)$data['isActive'] : null;
            $name = $data['name'] ?? null;
            $logoUrl = null;

            // Check if logo file was uploaded
            if (isset($_FILES['logo']) && is_uploaded_file($_FILES['logo']['tmp_name'])) {
                try {
                    $photoUtil = new Photo();
                    $fileName = $photoUtil->save($_FILES['logo'], 'iconModules/');
                    $s3 = new S3();
                    $logoUrl = $s3->getUrl('iconModules/' . $fileName);
                } catch (Throwable $t) {
                    // Fallback to local upload directory
                    $uploadDir = __DIR__ . '/../../public/uploads/iconModules/';
                    if (!is_dir($uploadDir)) {
                        @mkdir($uploadDir, 0777, true);
                    }
                    $safeExt = strtolower(pathinfo($_FILES['logo']['name'], PATHINFO_EXTENSION));
                    $safeName = 'mod_' . $id . '_' . time() . '.' . $safeExt;
                    if (@move_uploaded_file($_FILES['logo']['tmp_name'], $uploadDir . $safeName)) {
                        $baseUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://" . ($_SERVER['HTTP_HOST'] ?? 'localhost');
                        $logoUrl = $baseUrl . '/uploads/iconModules/' . $safeName;
                    }
                }
            } elseif (!empty($data['logo']) && is_string($data['logo'])) {
                $logoUrl = $data['logo'];
            }

            // Find matching row in appActiveModules
            $stmt = $pdo->prepare("SELECT id, appModuleId FROM appActiveModules WHERE id = :id OR appModuleId = :id LIMIT 1");
            $stmt->execute([':id' => $id]);
            $existing = $stmt->fetch(\PDO::FETCH_ASSOC);

            if ($existing) {
                $activeId = (int)$existing['id'];
                $updateFields = [];
                $params = [':id' => $activeId];

                if ($isActive !== null) {
                    $updateFields[] = "isActive = :isActive";
                    $params[':isActive'] = $isActive;
                }

                if ($logoUrl !== null) {
                    $updateFields[] = "logo = :logo";
                    $params[':logo'] = $logoUrl;
                }

                if (!empty($updateFields)) {
                    $sql = "UPDATE appActiveModules SET " . implode(", ", $updateFields) . " WHERE id = :id";
                    $updateStmt = $pdo->prepare($sql);
                    $updateStmt->execute($params);
                }
            } else {
                // Determine appModuleId
                $appModuleId = $id;
                $stmtModule = $pdo->prepare("SELECT id FROM appModules WHERE id = :id LIMIT 1");
                $stmtModule->execute([':id' => $id]);
                if (!$stmtModule->fetch()) {
                    // Try to find by name
                    if ($name) {
                        $stmtByName = $pdo->prepare("SELECT id FROM appModules WHERE name = :name LIMIT 1");
                        $stmtByName->execute([':name' => $name]);
                        $mod = $stmtByName->fetch(\PDO::FETCH_ASSOC);
                        if ($mod) {
                            $appModuleId = (int)$mod['id'];
                        }
                    }
                }

                $insertStmt = $pdo->prepare("
                    INSERT INTO appActiveModules (appModuleId, logo, isActive, statusId)
                    VALUES (:appModuleId, :logo, :isActive, 1)
                ");
                $insertStmt->execute([
                    ':appModuleId' => $appModuleId,
                    ':logo' => $logoUrl ?: '',
                    ':isActive' => $isActive !== null ? $isActive : 1,
                ]);
            }

            echo $this->returnSuccess("Módulo atualizado com sucesso", [
                'id' => $id,
                'isActive' => $isActive,
                'logo' => $logoUrl,
            ]);
        } catch (Throwable $e) {
            echo $this->returnError($e, "Erro ao atualizar módulo");
        }
    }

    public function actionGetAllActiveModules()
    {
        $this->actionIndex();
    }
}
