<?php

namespace app\controllers;
use app\services\AppVersionService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 07/03/2019
 * Time: 11:27
 */
class AppController extends ApiController
{
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
            echo $this->returnError($e, "Erro ao inserir informação");
        }
    }

    public function actionGetAppIOSClientVersions()
    {
        $service = new AppVersionService;

        try {
            echo $this->returnSuccess("Versões do app Cliente",
                $service->findAppIOSClientVersions()
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao inserir informação");
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
            echo $this->returnError($e, "Erro ao inserir informação");
        }
    }

    public function actionGetDefaultAppLogo()
    {
        $service = new AppVersionService;

        try {
            echo $this->returnSuccess("Logo da aplicação",
                $service->getDefaultAppLogo()
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar logo");
        }
    }
}