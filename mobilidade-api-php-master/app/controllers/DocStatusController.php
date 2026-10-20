<?php

namespace app\controllers;

use app\dao\GenericDao;
use Exception;

class DocStatusController extends ApiController
{
    public function actionIndex()
    {
        try {
            $rows = GenericDao::query("SELECT id, name FROM docStatus ORDER BY id ASC");
            foreach ($rows as &$r) {
                $r['id'] = (int)$r['id'];
            }
            echo $this->returnSuccess("Status de documentos", $rows);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
