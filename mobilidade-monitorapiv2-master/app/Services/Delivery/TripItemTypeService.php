<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 29/08/2019
 * Time: 15:17
 */

namespace App\Services\Delivery;


use App\Constants\StatusConst;
use App\Models\Delivery\TripItemType;
use App\Repositories\Delivery\TripItemTypeRepository;
use Illuminate\Http\UploadedFile;

class TripItemTypeService
{
    /**
     * @var TripItemTypeRepository
     */
    private $repository;

    public function __construct(TripItemTypeRepository $repository)
    {
        $this->repository = $repository;
    }

    public function insert($request, UploadedFile $picture)
    {
        $pictureName = \Storage::cloud()
            ->putFile('tripItemType', $picture, 'public');

        $pictureName = explode('/', $pictureName);

        $tripItemType = new TripItemType([
            'name' => $request['name'],
            'picture' => end($pictureName)
        ]);

        $this->repository
            ->save($tripItemType);

        return $tripItemType;
    }

    public function update($id, $request, ?UploadedFile $picture)
    {
        /** @var TripItemType $tripItemType */
        $tripItemType = $this->repository
            ->find($id);

        if ($picture){
            \Storage::cloud()
                ->delete('tripItemType/'.$tripItemType
                    ->getOriginal('picture'));

            $pictureName = \Storage::cloud()
                ->putFile('tripItemType', $picture, 'public');

            $pictureName = explode('/', $pictureName);

            $tripItemType->picture = end($pictureName);
        }

        $tripItemType->name =
            $request['name'] ?? $tripItemType->name;

        $this->repository
            ->save($tripItemType);

        return $tripItemType;
    }

    public function delete($id)
    {
        /** @var TripItemType $tripItemType */
        $tripItemType = $this->repository
            ->find($id);

        \Storage::cloud()
            ->delete('tripItemType/'.$tripItemType
                    ->getOriginal('picture'));

        $tripItemType->picture = null;
        $tripItemType->statusId = StatusConst::REMOVED;

        return $this->repository
            ->save($tripItemType);
    }
}
