<?php

namespace app\controllers;

use app\services\ConfigService;
use Exception;
use GuzzleHttp\Client;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 16/10/2019
 * Time: 09:27
 */
class ConfigController extends ApiController
{
    public function actionGeneral()
    {
        try {
            $result = (new ConfigService)
                ->generalConfigs();

            echo $this->returnSuccess("Configurações encontradas", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar configurações");
        }
    }

    public function actionGetAppPartner()
    {
        try {
            $client = new Client();

            $apiUrl = env('URL_MONITOR_APIV2') . 'config_app_partners/get_all';

            $internalToken = ltrim(env('INTERNAL_TOKEN'), '^');

            $responseConfigAppPartners = $client->request('GET', $apiUrl, [
                'headers' => [
                    'token' => $internalToken,
                ]
            ]);

            $responseJson = json_decode($responseConfigAppPartners->getBody(), true);

            echo $this->returnSuccess("Configurações de apps parceiros capturados com sucesso.", $responseJson);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar configurações de apps parceiros");
        }
    }

    public function actionIndex()
    {
        $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        if ($method === 'PUT' || $method === 'POST') {
            $input = file_get_contents('php://input');
            $data = json_decode($input, true);
            if (!is_array($data) || empty($data)) {
                $data = $_POST;
            }

            if (empty($data)) {
                echo $this->returnSuccess("Nenhum dado enviado para atualização.", []);
                return;
            }

            try {
                $conn = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
                $updated = [];
                foreach ($data as $k => $v) {
                    $keyStr = (string)$k;
                    $valStr = (string)$v;

                    // Verifica se a chave já existe
                    $checkStmt = $conn->prepare("SELECT idConfig FROM config WHERE `key` = :k LIMIT 1");
                    $checkStmt->execute([':k' => $keyStr]);
                    $exists = $checkStmt->fetchColumn();

                    if ($exists) {
                        $updateStmt = $conn->prepare("UPDATE config SET value = :val WHERE `key` = :k");
                        $updateStmt->execute([':val' => $valStr, ':k' => $keyStr]);
                    } else {
                        $insertStmt = $conn->prepare("INSERT INTO config (configTypeId, `key`, value, description) VALUES (13, :k, :val, :desc)");
                        $insertStmt->execute([
                            ':k' => $keyStr,
                            ':val' => $valStr,
                            ':desc' => $keyStr
                        ]);
                    }
                    $updated[$keyStr] = $valStr;

                    try {
                        $cache = new \app\utils\CacheUtils();
                        $cache->delete('config_' . $keyStr);
                    } catch (\Throwable $t) {}
                }

                echo $this->returnSuccess("Configurações atualizadas com sucesso", $updated);
            } catch (\Throwable $e) {
                echo $this->returnError($e, "Erro ao atualizar configurações");
            }
            return;
        }

        // GET /config or GET /config/{key}
        try {
            $uri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
            $parts = array_values(array_filter(explode('/', trim($uri, '/'))));
            $reqKey = (isset($parts[1]) && strtolower($parts[0]) === 'config') ? $parts[1] : ($_GET['key'] ?? null);

            $conn = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RO);

            if (!empty($reqKey)) {
                $stmt = $conn->prepare("SELECT `key`, value, description FROM config WHERE `key` = :k LIMIT 1");
                $stmt->execute([':k' => $reqKey]);
                $cfg = $stmt->fetch(\PDO::FETCH_ASSOC);

                if ($cfg) {
                    echo json_encode([
                        'status' => true,
                        'message' => 'Configuração encontrada',
                        'data' => $cfg['value'],
                        'response' => $cfg['value'],
                        'config' => $cfg,
                        'errors' => null
                    ]);
                } else {
                    echo json_encode([
                        'status' => false,
                        'message' => "Configuração '{$reqKey}' não encontrada",
                        'data' => null,
                        'response' => null,
                        'errors' => null
                    ]);
                }
                return;
            }

            $stmt = $conn->query("SELECT `key`, value, description FROM config");
            $configs = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            echo $this->returnSuccess("Configurações encontradas", $configs);
        } catch (\Throwable $e) {
            echo $this->returnError($e, "Erro ao buscar configurações");
        }
    }

    public function actionType()
    {
        $typeId = $_GET['id'] ?? null;
        if (!$typeId && isset($_SERVER['REQUEST_URI'])) {
            $parts = explode('/', trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'));
            $typeId = end($parts);
        }

        try {
            $conn = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RO);
            $stmt = $conn->prepare("SELECT `key`, value, description, inputTypePro FROM config WHERE configTypeId = :type");
            $stmt->execute([':type' => (int)$typeId]);
            $configs = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            echo $this->returnSuccess("Configurações do tipo {$typeId} encontradas", $configs);
        } catch (\Throwable $e) {
            echo $this->returnError($e, "Erro ao buscar configurações por tipo");
        }
    }
}
