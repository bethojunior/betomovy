<?php

namespace app\controllers;

use app\utils\BaseDao;
use Exception;

class AuditController extends ApiController
{
    public function actionIndex()
    {
        try {
            $dao = new BaseDao();
            $sql = "SELECT id, name, email, phone, message, created_at, statusId 
                    FROM audit 
                    ORDER BY id DESC 
                    LIMIT 200";

            $rows = $dao->sqlRawSelect($sql)->get();
            $result = is_array($rows) ? $rows : [];

            foreach ($result as &$r) {
                $r['id'] = (int)$r['id'];
                $r['statusId'] = (int)($r['statusId'] ?? 1);
            }

            echo $this->returnSuccess("Mensagens de auditoria", $result);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
