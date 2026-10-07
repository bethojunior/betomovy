<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 01/10/2019
 * Time: 09:41
 */

namespace App\Services\Freight\Accessibility;


use App\Constants\StatusConst;
use App\Models\Freight\ObstacleOnFloor;
use App\Repositories\Freight\Accessibility\ObstacleOnFloorRepository;

class ObstacleOnFloorService
{
    /**
     * @var ObstacleOnFloorRepository
     */
    private $repository;

    public function __construct(ObstacleOnFloorRepository $repository)
    {
        $this->repository = $repository;
    }

    public function insert($request)
    {
        $obstacleOnFloor = new ObstacleOnFloor;

        $obstacleOnFloor->description = $request['description'];

        $pictureName = \Storage::cloud()
            ->putFile('accessibility', $request['picture']);
        
        $obstacleOnFloor
            ->picture = $this->generateStorageUrl($pictureName);

        $this->repository
            ->save($obstacleOnFloor);

        return $obstacleOnFloor;
    }

    public function findAll()
    {
        return $this->repository
            ->findAll();
    }

    public function delete($id)
    {
        $obstacleOnFloor = $this->repository
            ->find($id);

        if (!$obstacleOnFloor)
            return null;

        $obstacleOnFloor
            ->statusId = StatusConst::REMOVED;

        $this->repository->save($obstacleOnFloor);

        return true;
    }

    private function generateStorageUrl(string $fileName): string
    {
        $bucket = env('STORAGE_BUCKET') ?? env('AWS_BUCKET');
        $endpoint = env('STORAGE_ENDPOINT') ?? env('AWS_ENDPOINT');

        return "{$endpoint}/{$bucket}/{$fileName}";
    }
}
