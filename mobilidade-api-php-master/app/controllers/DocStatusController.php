<?php

namespace app\controllers;

use app\utils\BaseDao;
use Exception;

class DocStatusController extends ApiController
{
    public function actionIndex()
    {
        try {
            $dao = new BaseDao();
            $rows = $dao->sqlRawSelect("SELECT id, name FROM docStatus ORDER BY id ASC")->get();
            if (!is_array($rows)) {
                $rows = [];
            } else {
                foreach ($rows as &$r) {
                    $r['id'] = (int)$r['id'];
                }
            }

            echo $this->returnSuccess("Status de documentos", $rows);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
