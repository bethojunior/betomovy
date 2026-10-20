<?php

namespace app\controllers;

use app\dao\GenericDao;
use Exception;

class TypeDeliveryCategoryController extends ApiController
{
    public function actionIndex()
    {
        try {
            $rows = GenericDao::query("SELECT id, name, description, statusId FROM typeDeliveryCategory WHERE statusId = 1 ORDER BY id ASC");
            foreach ($rows as &$r) {
                $r['id'] = (int)$r['id'];
                $r['statusId'] = (int)$r['statusId'];
            }

            echo $this->returnSuccess("Categorias de delivery", $rows);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
