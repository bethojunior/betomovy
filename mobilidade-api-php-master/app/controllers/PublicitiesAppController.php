<?php

namespace app\controllers;

use app\dao\GenericDao;
use Exception;

class PublicitiesAppController extends ApiController
{
    public function actionIndex()
    {
        try {
            $method = $_SERVER['REQUEST_METHOD'];

            if ($method === 'GET') {
                $sql = "SELECT * FROM publicities_app WHERE deleted_at IS NULL ORDER BY id DESC";
                $rows = GenericDao::query($sql);
                $result = [];

                foreach ($rows as $r) {
                    $r['id'] = (int)$r['id'];
                    $result[] = $r;
                }

                echo $this->returnSuccess("Anúncios de aplicativo", $result);
                return;
            }

            if ($method === 'POST') {
                $data = $this->request(false);
                $companyName = $data->company_name ?? '';
                $title = $data->title ?? '';
                $subtitle = $data->subtitle ?? '';
                $link = $data->link ?? '';

                GenericDao::execute("INSERT INTO publicities_app (company_name, title, subtitle, link, created_at, updated_at) 
                                    VALUES (:company_name, :title, :subtitle, :link, NOW(), NOW())", [
                    ':company_name' => $companyName,
                    ':title' => $title,
                    ':subtitle' => $subtitle,
                    ':link' => $link
                ]);

                echo $this->returnSuccess("Anúncio cadastrado com sucesso");
                return;
            }

            if ($method === 'DELETE') {
                $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
                if (!$id) {
                    throw new Exception("ID do anúncio não informado.");
                }

                GenericDao::execute("UPDATE publicities_app SET deleted_at = NOW() WHERE id = :id", [':id' => $id]);
                echo $this->returnSuccess("Anúncio removido com sucesso");
                return;
            }

            throw new Exception("Método não suportado.");
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
