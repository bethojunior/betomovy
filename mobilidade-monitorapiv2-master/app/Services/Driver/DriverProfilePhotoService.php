<?php

namespace App\Services\Driver;

use App\Constants\Users\DocStatusConst;
use App\Models\User\Driver;
use App\Repositories\User\DriverRepository;
use App\Traits\Storage\UploadsFilesToS3;

class DriverProfilePhotoService
{
    use UploadsFilesToS3;

    /**
     * @var DriverRepository
     */
    private $repository;

    public function __construct(DriverRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * @param $driverId
     * @param array $request
     * @return Driver
     * @throws \Exception
     */
    public function uploadProfilePhoto($driverId, array $request)
    {
        /** @var Driver $driver */
        $driver = $this->repository->find($driverId);

        if (!$driver)
            throw new \Exception("Motorista não encontrado");

        $oldFileName = $driver->profileImage;
        $fileName = $this->generateFileName($request['image']);

        if ($oldFileName) {
            $this->deleteFile('driver/profile/', $oldFileName);
            $this->deleteFile('driver/profile/compressed/', $oldFileName);
        }

        $this->putFile($request['image'], 'driver/profile/', $fileName);
        $this->putFile($request['imageCompressed'] ?? $request['image'], 'driver/profile/compressed/', $fileName);

        $driver->profileImage = $fileName;
        $driver->profileImageTemp = null;
        $driver->profileImageStatusId = DocStatusConst::APPROVED;

        $this->repository->save($driver);

        return $driver;
    }
}
