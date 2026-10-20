<?php

namespace app\controllers;

use app\dao\GenericDao;
use app\model\Config;
use Exception;

class WebMapKeyController extends ApiController
{
    public function actionIndex()
    {
        try {
            $method = $_SERVER['REQUEST_METHOD'];

            if ($method === 'GET') {
                $row = GenericDao::first("SELECT * FROM webMapKey WHERE deleted_at IS NULL ORDER BY id DESC LIMIT 1");
                $key = $row['key'] ?? null;

                if (empty($key)) {
                    $key = Config::get('google_maps_api_key') ?: (Config::get('map_key') ?: '');
                }

                $response = [
                    'id' => (int)($row['id'] ?? 1),
                    'key' => $key
                ];

                echo $this->returnSuccess("Chave do mapa", $response);
                return;
            }

            if ($method === 'POST') {
                $data = $this->request(false);
                $key = $data->key ?? '';

                GenericDao::execute("INSERT INTO webMapKey (`key`, created_at, updated_at) VALUES (:key, NOW(), NOW())", [
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
