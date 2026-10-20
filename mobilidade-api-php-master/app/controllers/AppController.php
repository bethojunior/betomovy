<?php

namespace app\controllers;

use app\dao\GenericDao;
use app\services\AppVersionService;
use Exception;

class AppController extends ApiController
{
    public function actionIndex()
    {
        try {
            $rows = GenericDao::query("SELECT idApp, name, version, isCritical, link_store, statusId FROM app WHERE statusId = 1 ORDER BY idApp ASC");
            $result = [];
            foreach ($rows as $r) {
                $r['id'] = (int)$r['idApp'];
                $r['idApp'] = (int)$r['idApp'];
                $r['statusId'] = (int)$r['statusId'];
                $result[] = $r;
            }
            echo $this->returnSuccess("Aplicativos", $result);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionCheckVersion()
    {
        $service = new AppVersionService;

        try {
            echo $this->returnSuccess("Versão do app",
                $service->checkVersion($this->request(false)->app)
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao inserir informação");
        }
    }

    public function actionGetAppClientVersion()
    {
        $service = new AppVersionService;

        try {
            echo $this->returnSuccess("Versões do app Cliente",
                $service->getAppClientVersions()
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar versões");
        }
    }

    public function actionGetAppDriverVersion()
    {
        $service = new AppVersionService;

        try {
            echo $this->returnSuccess("Versões do app Motorista",
                $service->getAppDriverVersions()
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar versões");
        }
    }

    public function actionGetAppIosClientVersions()
    {
        $service = new AppVersionService;

        try {
            echo $this->returnSuccess("Versões do app Cliente IOS",
                $service->getAppIosClientVersions()
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar versões");
        }
    }

    public function actionGetAppIosDriverVersions()
    {
        $service = new AppVersionService;

        try {
            echo $this->returnSuccess("Versões do app Motorista IOS",
                $service->getAppIosDriverVersions()
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar versões");
        }
    }
}
