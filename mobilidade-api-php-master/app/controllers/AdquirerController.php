<?php

namespace app\controllers;

use app\services\Adquirer\AdquirerService;

/**
 * @deprecated Use AcquirerController instead
 */
class AdquirerController extends ApiController
{
    /**
    * @deprecated Use AcquirerController actionCurrentAdquirer instead
    */
    public function actionCurrentAdquirer()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess(
                'Sucesso. [DEPRECATED] Use Acquirer/Current em vez de Adquirer/CurrentAdquirer.',
                (new AdquirerService())->currentAdquirer($request));
        } catch (\Exception $e) {
            echo $this->returnError($e, 'Erro ao buscar adquirente ativo', 400);
        }
    }
}
