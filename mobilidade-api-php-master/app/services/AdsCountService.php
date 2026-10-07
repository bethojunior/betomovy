<?php


namespace app\services;

use app\model\AdsCount;
use app\dao\AdsCountDao;
use app\utils\Headers;
use Exception;

class AdsCountService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new AdsCountDao();
    }

    public function insert($request)
    {
        if (!isset($request->menuAppId) && !isset($request->advertisingId)) {
            throw new Exception("Dados incompletos!");
        }

        $adsCount = new AdsCount();

        $adsCount
            ->setMenuAppId($request->menuAppId ?? null)
            ->setAdvertisingId($request->advertisingId ?? null)
            ->setUserId(Headers::getUserId())
            ->setCreatedAt(now())
            ->setId($this->dao->sqlInsert($adsCount));

        return $adsCount->toArray();
    }
}