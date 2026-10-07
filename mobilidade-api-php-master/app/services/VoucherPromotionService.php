<?php


namespace app\services;
use app\dao\VoucherPromotionDao;

class VoucherPromotionService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new VoucherPromotionDao();
    }

    public function findAll($request)
    {
        return $this->dao->findAll($request);
    }

}