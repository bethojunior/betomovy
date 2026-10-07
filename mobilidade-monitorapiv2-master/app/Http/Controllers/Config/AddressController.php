<?php

namespace App\Http\Controllers\Config;

use App\Http\Requests\Config\AddressRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Config\AddressService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class AddressController extends Controller
{
    /**
     * @var AddressService
     */
    private $service;

    public function __construct(AddressService $service)
    {
        $this->service = $service;
    }

    public function findAll(Request $request)
    {
        try {
            $result = $this->service
                ->findAll($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar os endereços");
        }

        return ApiResponse::success($result);
    }

    public function insert(AddressRequest $request)
    {
        try {
            $result = $this->service
                ->insert($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir um endereço");
        }

        return ApiResponse::created($result);
    }

    public function update(AddressRequest $request)
    {
        try {
            $result = $this->service
                ->update($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar um endereço");
        }

        return ApiResponse::success($result);
    }

    public function delete($id)
    {
        try {
            $result = $this->service
                ->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir um endereço");
        }

        return ApiResponse::success($result);
    }

    public function cacheAddress(Request $request)
    {
        try {
            $result = $this->service
                ->cacheAddress($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar endereços em cache");
        }

        return ApiResponse::success($result);
    }
}
