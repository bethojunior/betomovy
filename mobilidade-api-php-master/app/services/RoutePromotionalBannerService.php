<?php


namespace app\services;
use app\dao\RoutePromotionalBannerDao;

class RoutePromotionalBannerService
{
    private $dao;

    /**
     * TermsUsePolicyService constructor.
     * @param null $conn
     */
    public function __construct()
    {
        $this->dao = new RoutePromotionalBannerDao;
    }


    public function findAll()
    {
        return $this->dao->sqlRawSelect("
            SELECT id,
                   CONCAT(:urls3, path) AS path,
                   statusId
            FROM routePromotionalBanner
            WHERE statusId = 1;
        ",
            [
                ':urls3' => env('S3_URL') . env('S3_BUCKET_NAME') . '/'
            ]
        )
            ->get();
    }
}