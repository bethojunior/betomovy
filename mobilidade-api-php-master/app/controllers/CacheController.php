<?php

namespace app\controllers;

use app\services\CacheService;
use Exception;

class CacheController extends ApiController
{
  private $service;
  public function __construct($params = null)
  {
    $this->service = new CacheService;
  }
    public function actionGet()
    {
        try {
            echo $this->returnSuccess("Cache encontrado",
            $this->service->get($this->request())
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionSet()
    {
        try {
            echo $this->returnSuccess("Inserido no cache",
            $this->service->set($this->request())
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionDelete()
    {
        try {
            echo $this->returnSuccess("Deletado do cache",
            $this->service->delete($this->request())
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}