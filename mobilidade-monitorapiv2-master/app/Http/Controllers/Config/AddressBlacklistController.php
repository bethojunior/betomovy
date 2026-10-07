<?php

namespace App\Http\Controllers\Config;

use App\Http\Controllers\Controller;
use App\Http\Requests\Config\AddressBlacklistRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Config\AddressBlacklist;
use App\Services\Config\AddressBlacklistService;
use Illuminate\Http\Request;

class AddressBlacklistController extends Controller
{
    /**
     * @var AddressBlacklistService
     */
    private $service;

    public function __construct(AddressBlacklistService $service)
    {
        $this->service = $service;
    }

    public function findAll(Request $request)
    {
        try {
            $result = $this->service
                ->findAll($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar os endereços da blacklist");
        }

        return ApiResponse::success($result);
    }

    public function insert(AddressBlacklistRequest $request)
    {
        try {
            $result = $this->service
                ->insert($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir o endereço na blacklist");
        }

        return ApiResponse::success($result);
    }

    public function refuse(AddressBlacklist $addressBlacklist)
    {
        try {
            $result = $this->service
                ->refuse($addressBlacklist);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao recusar endereço");
        }

        return ApiResponse::success($result);
    }

    public function approve(AddressBlacklist $addressBlacklist)
    {
        try {
            $result = $this->service
                ->approve($addressBlacklist);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao aprovar endereço");
        }

        return ApiResponse::success($result);
    }

    public function delete(AddressBlacklist $addressBlacklist)
    {
        try {
            $result = $this->service
                ->delete($addressBlacklist);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir endereço");
        }

        return ApiResponse::success($result);
    }
}
