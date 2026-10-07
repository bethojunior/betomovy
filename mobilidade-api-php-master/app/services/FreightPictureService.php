<?php

namespace app\services;

use app\dao\FreightPictureDao;
use app\utils\Photo;
use Exception;
use app\model\FreightPicture;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/09/2019
 * Time: 14:58
 */
class FreightPictureService
{
    private $dao;
    private $photo;

    public function __construct()
    {
        $this->dao = new FreightPictureDao;
        $this->photo = new Photo;
    }

    /**
     * @param $tripReference
     * @param $pictures
     * @return array
     * @throws Exception
     */
    public function uploadImages($tripReference, $pictures)
    {
        $this->validateRequest($pictures);

        $picturesName = $this->photo
            ->saveMany($pictures, "freight/{$tripReference}/", false);

        $freightPicture = new FreightPicture;
        $freightPicture
            ->setTripReference($tripReference)
            ->setPictures(json_encode($picturesName))
            ->setId($this->dao->sqlInsert($freightPicture));

        return $freightPicture->toArray();
    }

    /**
     * @param $files
     * @throws Exception
     */
    private function validateRequest($files)
    {
        if (empty($files))
            throw new Exception("Nenhuma imagem foi enviada");
    }
}