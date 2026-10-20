<?php

namespace app\controllers;

use app\dao\TermsUsePolicyDao;
use app\services\TermsUsePolicyService;
use Exception;

class TermsUsePolicyController extends ApiController
{
    public function actionIndex()
    {
        try {
            $dao = new TermsUsePolicyDao();
            $result = $dao->sqlRawSelect("SELECT id, type, description FROM termsUsePolicy ORDER BY id ASC")->get();
            echo $this->returnSuccess('Termos de política de uso', $result);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionUpdate()
    {
        try {
            $data = $this->request(false);
            $type = isset($data->type) ? trim($data->type) : '';
            $description = isset($data->description) ? trim($data->description) : '';

            if (empty($type)) {
                throw new Exception("Tipo não informado.");
            }

            $dao = new TermsUsePolicyDao();
            $exists = $dao->sqlRawSelect("SELECT id FROM termsUsePolicy WHERE type = :type", [':type' => $type])->first();

            if ($exists) {
                $dao->sqlRawSelect("UPDATE termsUsePolicy SET description = :description WHERE type = :type", [
                    ':description' => $description,
                    ':type' => $type
                ]);
            } else {
                $dao->sqlRawSelect("INSERT INTO termsUsePolicy (type, description) VALUES (:type, :description)", [
                    ':type' => $type,
                    ':description' => $description
                ]);
            }

            echo $this->returnSuccess('Termos atualizados com sucesso');
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

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
