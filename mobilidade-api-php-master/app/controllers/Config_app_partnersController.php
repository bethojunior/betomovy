<?php

namespace app\controllers;

use app\utils\Connection;
use Exception;
use PDO;

class Config_app_partnersController extends ApiController
{
    public function actionIndex()
    {
        $this->actionFind();
    }

    public function actionFind()
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL_RO);
            $stmt = $pdo->query("SELECT id, name_app, `key`, statusId FROM config_apps_partners WHERE (statusId = 1 OR statusId IS NULL)");
            $partners = $stmt->fetchAll(PDO::FETCH_ASSOC);

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
        } catch (Exception $e) {
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
}
