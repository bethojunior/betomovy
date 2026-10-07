<?php

namespace Delivery\Http\Controllers\Delivery;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Delivery\Services\Delivery\DeliverySectionService;

class DeliverySectionController extends Controller
{
    private $service;

    public function __construct(DeliverySectionService $service)
    {
        $this->service = $service;
    }

    public function findAll()
    {
        try {
            $results = $this->service->findAll();
        } catch (\Exception $exception){
            return ApiResponse::error($exception);
        }

        return ApiResponse::success($results, "Listagem de seções delivery");
    }
}
