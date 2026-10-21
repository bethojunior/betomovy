<?php

namespace app\controllers;

use app\dao\GenericDao;
use app\services\CreditPrepaidPurchaseService;
use Exception;

class CreditPrepaidController extends ApiController
{
    public function actionIndex()
    {
        try {
            $method = $_SERVER['REQUEST_METHOD'];

            if ($method === 'GET') {
                $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
                if ($id) {
                    $item = GenericDao::first("SELECT c.*, ci.nome AS cityName 
                                                FROM creditPrepaid c 
                                                LEFT JOIN city ci ON ci.id = c.cityId 
                                                WHERE c.id = :id AND c.deleted_at IS NULL", [':id' => $id]);
                    echo $this->returnSuccess('Crédito pré-pago encontrado', $item);
                    return;
                }

                $cityId = isset($_GET['cityId']) && !empty($_GET['cityId']) ? (int)$_GET['cityId'] : null;
                $where = ["c.deleted_at IS NULL"];
                $params = [];

                if ($cityId) {
                    $where[] = "(c.cityId = :cityId OR c.cityId IS NULL)";
                    $params[':cityId'] = $cityId;
                }

                $whereStr = implode(" AND ", $where);
                $sql = "SELECT c.*, ci.nome AS cityName 
                        FROM creditPrepaid c 
                        LEFT JOIN city ci ON ci.id = c.cityId 
                        WHERE {$whereStr} 
                        ORDER BY c.id DESC";

                $rows = GenericDao::query($sql, $params);
                $result = [];

                foreach ($rows as $r) {
                    $r['id'] = (int)$r['id'];
                    $r['purchasePrice'] = (float)$r['purchasePrice'];
                    $r['sellPrice'] = (float)$r['sellPrice'];
                    $r['quantityDaysSold'] = $r['quantityDaysSold'] !== null ? (int)$r['quantityDaysSold'] : null;
                    $r['quantityDaysPurchased'] = $r['quantityDaysPurchased'] !== null ? (int)$r['quantityDaysPurchased'] : null;
                    $result[] = $r;
                }

                echo $this->returnSuccess('Créditos pré-pago encontrados', $result);
                return;
            }

            if ($method === 'POST') {
                $data = $this->request(false);
                $title = $data->title ?? '';
                $superTitle = $data->superTitle ?? ($data->subtitle ?? '');
                $stripe = $data->stripe ?? '';
                $purchasePrice = (float)($data->purchasePrice ?? ($data->valueGain ?? 0));
                $sellPrice = (float)($data->sellPrice ?? ($data->valueBuy ?? 0));
                $accountInformation = $data->accountInformation ?? ($data->dataPayment ?? '');
                $cityId = !empty($data->cityId) ? (int)$data->cityId : (!empty($data->city) ? (int)$data->city : null);
                $type = in_array($data->type ?? '', ['value', 'perPeriod']) ? $data->type : 'value';
                $quantityDaysSold = isset($data->quantityDaysSold) ? (int)$data->quantityDaysSold : null;
                $quantityDaysPurchased = isset($data->quantityDaysPurchased) ? (int)$data->quantityDaysPurchased : null;

                GenericDao::execute("INSERT INTO creditPrepaid (title, superTitle, stripe, purchasePrice, sellPrice, accountInformation, cityId, type, quantityDaysSold, quantityDaysPurchased, created_at, updated_at) 
                                    VALUES (:title, :superTitle, :stripe, :purchasePrice, :sellPrice, :accountInformation, :cityId, :type, :quantityDaysSold, :quantityDaysPurchased, NOW(), NOW())", [
                    ':title' => $title,
                    ':superTitle' => $superTitle,
                    ':stripe' => $stripe,
                    ':purchasePrice' => $purchasePrice,
                    ':sellPrice' => $sellPrice,
                    ':accountInformation' => $accountInformation,
                    ':cityId' => $cityId,
                    ':type' => $type,
                    ':quantityDaysSold' => $quantityDaysSold,
                    ':quantityDaysPurchased' => $quantityDaysPurchased
                ]);

                echo $this->returnSuccess('Pré-pago criado com sucesso');
                return;
            }

            if ($method === 'PUT') {
                $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
                $data = $this->request(false);
                if (!$id && isset($data->id)) {
                    $id = (int)$data->id;
                }

                if (!$id) {
                    throw new Exception("ID do crédito pré-pago não informado.");
                }

                $fields = ["updated_at = NOW()"];
                $params = [':id' => $id];

                if (isset($data->title)) { $fields[] = "title = :title"; $params[':title'] = $data->title; }
                if (isset($data->superTitle)) { $fields[] = "superTitle = :superTitle"; $params[':superTitle'] = $data->superTitle; }
                if (isset($data->subtitle)) { $fields[] = "superTitle = :subtitle"; $params[':subtitle'] = $data->subtitle; }
                if (isset($data->stripe)) { $fields[] = "stripe = :stripe"; $params[':stripe'] = $data->stripe; }
                if (isset($data->purchasePrice)) { $fields[] = "purchasePrice = :purchasePrice"; $params[':purchasePrice'] = (float)$data->purchasePrice; }
                if (isset($data->sellPrice)) { $fields[] = "sellPrice = :sellPrice"; $params[':sellPrice'] = (float)$data->sellPrice; }
                if (isset($data->accountInformation)) { $fields[] = "accountInformation = :accountInformation"; $params[':accountInformation'] = $data->accountInformation; }
                if (isset($data->cityId)) { $fields[] = "cityId = :cityId"; $params[':cityId'] = !empty($data->cityId) ? (int)$data->cityId : null; }
                if (isset($data->type)) { $fields[] = "type = :type"; $params[':type'] = in_array($data->type, ['value', 'perPeriod']) ? $data->type : 'value'; }
                if (isset($data->quantityDaysSold)) { $fields[] = "quantityDaysSold = :quantityDaysSold"; $params[':quantityDaysSold'] = (int)$data->quantityDaysSold; }
                if (isset($data->quantityDaysPurchased)) { $fields[] = "quantityDaysPurchased = :quantityDaysPurchased"; $params[':quantityDaysPurchased'] = (int)$data->quantityDaysPurchased; }

                $sql = "UPDATE creditPrepaid SET " . implode(", ", $fields) . " WHERE id = :id";
                GenericDao::execute($sql, $params);

                echo $this->returnSuccess('Pré-pago atualizado com sucesso');
                return;
            }

            if ($method === 'DELETE') {
                $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
                if (!$id) {
                    throw new Exception("ID do crédito pré-pago não informado.");
                }

                GenericDao::execute("UPDATE creditPrepaid SET deleted_at = NOW() WHERE id = :id", [':id' => $id]);
                echo $this->returnSuccess('Pré-pago apagado com sucesso');
                return;
            }

            throw new Exception("Método não suportado.");
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionList()
    {
        return $this->actionIndex();
    }

    public function actionPurchase()
    {
        try {
            $result = (new CreditPrepaidPurchaseService())
                ->purchase($this->request(false));

            echo $this->returnSuccess('Crédito solicitado', $result);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
    
    public function actionShow()
    {
        try {
            $result = (new CreditPrepaidPurchaseService())
                ->getCreditPrepaidPurchase($this->request(false)->creditPrepaidPurchaseId);

            echo $this->returnSuccess('Crédito solicitado', $result);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
