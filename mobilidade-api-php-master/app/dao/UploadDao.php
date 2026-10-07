<?php


namespace app\dao;

use app\model\Driver;
use app\model\Resource;
use app\utils\BaseDao;
use app\utils\File;
use app\utils\Photo;
use app\utils\S3;

class UploadDao extends BaseDao
{
    public function uploadFile($file, string $type): array
    {
        $directory = $this->getDirectoryByType($type);

        try {
            if ($this->isImageFile($file)) {
                $path = (new Photo)->save($file, $directory, null, S3::PUBLIC_READ);
            } else {
                $path = (new File)->save($file, $directory, null, S3::PUBLIC_READ);
            }

            $resource = new Resource();
            $resource->setFileName($this->formatFileName($file['name']));
            $resource->setPath($path);

            $resourceDao = new ResourceDao();

            $id = $resourceDao->sqlInsert($resource);
            if (!$id) {
                throw new \Exception('Erro ao salvar o recurso no banco de dados.');
            }

            return (array) $resourceDao->find($id, ['id', 'path']);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    private function formatFileName($fileName): string
    {
        $parts = explode('.', $fileName);
        return $parts[0] ?? 'file_' . time();
    }

    private function getDirectoryByType(string $type): string
    {
        switch ($type) {
            case 'driver-docs':
                return Driver::DOC_DIR;
            case 'driver-profile':
                return Driver::PROFILE_DIR;
            default:
                return 'uploads/';
        }
    }

    private function isImageFile($file): bool
    {
        if (isset($file['type'])) {
            return strpos(strtolower($file['type']), 'image/') === 0;
        }
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        return in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']);
    }
}
