<?php

namespace app\controllers;

use app\dao\GenericDao;
use Exception;

class AdvertisingAppSiteController extends ApiController
{
    public function actionIndex()
    {
        try {
            $rows = GenericDao::query("SELECT id, name FROM advertisingAppSite ORDER BY id ASC");
            foreach ($rows as &$r) {
                $r['id'] = (int)$r['id'];
            }
            echo $this->returnSuccess("Locais de anúncio", $rows);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
