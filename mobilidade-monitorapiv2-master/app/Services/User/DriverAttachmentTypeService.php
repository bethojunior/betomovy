<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 06/07/2020
 * Time: 10:18
 */

namespace App\Services\User;

use App\Models\User\Driver\DriverAttachmentType;
use App\Repositories\User\DriverAttachmentTypeRepository;
use Illuminate\Http\UploadedFile;

class DriverAttachmentTypeService
{
    /**
     * @var DriverAttachmentTypeRepository
     */
    private $repository;

    public function __construct(DriverAttachmentTypeRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * @return \Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model[]
     */
    public function findAll()
    {
        return $this->repository->findAll();
    }

    /**
     * @param array $request
     * @return DriverAttachmentType
     */
    public function insert(array $request): DriverAttachmentType
    {
        $deliveryAttachmentType = new DriverAttachmentType($request);

        if (isset($request['picture'])) {
            $pictureName = \Storage::cloud()
                ->putFile('driverAttachmentType', $request['picture']);

            $deliveryAttachmentType->picture = $pictureName;
        }

        $deliveryAttachmentType->save();
        return $deliveryAttachmentType;
    }

    /**
     * @param DriverAttachmentType $driverAttachmentType
     * @param array $request
     * @return DriverAttachmentType
     */
    public function update(DriverAttachmentType $driverAttachmentType, array $request): DriverAttachmentType
    {
        $driverAttachmentType->fill($request);
        $driverAttachmentType->save();

        return $driverAttachmentType;
    }

    /**
     * @param DriverAttachmentType $driverAttachmentType
     * @param UploadedFile|null $picture
     * @return DriverAttachmentType
     */
    public function updatePicture(
        DriverAttachmentType $driverAttachmentType, ?UploadedFile $picture): DriverAttachmentType
    {
        if ($picture) {
            $pictureName = \Storage::cloud()
                ->putFile('driverAttachmentType', $picture);

            if ($pictureName) {
                \Storage::cloud()
                    ->delete($driverAttachmentType->getRawOriginal('picture'));

                $driverAttachmentType->picture = $pictureName;
            }
        }

        $driverAttachmentType->save();
        return $driverAttachmentType;
    }

    /**
     * @param DriverAttachmentType $driverAttachmentType
     * @param bool $active
     * @return DriverAttachmentType
     */
    public function toggleActive(DriverAttachmentType $driverAttachmentType, bool $active): DriverAttachmentType
    {
        $driverAttachmentType->active = $active;
        $driverAttachmentType->save();

        return $driverAttachmentType;
    }

    /**
     * @param DriverAttachmentType $driverAttachmentType
     * @return bool
     * @throws \Exception
     */
    public function delete(DriverAttachmentType $driverAttachmentType): bool
    {
        return $driverAttachmentType->delete();
    }
}
