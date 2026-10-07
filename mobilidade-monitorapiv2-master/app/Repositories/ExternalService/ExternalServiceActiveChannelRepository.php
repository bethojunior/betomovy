<?php
/**
 * Repository para externalServiceActiveChannel
 */

namespace App\Repositories\ExternalService;

use App\Contracts\Repository\AbstractRepository;
use App\Models\ExternalService\ExternalServiceActiveChannel;

class ExternalServiceActiveChannelRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(ExternalServiceActiveChannel::class);
    }

    public function findAll()
    {
        return $this->getModel()
            ::with([
                'externalServiceAction',
                'externalServiceType'
            ])
            ->get();
    }

    public function findActiveByAction(int $externalServiceActionId)
    {
        return $this->getModel()->where('externalServiceActionId', $externalServiceActionId)
            ->first();
    }
}
