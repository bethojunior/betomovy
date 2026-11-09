<?php

namespace app\controllers;

class DatabaseVersionController extends ApiController
{
    public function actionIndex()
    {
        echo $this->returnSuccess('Versão da base de dados', [
            'version' => '1.0.0 (MySQL 8.0 & DigitalOcean Managed)',
            'realtime' => true,
            'mongodb' => true,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    }
}
