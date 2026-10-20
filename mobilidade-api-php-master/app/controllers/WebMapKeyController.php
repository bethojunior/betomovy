<?php

namespace app\controllers;

use app\model\Config;
use app\utils\BaseDao;
use Exception;

class WebMapKeyController extends ApiController
{
    public function actionIndex()
    {
        try {
            $method = $_SERVER['REQUEST_METHOD'];
            $dao = new BaseDao();

            if ($method === 'GET') {
                $row = $dao->sqlRawSelect("SELECT * FROM webMapKey WHERE deleted_at IS NULL ORDER BY id DESC LIMIT 1")->first();
                $key = $row['key'] ?? null;

                if (empty($key)) {
                    $key = Config::get('google_maps_api_key') ?: (Config::get('map_key') ?: '');
                }

                $response = [
                    'id' => $row['id'] ?? 1,
                    'key' => $key
                ];

                echo $this->returnSuccess("Chave do mapa", $response);
                return;
            }

            if ($method === 'POST') {
                $data = $this->request(false);
                $key = $data->key ?? '';

                $dao->sqlRawSelect("INSERT INTO webMapKey (`key`, created_at, updated_at) VALUES (:key, NOW(), NOW())", [
                    ':key' => $key
                ]);

                echo $this->returnSuccess("Chave salva com sucesso");
                return;
            }

            throw new Exception("Método não suportado.");
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
