<?php

namespace app\controllers;

use app\dao\LocationDao;
use app\services\LocationService;
use Exception;
use app\model\Location;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 16/07/2018
 * Time: 16:10
 */
class LocationController extends ApiController
{

    /**
     * @deprecated A localização do motorista agora é atualizada pela API Node. Esta rota
     * continua acessível (o app ainda a chama), mas não atualiza mais last_lat/last_lon.
     */
    public function actionInsert()
    {
        try {
            $location = new Location($this->request());
            echo $this->returnSuccess(
                "Sucesso. [DEPRECATED] Localização do motorista agora é atualizada pela API Node — esta rota não executa mais essa lógica.",
                (new LocationDao)->insert($location)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionInsertV2()
    {
        try {
            echo $this->returnSuccess(
                "Sucesso",
                (new LocationService)->insert($this->request(false))
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionInsertByUser()
    {
        try {
            $location = new Location($this->request(false));

            echo $this->returnSuccess("Sucesso", (new LocationDao)->insertByUser($location));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionRoute()
    {
        try {
            $body     = $this->request(false);
            $tripRef  = is_object($body) ? ($body->tripReference ?? null) : null;
            $position = is_object($body) ? ($body->position ?? null) : null;
            $lat      = (is_object($position) && isset($position->lat)) ? (float) $position->lat : null;
            $lng      = (is_object($position) && isset($position->lng)) ? (float) $position->lng : null;
            $driverId = (is_object($body) && isset($body->idDriver))    ? (int)   $body->idDriver : null;

            if ($tripRef && $lat !== null && $lng !== null) {
                (new LocationDao)->saveRoutePosition($tripRef, $lat, $lng, $driverId);
                error_log("[actionRoute] GPS salvo trip={$tripRef} lat={$lat} lng={$lng}");
            }

            echo $this->returnSuccess("Sucesso", true);
        } catch (Exception $e) {
            error_log("[actionRoute] ERRO: " . $e->getMessage());
            echo $this->returnError($e);
        }
    }
}
