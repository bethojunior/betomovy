<?php
/**
 * Service para externalServiceActiveChannel
 */

namespace App\Services\ExternalService;

use App\Models\ExternalService\ExternalServiceActiveChannel;
use App\Repositories\ExternalService\ExternalServiceActiveChannelRepository;

class ExternalServiceActiveChannelService
{
    /**
     * @var ExternalServiceActiveChannelRepository
     */
    private $repository;

    public function __construct(ExternalServiceActiveChannelRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll()
    {
        return $this->repository->findAll();
    }

    public function updateExternalServiceType(ExternalServiceActiveChannel $externalServiceActiveChannel, array $request)
    {
        if (isset($request['status'])) {
            $externalServiceActiveChannel->status = $request['status'];
            $externalServiceActiveChannel->save();
        }
        return $externalServiceActiveChannel;
    }
}
