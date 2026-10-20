<?php

namespace app\controllers;

use app\services\ConfigAppPartnerService;
use Exception;

class ConfigAppPartnerController extends ApiController
{
    public function actionGetConfigAppPartner()
    {
        try {
            $keyAppPartner = $_GET['app_partner'];
            $result = (new ConfigAppPartnerService)->getAppPartner($keyAppPartner);
            echo $this->returnSuccess("Configurações encontradas", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar configurações de apps parceiros");
        }
    }

    public function actionFind()
    {
        try {
            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RO);
            $stmt = $pdo->query("SELECT id, name_app, `key`, statusId FROM config_apps_partners WHERE (statusId = 1 OR statusId IS NULL)");
            $partners = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            foreach ($partners as &$p) {
                $p['id'] = (int)$p['id'];
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
        } catch (\Throwable $e) {
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

    public function actionFind_by_key()
    {
        try {
            $pathParts = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
            $key = end($pathParts);
            $result = (new ConfigAppPartnerService)->findByKey($key);
            echo $this->returnSuccess("Parceiro encontrado", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar parceiro");
        }
    }
}
