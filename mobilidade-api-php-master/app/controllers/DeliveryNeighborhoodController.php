<?php

namespace app\controllers;

use app\dao\GenericDao;
use Exception;

class DeliveryNeighborhoodController extends ApiController
{
    public function actionIndex()
    {
        try {
            $cityId = isset($_GET['cityId']) && !empty($_GET['cityId']) ? (int)$_GET['cityId'] : null;
            $where = ["deleted_at IS NULL"];
            $params = [];

            if ($cityId) {
                $where[] = "cityId = :cityId";
                $params[':cityId'] = $cityId;
            }

            $whereStr = implode(" AND ", $where);
            $rows = GenericDao::query("SELECT id, name, deliveryPrice, cityId FROM deliveryNeighborhood WHERE {$whereStr} ORDER BY name ASC", $params);
            foreach ($rows as &$r) {
                $r['id'] = (int)$r['id'];
                $r['deliveryPrice'] = (float)$r['deliveryPrice'];
                $r['cityId'] = (int)$r['cityId'];
            }

            echo $this->returnSuccess("Bairros de delivery", $rows);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
