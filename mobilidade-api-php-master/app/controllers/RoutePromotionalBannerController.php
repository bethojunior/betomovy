<?php


namespace app\controllers;
use app\services\RoutePromotionalBannerService;
use Exception;

class RoutePromotionalBannerController extends ApiController
{
    public function actionFindAll()
    {
        try {
            echo $this->returnSuccess('Banners encontrados', (new RoutePromotionalBannerService())->findAll());
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}