<?php

namespace app\utils;

use Aws\Result;
use Exception;
use WideImage\WideImage;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 13/07/2018
 * Time: 15:23
 */
class Photo
{
    const WIDTH_FOR_RESIZE = 300;
    const HEIGHT_FOR_RESIZE = 300;

    const COMPRESSED_DIR = "compressed/";

    protected $s3;

    public function __construct()
    {
        $this->s3 = new S3;
    }

    /**
     * @param $photo
     * @param $destination
     * @param null $prefixName
     * @param string $ACL
     * @return string
     * @throws Exception
     */
    public function save($photo, $destination, $prefixName = null, $ACL = S3::PUBLIC_READ)
    {
        $this->ensureTempDirExists();

        $generatedName = $this->generateName($photo['name']);
        $name = $prefixName ? $prefixName . $generatedName : $generatedName;

        $fileType = $photo['type'];
        $fileType = explode('/', $fileType)[0];

        try {
            $link = $this->s3->uploadSingle($destination . $name, $photo['tmp_name'], $ACL);

            $tempFile = $fileType == 'video' ? $link['ObjectURL'] : $this->resize($photo, $name);

            $this->s3->uploadSingle($destination . self::COMPRESSED_DIR . $name, $tempFile, $ACL);

            $fileType != 'video' && unlink($tempFile);

            return $name;
        } catch (Exception $e) {
            throw $e;
        }

    }

    /**
     * @param $arrayPhotos
     * @param $destination
     * @param bool $compress
     * @return array
     * @throws Exception ,
     */
    public function saveMany($arrayPhotos, $destination, $compress = true)
    {
        if (!empty($arrayPhotos)) {
            $this->ensureTempDirExists();

            try {
                $sufix = 1;
                foreach ($arrayPhotos as $key => $photo) {
                    $name = $this->generateName($photo['name'], $sufix);
                    $imagesName[] = $name;

                    $this->s3->uploadSingle($destination . $name, $photo['tmp_name']);

                    if ($compress) {
                        $tempFile = $this->resize($photo, $name);
                        $this->s3->uploadSingle($destination . self::COMPRESSED_DIR . $name, $tempFile);
                        unlink($tempFile);
                    }

                    $sufix++;
                }

                if (!empty($imagesName))
                    return $imagesName;

                return [];
            } catch (Exception $e) {
                throw $e;
            }
        }
    }

    /**
     * @param $name
     * @param $dir
     * @return Result
     */
    public function remove($name, $dir)
    {
        return $this->s3->removeSingle($dir . $name);
    }

    /**
     * @param $tempPhotoName
     * @param int|string $sufix
     * @return string
     */
    private function generateName($tempPhotoName, $sufix = 1)
    {
        $name = explode('.', $tempPhotoName);
        $extension = '.' . end($name);
        $code = substr(UUID::v4(), 0, 20);

        return $code . $sufix . $extension;
    }

    private function resize($photo, $name)
    {
        $this->ensureTempDirExists();

        $dir = File::tempDir() . $name;

        copy($photo['tmp_name'], $dir);

        $img = WideImage::load($dir);
        $compressed = $img->resize(self::WIDTH_FOR_RESIZE, self::HEIGHT_FOR_RESIZE);
        $compressed->saveToFile($dir);

        return $dir;
    }

    private function ensureTempDirExists(): void
    {
        $dir = File::tempDir();

        if (is_dir($dir)) {
            return;
        }

        @mkdir($dir, 0775, true);
    }
}