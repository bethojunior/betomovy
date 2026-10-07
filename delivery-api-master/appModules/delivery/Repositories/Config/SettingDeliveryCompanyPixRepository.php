<?php


namespace Delivery\Repositories\Config;


use App\Contracts\Repository\AbstractRepository;
use Delivery\Models\Config\SettingDeliveryCompanyPix;

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
