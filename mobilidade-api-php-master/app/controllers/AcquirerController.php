<?php

namespace app\controllers;

use app\services\AcquirerService;
use app\validator\AcquirerValidator;

class AcquirerController extends ApiController
{
    private AcquirerService $acquirerService;

    public function __construct()
    {
        $this->acquirerService = new AcquirerService();
    }

    public function actionCurrent()
    {
        try {
            $request = $this->request(false);
            
            AcquirerValidator::validate($request);
            
            $acquirer = $this->acquirerService->getActiveAcquirerData(
                $request->payment_form_id,
                $request->city_id
            );

            $acquirer->setConfigs([]);

            echo $this->returnSuccess('Sucesso ao buscar adquirente ativo', $acquirer->toArray());
        } catch (\Exception $e) {
            echo $this->returnError($e, 'Erro ao buscar adquirente ativo', 400);
        }
    }
}
