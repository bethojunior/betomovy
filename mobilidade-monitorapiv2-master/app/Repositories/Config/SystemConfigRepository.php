<?php


namespace App\Repositories\Config;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Config\SystemConfig;

class SystemConfigRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(SystemConfig::class);
    }

    public function getStatusPay()
    {
        return $this->getModel()::select(
            'statusPay.id',
            'status',
            'message'
        )
            ->join('statusPay', 'systemConfig.value', '=', 'statusPay.id')
            ->where('key', '=', 'statusPayId')
            ->first();
    }
}
