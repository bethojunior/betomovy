<?php

namespace App\Http\Controllers\Advertising;

use App\Http\Requests\Advertising\StoreAdvertisingRequest;
use App\Http\Requests\Advertising\UpdateAdvertisingRequest;
use App\Http\Requests\Advertising\UpdateOrderAdvertisingRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Advertising\AdvertisingService;
use Exception;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdvertisingController extends Controller
{
    /**
     * @var AdvertisingService
     */
    private $service;

    public function __construct(AdvertisingService $service)
    {
        $this->service = $service;
    }

    public function insert(StoreAdvertisingRequest $request)
    {
        try {
            $result = $this->service->insert($request->validated());
        } catch (Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir publicidade");
        }

        return ApiResponse::created($result);
    }

    public function findAll(Request $request)
    {
        try {
            $result = $this->service->findAll($request->query->all());
        } catch (Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar publicidades");
        }

        return ApiResponse::success($result);
    }

    public function show($id)
    {
        try {
            $result = $this->service->show($id);
        } catch (Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar publicidade");
        }

        return ApiResponse::success($result);
    }

    public function update(UpdateAdvertisingRequest $request, $id)
    {
        try {
            $result = $this->service->update($id, $request->validated());
        } catch (Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir publicidade");
        }

        return ApiResponse::created($result);
    }

    public function enable($id)
    {
        try {
            $result = $this->service->updateStatus($id);
        } catch (Exception $e) {
            return ApiResponse::error($e, "Erro ao ativar publicidade");
        }

        return ApiResponse::success($result);
    }

    public function disable($id)
    {
        try {
            $result = $this->service->updateStatus($id, 0);
        } catch (Exception $e) {
            return ApiResponse::error($e, "Erro ao desativar publicidade");
        }

        return ApiResponse::success($result);
    }

    public function delete($id)
    {
        try {
            $result = $this->service->delete($id);
        } catch (Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir publicidade");
        }

        return ApiResponse::success($result);
    }

    public function updateOrder(UpdateOrderAdvertisingRequest $request)
    {
        try {
            $result = $this->service->updateOrder($request->validated()['orders']);
        } catch (Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar ordem das publicidades");
        }

        return ApiResponse::success($result);
    }
}
