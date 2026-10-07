<?php


namespace App\Services\Config;


use App\Models\Config\SettingDeliveryCompanyPix;
use App\Repositories\Config\SettingDeliveryCompanyPixRepository;

class SettingDeliveryCompanyPixService
{
    private $repository;

    public function __construct(SettingDeliveryCompanyPixRepository $repository)
    {
        $this->repository = $repository;
    }

    public function update(array $request)
    {
        $settingDeliveryCompanyPix = $this->repository->finByCompany($request['companyId']);

        if (!$settingDeliveryCompanyPix)
            $settingDeliveryCompanyPix = new SettingDeliveryCompanyPix();

        $settingDeliveryCompanyPix->pixKey = $request['pixKey'];
        $settingDeliveryCompanyPix->companyId = $request['companyId'];
        $settingDeliveryCompanyPix->merchantName = $request['merchantName'];
        $settingDeliveryCompanyPix->merchantCity = strtoupper($request['merchantCity']);
        $settingDeliveryCompanyPix->description = $request['description'];

        $settingDeliveryCompanyPix->save();
    }

    public function findByCompany($companyId)
    {
        return $this->repository->finByCompany($companyId);
    }
}
