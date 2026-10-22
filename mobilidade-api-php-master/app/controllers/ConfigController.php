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

    public function actionAdditional()
    {
        $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        if ($method === 'PUT' || $method === 'POST') {
            $this->actionIndex();
            return;
        }

        try {
            $conn = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RO);

            $additionalKeys = [
                'minimum_value_for_withdraw',
                'minimum_value_for_partner_withdraw',
                'max_amount_for_receipt_in_vehicle',
                'fast_finger_call',
                'time_in_seconds_to_call_driver',
                'enable_floating_price_recalculation',
                'whatsapp_message_client',
                'whatsapp_message_driver',
                'scheduled_trip_interval',
                'time_to_notify_driver_trip_scheduled',
                'time_to_call_driver_trip_scheduled_in_seconds',
                'enable_social_networks_on_monitor',
                'enable_operation_manual_and_youtube_channel',
                'time_to_cancel_trip_bid_in_seconds',
                'travel_only_by_offer',
                'title_for_home',
                'how_many_times_alert_will_be_shown',
                'show_more_calcs_driver',
                'text_the_end_trip_with_bonus',
                'text_whatsapp_trip_list_unanswered_support',
                'whatsapp_parabens_driver_message',
                'whatsapp_parabens_client_message',
                'whatsapp_zafira_validated_driver_message',
                'whatsapp_zafira_validated_client_message',
                'minimum_value_for_pix',
                'enable_pix_trip_end_ipag',
                'pulse_group',
                'enable_button_panic_by_city',
                'enable_publicity',
                'enable-button-bills-menu',
                'interval-to-get-trips',
                'link_manager_indication',
                'enable_account_deletion_request',
                'enable_account_menu',
                'enable_favorite_customer_and_driver',
                'enable_favorite_driver_with_referral_link',
                'enable_voucher_payment_type_inDriver_trip',
                'enable_transform_km_for_mi',
                'call_driver_without_credit',
                'customer_register_unblocked',
                'driver_terms_of_use',
                'customer_terms_of_use'
            ];

            $inPlaceholders = implode(',', array_fill(0, count($additionalKeys), '?'));
            $sql = "
                SELECT c.idConfig, c.configTypeId, ct.name AS typeName, c.`key`, c.value, c.description, c.inputTypePro
                FROM config c
                LEFT JOIN configType ct ON ct.idConfigType = c.configTypeId
                WHERE c.`key` IN ($inPlaceholders) OR ct.name = 'GESTOR'
                ORDER BY c.`key` ASC
            ";
            $stmt = $conn->prepare($sql);
            $stmt->execute($additionalKeys);
            $configs = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            foreach ($configs as &$cfg) {
                $k = $cfg['key'];
                $v = (string)($cfg['value'] ?? '');

                if (empty($cfg['description'])) {
                    $cleanDesc = ucwords(str_replace(['_', '-'], ' ', $k));
                    $cfg['description'] = $cleanDesc;
                }

                if (empty($cfg['inputTypePro'])) {
                    $isBoolName = (
                        strpos($k, 'enable') === 0 ||
                        strpos($k, 'is_') === 0 ||
                        in_array($k, [
                            'fast_finger_call',
                            'travel_only_by_offer',
                            'show_more_calcs_driver',
                            'enable_pix_trip_end_ipag',
                            'call_driver_without_credit',
                            'customer_register_unblocked'
                        ])
                    );
                    if ($isBoolName || $v === '0' || $v === '1') {
                        if (!in_array($k, ['scheduled_trip_interval', 'time_in_seconds_to_call_driver', 'interval-to-get-trips', 'time_to_cancel_trip_bid_in_seconds', 'how_many_times_alert_will_be_shown'])) {
                            $cfg['inputTypePro'] = 'boolean';
                        }
                    }
                }
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Configurações adicionais encontradas',
                'data' => $configs,
                'response' => $configs,
                'errors' => null
            ]);
        } catch (\Throwable $e) {
            echo $this->returnError($e, "Erro ao buscar configurações adicionais");
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
                if ($reqKey === 'textTripTypes') {
                    $stmt = $conn->prepare("SELECT `key`, value FROM config WHERE `key` IN ('title_trip_types', 'description_trip_types')");
                    $stmt->execute();
                    $rows = $stmt->fetchAll(\PDO::FETCH_ASSOC);
                    $map = ['title_trip_types' => '', 'description_trip_types' => ''];
                    foreach ($rows as $r) {
                        $map[$r['key']] = $r['value'];
                    }
                    echo json_encode([
                        'status' => true,
                        'message' => 'Configurações de tipos de viagem',
                        'data' => $map,
                        'response' => $map,
                        'errors' => null
                    ]);
                    return;
                }

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
                        'status' => true,
                        'message' => "Configuração '{$reqKey}' vazia",
                        'data' => null,
                        'response' => null,
                        'errors' => null
                    ]);
                }
                return;
            }

            $stmt = $conn->query("
                SELECT c.idConfig, c.configTypeId, ct.name AS typeName, c.`key`, c.value, c.description, c.inputTypePro 
                FROM config c 
                LEFT JOIN configType ct ON ct.idConfigType = c.configTypeId 
                ORDER BY c.`key` ASC
            ");
            $configs = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            echo $this->returnSuccess("Configurações encontradas", $configs);
        } catch (\Throwable $e) {
            echo $this->returnError($e, "Erro ao buscar configurações");
        }
    }

    public function actionEnable_whatsapp_central()
    {
        try {
            $conn = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RO);
            $stmt = $conn->prepare("SELECT value FROM config WHERE `key` = 'enable_whatsapp_central' LIMIT 1");
            $stmt->execute();
            $val = $stmt->fetchColumn();
            $enabled = ($val !== false && $val !== null && $val !== '') ? (string)$val : '1';
            echo json_encode([
                'status' => true,
                'message' => 'Configuração enable_whatsapp_central',
                'data' => $enabled,
                'response' => $enabled,
                'errors' => null
            ]);
        } catch (\Throwable $e) {
            echo json_encode([
                'status' => true,
                'message' => 'Configuração padrão ativada',
                'data' => '1',
                'response' => '1',
                'errors' => null
            ]);
        }
    }

    public function actionEnableWhatsappCentral()
    {
        $this->actionEnable_whatsapp_central();
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
