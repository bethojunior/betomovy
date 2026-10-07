<?php

namespace App\Repositories\CallGroup;

use App\Contracts\Repository\AbstractRepository;
use App\Models\CallGroup\DriversLinkedCallGroup;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;

class DriverLinkedCallGroupRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(DriversLinkedCallGroup::class);
    }

    public function linkDrivers(int $driverId, int $callGroupId)
    {
        $exists = $this->getModel()::where('driverId', $driverId)
            ->where('call_group_id', $callGroupId)
            ->exists();

        if ($exists) {
            throw new ResourceNotFoundException('Este motorista já possui vínculo.');
        }

        return $this->getModel()::create([
            'driverId'      => $driverId,
            'call_group_id' => $callGroupId
        ]);
    }

    public function unlinkDrivers(int $driverId, int $callGroupId)
    {
        return $this->getModel()::where('driverId', $driverId)
            ->where('call_group_id', $callGroupId)
            ->delete();
    }

    public function findDriversByCallGroup(int $idCallGroup)
    {
        return $this->getModel()
            ::where('call_group_id', $idCallGroup)
            ->with([
                'callGroups',
                'drivers' => function ($query) {
                    $query->with([
                        'user' => function ($queryUser) {
                            $queryUser->select('idUser', 'name', 'nickname', 'phone', 'email');
                        }
                    ])->select('idDriver', 'userId', 'profileImage');
                }
            ])
            ->paginate();
    }

    public function findCallGroupVinculated(int $idCallGroup)
    {
        return $this->getModel()
            ::where('call_group_id', $idCallGroup)->exists();
    }

    public function searchDriverByCallGroup(String $nameDriver, int $idCallGroup)
    {
        return $this->getModel()
            ::where('call_group_id', $idCallGroup)
            ->whereHas('drivers.user', function ($query) use ($nameDriver) {
                $query->where('name', 'LIKE', "%{$nameDriver}%");
            })
            ->with([
                'callGroups',
                'drivers' => function ($query) {
                    $query->with([
                        'user' => function ($queryUser) {
                            $queryUser->select('idUser', 'name', 'nickname', 'phone', 'email');
                        }
                    ])->select('idDriver', 'userId', 'profileImage');
                }
            ])
            ->paginate();
    }
}
