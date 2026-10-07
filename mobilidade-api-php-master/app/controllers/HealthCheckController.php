<?php

namespace App\Controllers;

class HealthCheckController extends ApiController
{
    public function actionCheck()
    {
        echo $this->returnSuccess("API Health Check", ['status' => 'OK']);
    }
}
