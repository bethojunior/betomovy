<?php

namespace app\controllers;

use Exception;

class DriverCommissionController extends ApiController
{
    public function actionIndex()
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        if ($method === 'POST') {
            $this->actionStore();
            return;
        }

        try {
            $rawCityId = $_GET['id'] ?? ($_GET['cityId'] ?? ($_SERVER['HTTP_CITYID'] ?? ($_SERVER['HTTP_CITY_ID'] ?? 0)));
            $cityId = (int)$rawCityId;
            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);

            $stmt = $pdo->prepare("
                SELECT 
                    idDriverCommission as id,
                    idDriverCommission,
                    cityId,
                    tripTypeId,
                    value,
                    valueType,
                    disableOnPromotion,
                    statusId
                FROM driverCommission
                WHERE (cityId = :cityId OR :cityIdZero = 0)
                  AND statusId = 1
                ORDER BY idDriverCommission ASC
            ");
            $stmt->execute([':cityId' => $cityId, ':cityIdZero' => $cityId]);
            $commissions = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            foreach ($commissions as &$c) {
                $commissionId = (int)$c['idDriverCommission'];

                // Payment forms
                $stmtForms = $pdo->prepare("
                    SELECT tripPaymentFormId, value, valueType
                    FROM driverCommissionPaymentForm
                    WHERE driverCommissionId = :id
                ");
                $stmtForms->execute([':id' => $commissionId]);
                $forms = $stmtForms->fetchAll(\PDO::FETCH_ASSOC);
                $c['commissions_payment_form'] = $forms;
                $c['commissionsPaymentForm'] = $forms;

                // Another fee
                $stmtFee = $pdo->prepare("
                    SELECT taxValueType, valueType, tax_value, another_value
                    FROM driverCommissionAnotherFee
                    WHERE driverCommissionId = :id
                    LIMIT 1
                ");
                $stmtFee->execute([':id' => $commissionId]);
                $fee = $stmtFee->fetch(\PDO::FETCH_ASSOC);
                $c['commission_another_fee'] = $fee ?: null;
                $c['commissionAnotherFee'] = $fee ?: null;
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Comissões encontradas',
                'data' => $commissions,
                'response' => $commissions,
                'errors' => null
            ]);
        } catch (\Throwable $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Nenhuma comissão',
                'data' => [],
                'response' => [],
                'errors' => null
            ]);
        }
    }

    public function actionStore()
    {
        try {
            $raw = file_get_contents('php://input');
            $body = json_decode($raw, true) ?: $_POST;
            $rawCityId = $_GET['cityId'] ?? ($_GET['id'] ?? ($body['cityId'] ?? ($_SERVER['HTTP_CITYID'] ?? ($_SERVER['HTTP_CITY_ID'] ?? 0))));
            $cityId = (int)$rawCityId;
            $tripTypeId = (int)($body['tripTypeId'] ?? ($_GET['tripTypeId'] ?? 0));

            if ($cityId <= 0 || $tripTypeId <= 0) {
                http_response_code(400);
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode([
                    'status' => false,
                    'message' => 'cityId e tripTypeId são obrigatórios para comissão do motorista.',
                    'data' => null,
                    'response' => null,
                    'errors' => 'cityId and tripTypeId required'
                ]);
                return;
            }

            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);

            // Inactivate existing active commission for same city and tripType
            $upd = $pdo->prepare("UPDATE driverCommission SET statusId = 2, updated_at = NOW() WHERE cityId = :cityId AND tripTypeId = :tripTypeId");
            $upd->execute([':cityId' => $cityId, ':tripTypeId' => $tripTypeId]);

            $value = (float)($body['value'] ?? 0);
            $valueType = (string)($body['valueType'] ?? '%');
            $disableOnPromotion = !empty($body['disableOnPromotion']) ? 1 : 0;

            $ins = $pdo->prepare("
                INSERT INTO driverCommission (cityId, tripTypeId, value, valueType, disableOnPromotion, statusId, created_at, updated_at)
                VALUES (:cityId, :tripTypeId, :value, :valueType, :disableOnPromotion, 1, NOW(), NOW())
            ");
            $ins->execute([
                ':cityId' => $cityId,
                ':tripTypeId' => $tripTypeId,
                ':value' => $value,
                ':valueType' => $valueType,
                ':disableOnPromotion' => $disableOnPromotion
            ]);
            $driverCommissionId = (int)$pdo->lastInsertId();

            // Insert payment form commissions if present
            $forms = $body['commissionsPaymentForm'] ?? ($body['commissions_payment_form'] ?? []);
            if (is_array($forms) && !empty($forms)) {
                $insForm = $pdo->prepare("
                    INSERT INTO driverCommissionPaymentForm (driverCommissionId, tripPaymentFormId, value, valueType)
                    VALUES (:driverCommissionId, :tripPaymentFormId, :value, :valueType)
                ");
                foreach ($forms as $f) {
                    $formId = (int)($f['tripPaymentFormId'] ?? ($f['id'] ?? 0));
                    if ($formId > 0) {
                        $fVal = (float)($f['value'] ?? 0);
                        $fType = (string)($f['valueType'] ?? '%');
                        $insForm->execute([
                            ':driverCommissionId' => $driverCommissionId,
                            ':tripPaymentFormId' => $formId,
                            ':value' => $fVal,
                            ':valueType' => $fType
                        ]);
                    }
                }
            }

            // Insert another fee if present
            $anotherFee = $body['commissionAnotherFee'] ?? ($body['commission_another_fee'] ?? null);
            if (is_array($anotherFee)) {
                $taxValType = (string)($anotherFee['taxValueType'] ?? '%');
                $valType = (string)($anotherFee['valueType'] ?? '%');
                $taxVal = (float)($anotherFee['tax_value'] ?? 0);
                $anotherVal = (float)($anotherFee['another_value'] ?? 0);

                $insFee = $pdo->prepare("
                    INSERT INTO driverCommissionAnotherFee (driverCommissionId, taxValueType, valueType, tax_value, another_value)
                    VALUES (:driverCommissionId, :taxValueType, :valueType, :tax_value, :another_value)
                ");
                $insFee->execute([
                    ':driverCommissionId' => $driverCommissionId,
                    ':taxValueType' => $taxValType,
                    ':valueType' => $valType,
                    ':tax_value' => $taxVal,
                    ':another_value' => $anotherVal
                ]);
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Comissão salva com sucesso',
                'data' => [
                    'id' => $driverCommissionId,
                    'idDriverCommission' => $driverCommissionId,
                    'cityId' => $cityId,
                    'tripTypeId' => $tripTypeId,
                    'value' => $value,
                    'valueType' => $valueType,
                    'disableOnPromotion' => $disableOnPromotion
                ],
                'response' => true,
                'errors' => null
            ]);
        } catch (\Throwable $e) {
            http_response_code(400);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao salvar comissão: ' . $e->getMessage(),
                'data' => null,
                'response' => null,
                'errors' => $e->getMessage()
            ]);
        }
    }
}
