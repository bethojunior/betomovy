<?php

namespace app\services;
use app\dao\TripTypeDao;
use app\dao\TripTypeDriverDao;
use app\model\Config;
use Exception;
use stdClass;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/07/2019
 * Time: 16:38
 */
class TripTypeService
{
    private $dao;
    /**
     * @var TripTypeDao
     */
    private $tripTypeDriverDao;

    public function __construct()
    {
        $this->dao = new TripTypeDao;
        $this->tripTypeDriverDao = new TripTypeDriverDao;
    }

    public function findActives()
    {
        $link_storage_pictures = Config::get('link_storage_pictures');

        return array_map(function ($tripType) use ($link_storage_pictures) {
            $tripType->picture = $link_storage_pictures . 'tripType/' . $tripType->picture;

            return $tripType;
        }, $this->dao
            ->getActives());
    }

    public function findByLocale(stdClass $request)
    {
        if (!isset($request->latlng))
            throw new Exception('Coordenadas não enviadas');

        list($lat, $lng) = explode(',', $request->latlng);

        $result = $this->dao->findByLocale($lat, $lng);

        if (!$result)
            throw new Exception("Não existem tarifas para essa cidade");

        $link_storage_pictures = Config::get('link_storage_pictures');

        return array_map(function ($tripType) use ($link_storage_pictures) {
            $tripType->fullPicture = $link_storage_pictures . 'tripType/' . $tripType->picture;

            $tripType->tripTypeDrivers = $this->tripTypeDriverDao
                ->findDriverTypes($tripType->tripTypeId);

            return $tripType;
        }, $result);
    }
}