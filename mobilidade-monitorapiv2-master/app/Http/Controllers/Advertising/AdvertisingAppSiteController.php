<?php

namespace App\Http\Controllers\Advertising;

use App\Http\Responses\ApiResponse;
use App\Services\Advertising\AdvertisingAppSiteService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class AdvertisingAppSiteController extends Controller
{
    /**
     * @var AdvertisingAppSiteService
     */
    private $service;

    public function __construct(AdvertisingAppSiteService $service)
    {
        $this->service = $service;
    }

    public function all()
    {
        try {
            $result = $this->service
                ->findAll();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar os locais de publicidade");
        }

        return ApiResponse::success($result);
    }
}
