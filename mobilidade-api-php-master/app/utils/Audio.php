<?php

namespace app\utils;

use Exception;

/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 17/01/2019
 * Time: 15:11
 */
class Audio
{

    private $s3;

    public function __construct()
    {
        $this->s3 = new S3;
    }

    /**
     * @param $audio
     * @param $destination
     * @param null $prefixName
     * @param string $ACL
     * @return string
     * @throws Exception
     */
    public function save($audio, $destination, $prefixName = null, $ACL = S3::PUBLIC_READ)
    {
        $generatedName = $this->generateName($audio['name']);
        $name = $prefixName ? $prefixName . $generatedName : $generatedName;

        try {
            $this->s3->uploadSingle($destination . $name, $audio['tmp_name'], $ACL);

            return $name;
        } catch (Exception $e) {
            throw $e;
        }

    }

    /**
     * @param $tempPhotoName
     * @param int|string $sufix
     * @return string
     */
    private function generateName($tempPhotoName, $sufix = 1)
    {
        $name = explode('.', $tempPhotoName);
        $extension = '.'.end($name);
        return strtotime(date('Y-m-d H:i:s')).$sufix.$extension;
    }

}