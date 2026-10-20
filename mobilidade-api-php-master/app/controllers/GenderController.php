<?php

namespace app\controllers;

use app\dao\GenericDao;
use Exception;

class GenderController extends ApiController
{
    public function actionIndex()
    {
        try {
            $rows = GenericDao::query("SELECT id, name FROM gender ORDER BY id ASC");
            foreach ($rows as &$r) {
                $r['id'] = (int)$r['id'];
            }
            echo $this->returnSuccess("Gêneros", $rows);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
