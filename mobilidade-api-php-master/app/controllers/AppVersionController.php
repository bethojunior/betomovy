<?php

namespace app\controllers;

use app\dao\AppDao;
use app\utils\BaseDao;
use Exception;

class AppVersionController extends ApiController
{
    public function actionIndex()
    {
        try {
            $method = $_SERVER['REQUEST_METHOD'];
            $dao = new BaseDao();

            if ($method === 'GET') {
                $page = isset($_GET['page']) && (int)$_GET['page'] > 0 ? (int)$_GET['page'] : 1;
                $limit = 20;
                $offset = ($page - 1) * $limit;

                // Contar total
                $countResult = $dao->sqlRawSelect("SELECT COUNT(*) AS total FROM appVersion")->first();
                $total = $countResult ? (int)$countResult['total'] : 0;
                $lastPage = $total > 0 ? (int)ceil($total / $limit) : 1;

                // Buscar registros com JOIN em app
                $sql = "SELECT v.id,
                               v.appId,
                               v.version,
                               v.platform,
                               v.link,
                               v.statusId,
                               v.created_at,
                               v.updated_at,
                               COALESCE(a.name, CONCAT('App ', v.appId)) AS appName
                        FROM appVersion v
                        LEFT JOIN app a ON a.idApp = v.appId
                        ORDER BY v.id DESC
                        LIMIT {$limit} OFFSET {$offset}";

                $rows = $dao->sqlRawSelect($sql)->get();
                $data = [];

                if (is_array($rows)) {
                    foreach ($rows as $row) {
                        $row['id'] = (int)$row['id'];
                        $row['appId'] = (int)$row['appId'];
                        $row['statusId'] = (int)$row['statusId'];
                        $row['created_at'] = $row['created_at'] ? date('c', strtotime($row['created_at'])) : date('c');
                        $data[] = $row;
                    }
                }

                $response = [
                    'data' => $data,
                    'current_page' => $page,
                    'last_page' => $lastPage,
                    'per_page' => $limit,
                    'total' => $total
                ];

                echo $this->returnSuccess("Versões encontradas", $response);
                return;
            }

            if ($method === 'PUT') {
                $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
                $data = $this->request(false);

                if (!$id && isset($data->id)) {
                    $id = (int)$data->id;
                }

                if (!$id) {
                    throw new Exception("ID da versão não informado.");
                }

                if (isset($data->active)) {
                    $statusId = $data->active ? 1 : 2;
                    $dao->sqlRawSelect("UPDATE appVersion SET statusId = :statusId, updated_at = NOW() WHERE id = :id", [
                        ':statusId' => $statusId,
                        ':id' => $id
                    ]);
                    echo $this->returnSuccess("Status atualizado com sucesso");
                    return;
                }

                $version = $data->version ?? null;
                $platform = $data->platform ?? null;
                $link = $data->link ?? null;
                $appId = isset($data->appId) ? (int)$data->appId : null;

                $fields = [];
                $params = [':id' => $id];

                if ($version !== null) {
                    $fields[] = "version = :version";
                    $params[':version'] = $version;
                }
                if ($platform !== null) {
                    $fields[] = "platform = :platform";
                    $params[':platform'] = $platform;
                }
                if ($link !== null) {
                    $fields[] = "link = :link";
                    $params[':link'] = $link;
                }
                if ($appId !== null) {
                    $fields[] = "appId = :appId";
                    $params[':appId'] = $appId;
                }

                if (!empty($fields)) {
                    $fields[] = "updated_at = NOW()";
                    $sql = "UPDATE appVersion SET " . implode(", ", $fields) . " WHERE id = :id";
                    $dao->sqlRawSelect($sql, $params);
                }

                echo $this->returnSuccess("Versão atualizada com sucesso");
                return;
            }

            if ($method === 'POST') {
                $data = $this->request(false);
                $appId = isset($data->appId) ? (int)$data->appId : null;
                $version = isset($data->version) ? trim($data->version) : null;
                $platform = isset($data->platform) ? trim($data->platform) : 'android';
                $link = isset($data->link) ? trim($data->link) : '';
                $statusId = !empty($data->active) ? 1 : (isset($data->statusId) ? (int)$data->statusId : 1);

                if (!$appId || !$version) {
                    throw new Exception("App e versão são obrigatórios.");
                }

                $dao->sqlRawSelect("INSERT INTO appVersion (appId, version, platform, link, statusId, created_at, updated_at)
                                    VALUES (:appId, :version, :platform, :link, :statusId, NOW(), NOW())", [
                    ':appId' => $appId,
                    ':version' => $version,
                    ':platform' => $platform,
                    ':link' => $link,
                    ':statusId' => $statusId
                ]);

                echo $this->returnSuccess("Versão cadastrada com sucesso");
                return;
            }

            throw new Exception("Método não suportado.");
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao processar versões do app");
        }
    }
}
