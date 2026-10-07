<?php


namespace Delivery\Http\Controllers\Config;


use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Delivery\Http\Requests\Config\SettingDeliveryCompanyPixRequest;
use Delivery\Services\Config\SettingDeliveryCompanyPixService;

class SettingDeliveryCompanyPixController extends Controller
{
    private $service;

    public function __construct(SettingDeliveryCompanyPixService $service)
    {
        $this->service = $service;
    }

    public function generateQRCodePix(SettingDeliveryCompanyPixRequest $request)
    {
        try {
            $result = $this->service
                ->generateQRCodePix($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Ocorreu um erro ao gerar qrcode");
        }

        return ApiResponse::success($result);
    }
}
