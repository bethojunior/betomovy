<?php


namespace app\controllers;
use app\services\TermsUsePolicyService;
use Exception;

class TermsUsePolicyController extends ApiController
{
    public function actionFindByType()
    {
        try {
            if (!$this->requestQuery()->type) throw new Exception('Tipo de termo não especificado!');

            $type = $this->requestQuery()->type;

            echo $this->returnSuccess('Termos encontrados', (new TermsUsePolicyService())->findByType($type));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

}