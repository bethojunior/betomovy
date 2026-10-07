<?php

namespace App\Repositories\Central;

use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Central\CentralCallTypeConfig;

class CentralCallTypeConfigRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(CentralCallTypeConfig::class);
    }

    public function findAllCentralCallTypes()
    {
        return $this->getModel()
            ::join('centralCallType', 'centralCallType.id', '=', 'centralCallTypeConfig.centralCallTypeId')
            ->select('centralCallTypeConfig.id',
                'centralCallTypeConfig.centralCallTypeId',
                'centralCallTypeConfig.isActive',
                'centralCallType.name as name'
            )
            ->where('statusId',StatusConst::ACTIVE)
            ->get();
    }

    public function updateCentralCallTypes(array $data)
    {
        foreach ($data as $item) {
            $this->getModel()
                ::where('centralCallTypeId', $item['centralCallTypeId'])
                ->update([
                    'isActive' => $item['isActive']
                ]);
        }

        return true;
    }
}
