<?php

namespace app\controllers;

use app\utils\Connection;
use Exception;
use Throwable;

class DeliveryAcquirerController extends ApiController
{
    /**
     * Dispatch /deliveryAcquirer/token based on HTTP method
     */
    public function actionToken()
    {
        $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        if ($method === 'PUT' || $method === 'POST') {
            $this->actionUpdateToken();
            return;
        }

        $this->actionGetToken();
    }

    /**
     * GET /deliveryAcquirer/token
     */
    public function actionGetToken()
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL_RW);

            $stmt = $pdo->prepare("SELECT value FROM deliveryAcquirerMetaData WHERE `key` = 'asaas_token' LIMIT 1");
            $stmt->execute();
            $row = $stmt->fetch(\PDO::FETCH_ASSOC);

            $token = $row && !empty($row['value']) ? (string)$row['value'] : '';

            // Fallback to config table if not found
            if (empty($token)) {
                $stmtCfg = $pdo->prepare("SELECT value FROM config WHERE `key` IN ('asaas_token', 'asaas_api_key', 'asaas_access_token') AND value IS NOT NULL AND value != '' LIMIT 1");
                $stmtCfg->execute();
                $rowCfg = $stmtCfg->fetch(\PDO::FETCH_ASSOC);
                if ($rowCfg && !empty($rowCfg['value'])) {
                    $token = (string)$rowCfg['value'];
                }
            }

            echo $this->returnSuccess("Token encontrado", $token);
        } catch (Throwable $e) {
            echo $this->returnError($e, "Erro ao buscar token");
        }
    }

    /**
     * PUT or POST /deliveryAcquirer/token
     */
    public function actionUpdateToken()
    {
        try {
            $rawInput = file_get_contents('php://input');
            $data = json_decode($rawInput, true);
            if (!is_array($data)) {
                $data = $_POST;
            }

            $token = $data['value'] ?? ($data['asaas_token'] ?? '');

            $pdo = Connection::open(Connection::DB_MYSQL_RW);

            // Ensure table deliveryAcquirerMetaData exists
            $stmtCheck = $pdo->prepare("SELECT id FROM deliveryAcquirerMetaData WHERE `key` = 'asaas_token' LIMIT 1");
            $stmtCheck->execute();
            if ($stmtCheck->fetch()) {
                $stmt = $pdo->prepare("UPDATE deliveryAcquirerMetaData SET `value` = :token WHERE `key` = 'asaas_token'");
                $stmt->execute([':token' => $token]);
            } else {
                $stmt = $pdo->prepare("
                    INSERT INTO deliveryAcquirerMetaData (`key`, `value`, `deliveryFinancialIntermediaryId`, `showable`, `description`)
                    VALUES ('asaas_token', :token, 1, 1, 'Token gerado pelo ASAAS')
                ");
                $stmt->execute([':token' => $token]);
            }

            // Sync with config table if exists
            try {
                $stmtCfg = $pdo->prepare("UPDATE config SET `value` = :token WHERE `key` IN ('asaas_token', 'asaas_api_key', 'asaas_access_token')");
                $stmtCfg->execute([':token' => $token]);
            } catch (Throwable $t) {
                // Ignore
            }

            echo $this->returnSuccess("Token atualizado com sucesso", $token);
        } catch (Throwable $e) {
            echo $this->returnError($e, "Erro ao atualizar token");
        }
    }

    public function actionIndex()
    {
        $this->actionGetToken();
    }
}
