<?php

namespace app\controllers;

use app\dao\GenericDao;
use Exception;

class DeliveryCallConfigController extends ApiController
{
    public function actionIndex()
    {
        try {
            $method = $_SERVER['REQUEST_METHOD'];

            if ($method === 'GET') {
                $rows = GenericDao::query("SELECT id, `key`, value, description, fieldType FROM deliveryCallConfig ORDER BY id ASC");
                foreach ($rows as &$r) {
                    $r['id'] = (int)$r['id'];
                }
                echo $this->returnSuccess("Configurações de chamada de delivery", $rows);
                return;
            }

            if ($method === 'PUT' || $method === 'POST') {
                $data = $this->request(false);
                if (is_array($data) || is_object($data)) {
                    foreach ($data as $key => $val) {
                        GenericDao::execute("UPDATE deliveryCallConfig SET value = :val WHERE `key` = :key", [
                            ':val' => (string)$val,
                            ':key' => $key
                        ]);
                    }
                }
                echo $this->returnSuccess("Configurações atualizadas com sucesso");
                return;
            }

            throw new Exception("Método não suportado.");
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
