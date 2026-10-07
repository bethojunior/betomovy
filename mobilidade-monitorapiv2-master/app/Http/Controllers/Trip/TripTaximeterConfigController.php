<?php

namespace App\Http\Controllers\Trip;

use App\Http\Controllers\Controller;
use App\Http\Requests\Trip\TripTaximeterConfigRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Trip\TripTaximeterConfigService;
use Illuminate\Http\Request;

class TripTaximeterConfigController extends Controller
{
    /**
     * @var TripTaximeterConfigService
     */
    private $service;

    public function __construct(TripTaximeterConfigService $service)
    {
        $this->service = $service;
    }

    public function insert(TripTaximeterConfigRequest $request)
    {
        try {
            $result = $this->service
                ->insert($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir configuração de taxímetro");
        }

        return ApiResponse::created($result);
    }
}
