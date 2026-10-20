<?php

namespace app\controllers;

use app\dao\GenericDao;
use Exception;

class ChatBotTripTypeController extends ApiController
{
    public function actionIndex()
    {
        try {
            $rows = GenericDao::query("SELECT id, name FROM chatBotTripType ORDER BY id ASC");
            foreach ($rows as &$r) {
                $r['id'] = (int)$r['id'];
            }
            echo $this->returnSuccess("Tipos de mensagens do chat", $rows);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
