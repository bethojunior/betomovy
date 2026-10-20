<?php

namespace app\controllers;

use app\utils\BaseDao;
use Exception;

class AdvertisingAppSiteController extends ApiController
{
    public function actionIndex()
    {
        try {
            $dao = new BaseDao();
            $rows = $dao->sqlRawSelect("SELECT id, name FROM advertisingAppSite ORDER BY id ASC")->get();
            if (!is_array($rows)) {
                $rows = [];
            } else {
                foreach ($rows as &$r) {
                    $r['id'] = (int)$r['id'];
                }
            }

            echo $this->returnSuccess("Locais de anúncio", $rows);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
