<?php


namespace app\utils;

use Aws\Result;
use Exception;

class File
{
    protected $s3;

    public function __construct()
    {
        $this->s3 = new S3;
    }

    public static function tempDir(): string
    {
        return dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'storage' . DIRECTORY_SEPARATOR . 'temp' . DIRECTORY_SEPARATOR;
    }

    public function save($file, $destination, $prefixName = null, $ACL = S3::PUBLIC_READ)
    {
        $this->ensureTempDirExists();

        $generatedName = $this->generateName($file['name']);
        $name = $prefixName ? $prefixName . $generatedName : $generatedName;

        try {
            $this->s3->uploadSingle($destination . $name, $file['tmp_name'], $ACL);

            return $name;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $arrayFiles
     * @param $destination
     * @return array
     * @throws Exception
     */
    public function saveMany($arrayFiles, $destination)
    {
        if (!empty($arrayFiles)) {
            $this->ensureTempDirExists();

            try {
                $sufix = 1;
                foreach ($arrayFiles as $key => $file) {
                    $name = $this->generateName($file['name'], $sufix);
                    $filesName[] = $name;

                    $this->s3->uploadSingle($destination . $name, $file['tmp_name']);

                    $sufix++;
                }

                if (!empty($filesName))
                    return $filesName;

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
     * Move um arquivo de um diretório para outro (no S3 ou local).
     *
     * @param string $fileName Nome do arquivo (ex: foto.jpg)
     * @param string $fromDir Diretório de origem (ex: 'temp/')
     * @param string $toDir Diretório de destino (ex: 'uploads/')
     * @param string $ACL Permissão do arquivo no S3 (opcional)
     * @return bool
     * @throws Exception
     */
    public function move($fileName, $fromDir, $toDir, $ACL = S3::PUBLIC_READ)
    {
        try {
            $this->s3->copySingle($fromDir . $fileName, $toDir . $fileName, $ACL);
            $this->s3->removeSingle($fromDir . $fileName);

            return true;
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
        $extension = '.' . end($name);
        return strtotime(date('Y-m-d H:i:s')) . $sufix . $extension;
    }

    private function ensureTempDirExists(): void
    {
        $dir = self::tempDir();

        if (is_dir($dir)) {
            return;
        }

        @mkdir($dir, 0775, true);
    }
}
