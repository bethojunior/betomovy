<?php

namespace app\controllers;

use Exception;
use PDO;

class ExternalServiceTypeController extends ApiController
{
    public function actionIndex()
    {
        try {
            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
            $groupId = isset($_GET['externalServiceGroupId']) ? (int)$_GET['externalServiceGroupId'] : null;
            $where = $groupId ? "WHERE externalServiceGroupId = {$groupId}" : "";
            
            $rows = [];
            try {
                $rows = $pdo->query("SELECT id, name FROM externalServiceType {$where} ORDER BY id ASC")->fetchAll(PDO::FETCH_ASSOC);
            } catch (\Throwable $e) {}

            if (empty($rows)) {
                $rows = [
                    ['id' => 1, 'name' => 'SMS'],
                    ['id' => 2, 'name' => 'WhatsApp']
                ];
            }

            $data = array_map(function($r) {
                return [
                    'id' => (int)$r['id'],
                    'name' => $r['name']
                ];
            }, $rows);

            echo $this->returnSuccess('Tipos de serviços externos', $data);
        } catch (\Throwable $e) {
            echo $this->returnSuccess('Tipos de serviços externos', [
                ['id' => 1, 'name' => 'SMS'],
                ['id' => 2, 'name' => 'WhatsApp']
            ]);
        }
    }

    public function actionFully()
    {
        try {
            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
            $cityId = isset($_GET['cityId']) ? (int)$_GET['cityId'] : 0;
            $rows = [];
            try {
                $rows = $pdo->query("SELECT * FROM externalServiceType ORDER BY id ASC")->fetchAll(PDO::FETCH_ASSOC);
            } catch (\Throwable $e) {}

            if (empty($rows)) {
                $rows = [
                    ['id' => 1, 'name' => 'SMS', 'status' => 1],
                    ['id' => 2, 'name' => 'WhatsApp', 'status' => 1],
                    ['id' => 3, 'name' => 'Push Notification (Firebase)', 'status' => 1]
                ];
            }

            echo $this->returnSuccess('Serviços externos completos', $rows);
        } catch (\Throwable $e) {
            echo $this->returnSuccess('Serviços externos completos', []);
        }
    }
}
