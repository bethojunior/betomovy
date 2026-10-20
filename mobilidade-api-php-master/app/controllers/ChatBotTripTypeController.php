<?php

namespace app\controllers;

use app\utils\BaseDao;
use Exception;

class ChatBotTripTypeController extends ApiController
{
    public function actionIndex()
    {
        try {
            $dao = new BaseDao();
            $rows = $dao->sqlRawSelect("SELECT id, name FROM chatBotTripType ORDER BY id ASC")->get();
            if (!is_array($rows)) {
                $rows = [];
            } else {
                foreach ($rows as &$r) {
                    $r['id'] = (int)$r['id'];
                }
            }
            echo $this->returnSuccess("Tipos de mensagens do chat", $rows);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
