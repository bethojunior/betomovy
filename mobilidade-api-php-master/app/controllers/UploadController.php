<?php

namespace app\controllers;

use app\dao\UploadDao;
use Exception;

class UploadController extends ApiController
{
    public function actionUploadFile()
    {
        try {
            if (!isset($_FILES['file'])) {
                throw new Exception('Arquivo não enviado.');
            }

            $type = $_POST['type'] ?? 'default';
            if (!in_array($type, ['driver-docs', 'driver-profile', 'default'])) {
                throw new Exception('Tipo de upload inválido.');
            }

            $uploadDao = new UploadDao();
            $data = $uploadDao->uploadFile($_FILES['file'], $type);

            echo $this->returnSuccess('Arquivo enviado com sucesso', $data);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
