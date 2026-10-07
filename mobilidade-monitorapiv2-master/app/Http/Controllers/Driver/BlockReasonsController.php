<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Http\Requests\Driver\BlockReasonsRequest;
use App\Http\Responses\ApiResponse;
use App\Models\User\Driver;
use App\Services\Driver\BlockReasonsService;
use Illuminate\Http\JsonResponse;

class BlockReasonsController extends Controller
{
    /**
     * @var BlockReasonsService
     */
    private $service;

    public function __construct(BlockReasonsService $service)
    {
        $this->service = $service;
    }

    public function insert(Driver $driver, BlockReasonsRequest $request): JsonResponse
    {
        return ApiResponse::success($this->service->insert($driver, $request->validated()));
    }
}
