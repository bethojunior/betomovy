<?php

namespace App\Http\Controllers\Delivery;

use App\Http\Requests\Delivery\TripItemTypeRequest;
use App\Http\Requests\Delivery\UpdateTripItemTypeRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Delivery\TripItemTypeService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TripItemTypeController extends Controller
{
    /**
     * @var TripItemTypeService
     */
    private $service;

    public function __construct(TripItemTypeService $service)
    {
        $this->service = $service;
    }

    public function insert(TripItemTypeRequest $request)
    {
        try {
            $result = $this->service
                ->insert($request->all(), $request->file('picture'));
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir tipo de item");
        }

        return ApiResponse::created($result, "Tipo de item de delivery inserido com sucesso");
    }

    public function update($id, UpdateTripItemTypeRequest $request)
    {
        try {
            $result = $this->service
                ->update($id, $request->all(), $request->file('picture'));
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar tipo de item");
        }

        return ApiResponse::success($result, "Tipo de item de delivery atualizado com sucesso");
    }

    public function delete($id)
    {
        try {
            $result = $this->service
                ->delete($id);

        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir tipo de item de delivery");
        }

        return ApiResponse::success($result, "Tipo de item de delivery excluído com sucesso");
    }
}
