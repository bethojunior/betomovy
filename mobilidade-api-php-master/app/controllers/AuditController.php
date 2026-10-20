<?php

namespace app\controllers;

use app\dao\GenericDao;
use Exception;

class AuditController extends ApiController
{
    public function actionIndex()
    {
        try {
            $sql = "SELECT id, name, email, phone, message, created_at, statusId 
                    FROM audit 
                    ORDER BY id DESC 
                    LIMIT 200";

            $rows = GenericDao::query($sql);
            $result = [];

            foreach ($rows as $r) {
                $r['id'] = (int)$r['id'];
                $r['statusId'] = (int)($r['statusId'] ?? 1);
                $result[] = $r;
            }

            echo $this->returnSuccess("Mensagens de auditoria", $result);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
