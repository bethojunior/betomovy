<?php

namespace App\Http\Controllers\Freight;

use App\Http\Requests\Freight\ItemRequest;
use App\Http\Requests\Freight\UpdateItemRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Freight\ItemService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ItemController extends Controller
{
    /**
     * @var ItemService
     */
    private $service;

    public function __construct(ItemService $service)
    {
        $this->service = $service;
    }

    public function all()
    {
        try {
            $result = $this->service
                ->all();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar os itens de frete");
        }

        return ApiResponse::success($result, "Itens encontrados");
    }

    public function insert(ItemRequest $request)
    {
        try {
            $result = $this->service
                ->insert($request->except('picture'), $request->file('picture'));

        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir um item");
        }

        return ApiResponse::created($result, "Item inserido com sucesso");
    }

    public function update($id, UpdateItemRequest $request)
    {
        try {
            $result = $this->service
                ->update($id, $request->all(), $request->file('picture'));
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar um item");
        }

        return ApiResponse::success($result, "Item atualizado com sucesso");
    }

    public function delete($id)
    {
        try {
            $result = $this->service
                ->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao deletar item");
        }

        return ApiResponse::success($result, "Item excluído com sucesso");
    }
}
