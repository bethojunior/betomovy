<?php


namespace App\Repositories\Config;


use App\Models\Config\SettingDeliveryCompanyPix;
use Common\Contracts\Repository\AbstractRepository;

class SettingDeliveryCompanyPixRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(SettingDeliveryCompanyPix::class);
    }

    public function finByCompany($companyId)
    {
        return $this->getModel()
            ::where("companyId", $companyId)
            ->first();
    }
}
