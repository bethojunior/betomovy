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

        $fileType = $photo['type'] ?? 'image/jpeg';
        $fileType = explode('/', $fileType)[0];

        // 1. Prepare local public destination directories
        $publicBase = realpath(__DIR__ . '/../../public') ?: (__DIR__ . '/../../public');
        $localDestDir = rtrim($publicBase, '/\\') . '/' . trim($destination, '/\\') . '/';
        $localCompressedDir = $localDestDir . self::COMPRESSED_DIR;

        if (!is_dir($localDestDir)) {
            @mkdir($localDestDir, 0775, true);
        }
        if (!is_dir($localCompressedDir)) {
            @mkdir($localCompressedDir, 0775, true);
        }

        // Save local copy of original file
        @copy($photo['tmp_name'], $localDestDir . $name);

        // Generate compressed file
        $tempFile = null;
        if ($fileType !== 'video') {
            $tempFile = $this->resize($photo, $name);
            // Save local copy of compressed file
            if ($tempFile && file_exists($tempFile)) {
                @copy($tempFile, $localCompressedDir . $name);
            }
        }

        // 2. Upload to S3 / MinIO — falha deve propagar (senão o app "acha" que salvou)
        try {
            $this->s3->uploadSingle($destination . $name, $photo['tmp_name'], $ACL);
            $uploadFile = $fileType == 'video' ? $photo['tmp_name'] : $tempFile;

            if ($uploadFile && file_exists($uploadFile)) {
                $this->s3->uploadSingle($destination . self::COMPRESSED_DIR . $name, $uploadFile, $ACL);
            } elseif ($fileType !== 'video') {
                throw new Exception('Falha ao gerar/enviar foto comprimida de perfil');
            }
        } catch (\Throwable $e) {
            error_log("Photo::save S3 upload error: " . $e->getMessage());
            throw new Exception('Erro ao enviar foto para o armazenamento: ' . $e->getMessage());
        } finally {
            if ($fileType != 'video' && $tempFile && file_exists($tempFile)) {
                @unlink($tempFile);
            }
        }

        return $name;
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
        $publicBase = realpath(__DIR__ . '/../../public') ?: (__DIR__ . '/../../public');
        $localFile = rtrim($publicBase, '/\\') . '/' . trim($dir, '/\\') . '/' . $name;
        $localCompressed = rtrim($publicBase, '/\\') . '/' . trim($dir, '/\\') . '/' . self::COMPRESSED_DIR . $name;
        if (file_exists($localFile)) @unlink($localFile);
        if (file_exists($localCompressed)) @unlink($localCompressed);

        try {
            return $this->s3->removeSingle($dir . $name);
        } catch (\Throwable $e) {
            return null;
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