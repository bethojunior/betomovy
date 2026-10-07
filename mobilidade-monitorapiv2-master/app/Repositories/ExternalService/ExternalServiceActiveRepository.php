<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 28/07/2020
 * Time: 16:46
 */

namespace App\Repositories\ExternalService;


use App\Contracts\Repository\AbstractRepository;
use App\Models\ExternalService\ExternalServiceActive;

class ExternalServiceActiveRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(ExternalServiceActive::class);
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
        return $this->getModel()::where('externalServiceActionId', $externalServiceActionId)
            ->first();
    }
}
