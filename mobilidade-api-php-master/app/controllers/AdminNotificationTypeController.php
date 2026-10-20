<?php

namespace app\controllers;

use app\dao\GenericDao;
use Exception;

class AdminNotificationTypeController extends ApiController
{
    public function actionIndex()
    {
        try {
            $rows = GenericDao::query("SELECT id, name, notifiable, defaultMessage FROM adminNotificationType ORDER BY id ASC");
            foreach ($rows as &$r) {
                $r['id'] = (int)$r['id'];
            }
            echo $this->returnSuccess("Tipos de notificação", $rows);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
