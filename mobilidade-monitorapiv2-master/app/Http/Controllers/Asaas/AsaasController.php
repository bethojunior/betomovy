<?php

namespace App\Http\Controllers\Asaas;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Utils\AsaasApi;
use Illuminate\Http\Request;

class AsaasController extends Controller
{
    /**
     * @var AsaasApi
     */
    private $asaasApi;


    public function __construct(AsaasApi $asaasApi)
    {
        $this->asaasApi = $asaasApi;
    }

    public function createBoleto(Request $driver)
    {
        try {
            $data = $this->asaasApi->createBoleto($driver);
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage());
        }

        return ApiResponse::success($data);
    }

    public function getBoletos($id)
    {
        try {
            $data = $this->asaasApi->getBoletos($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage());
        }

        return ApiResponse::success($data);
    }

    public function getUser($id)
    {
        try {
            $data = $this->asaasApi->getUser($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage());
        }

        return ApiResponse::success($data);
    }
}
