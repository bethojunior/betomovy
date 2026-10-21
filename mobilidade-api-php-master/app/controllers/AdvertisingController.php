<?php

namespace app\controllers;

use app\dao\GenericDao;
use app\services\AdvertisingService;
use Exception;

class AdvertisingController extends ApiController
{
    public function actionIndex()
    {
        try {
            $cityId = isset($_GET['cityId']) && !empty($_GET['cityId']) ? (int)$_GET['cityId'] : null;

            $where = ["a.statusId = 1"];
            $params = [];

            if ($cityId) {
                $where[] = "(a.cityId = :cityId OR a.cityId IS NULL)";
                $params[':cityId'] = $cityId;
            }

            $whereStr = implode(" AND ", $where);
            $sql = "SELECT a.*, 
                           c.name AS companyName,
                           c.fantasyName AS companyFantasyName,
                           ci.nome AS cityName
                    FROM advertising a
                    LEFT JOIN company c ON c.idCompany = a.companyId
                    LEFT JOIN city ci ON ci.id = a.cityId
                    WHERE {$whereStr}
                    ORDER BY a.id DESC";

            $rows = GenericDao::query($sql, $params);
            $result = [];

            foreach ($rows as $r) {
                $r['id'] = (int)$r['id'];
                $r['companyId'] = (int)$r['companyId'];
                $r['statusId'] = (int)$r['statusId'];
                $result[] = $r;
            }

            echo $this->returnSuccess("Publicidades", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao listar publicidades");
        }
    }

    public function actionGet()
    {
        try {
            echo $this->returnSuccess(
                "Publicidade encontrada com sucesso",
                (new AdvertisingService)->findByCoordinate($this->requestQuery())
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar publicidade");
        }
    }

    public function actionList()
    {
        try {
            echo $this->returnSuccess(
                "Publicidade encontrada com sucesso",
                (new AdvertisingService)->findAllByCoordinate($this->requestQuery())
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar publicidade");
        }
    }
}
