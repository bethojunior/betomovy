<?php

namespace app\controllers;

use app\dao\GenericDao;
use Exception;

class DeliverySectionController extends ApiController
{
    public function actionIndex()
    {
        return $this->actionAll();
    }

    public function actionAll()
    {
        try {
            $rows = GenericDao::query("SELECT id, name, description, icon FROM deliverySection WHERE deleted_at IS NULL ORDER BY id ASC");
            foreach ($rows as &$r) {
                $r['id'] = (int)$r['id'];
            }
            echo $this->returnSuccess("Seções de delivery", $rows);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
