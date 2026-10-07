<?php


namespace Delivery\Services\Config;


use Delivery\Repositories\Config\SettingDeliveryCompanyPixRepository;
use Delivery\Utils\PixPayload;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class SettingDeliveryCompanyPixService
{
    private $repository;

    public function __construct(SettingDeliveryCompanyPixRepository $repository)
    {
        $this->repository = $repository;
    }

    public function generateQRCodePix(array $request)
    {
        $settingPix = $this->repository->finByCompany($request['companyId']);

        if (!$settingPix)
            return null;

        $objPayload = (new PixPayload)
            ->setPixKey($settingPix->pixKey)
            ->setDescription($settingPix->description)
            ->setMerchantCity($settingPix->merchantCity)
            ->setMerchantName($settingPix->merchantName)
            ->setAmount($request['value'])
            ->setTxId('FB' . $request['orderId'] . "704");

        $payloadQrCode = $objPayload->getPayload();

        return (object)[
            'code' => base64_encode($payloadQrCode),
            'pixKey' => $settingPix->pixKey
        ];
    }
}
