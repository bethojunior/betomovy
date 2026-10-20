<?php

namespace app\controllers;

use app\dao\AppConfigDao;
use app\services\AppConfigService;
use Exception;

class AppConfigController extends ApiController
{
    public function actionIndex()
    {
        try {
            $dao = new AppConfigDao();
            $sql = "SELECT a.idApp AS appId,
                           a.name AS appName,
                           COALESCE(c.id, a.idApp) AS id,
                           COALESCE(c.mainColor, '#00C48C') AS mainColor,
                           COALESCE(c.mainColorText, '#FFFFFF') AS mainColorText,
                           COALESCE(c.secondaryColor, '#0A2540') AS secondaryColor,
                           COALESCE(c.secondaryColorText, '#FFFFFF') AS secondaryColorText,
                           COALESCE(c.logo, '') AS logo,
                           COALESCE(c.name, a.name) AS name
                    FROM app a
                    LEFT JOIN appConfig c ON c.appId = a.idApp AND c.deleted_at IS NULL
                    WHERE a.statusId = 1";

            $result = $dao->sqlRawSelect($sql)->get();
            if (!is_array($result)) {
                $result = [];
            } else {
                foreach ($result as &$row) {
                    $row['id'] = (int)$row['id'];
                    $row['appId'] = (int)$row['appId'];
                }
            }

            echo $this->returnSuccess("Configurações de aplicativos", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar configurações de aplicativo");
        }
    }

    public function actionFindByApp()
    {
        try {
            $appId = $this->request(false)->appId ?? ($this->requestQuery()->appId ?? null);
            if (!$appId) {
                throw new Exception("AppId não informado.");
            }

            $result = (new AppConfigService())->findByApp($appId);
            echo $this->returnSuccess("Busca de configuração por app", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar configuração por app");
        }
    }
}
