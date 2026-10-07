<?php

namespace App\Http\Controllers\ListContacts;

use App\Http\Responses\ApiResponse;
use App\Services\ListContacts\ListContactsGeneralService;
use App\Http\Controllers\Controller;
use App\Http\Requests\ListContacts\ListContactsGeneralRequest;
use Illuminate\Http\Request;

class ListContactsGeneralController extends Controller
{
    /**
     * @var AddressService
     */
    private $service;

    public function __construct(ListContactsGeneralService $service)
    {
        $this->service = $service;
    }

    public function insert(ListContactsGeneralRequest $request)
    {
        try {
            $result = $this->service->addContacts($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir dados");
        }

        return ApiResponse::created($result, "Dados inserido com sucesso");
    }

    public function get(Request $request)
    {
        try {
            $result = $this->service->listContacts($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao pegar dados");
        }

        return ApiResponse::success($result, "Dados capturados com sucesso.");
    }

    public function delete(int $id)
    {
        try {
            $result = $this->service->deleteContacts($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao deletar dados");
        }

        return ApiResponse::success($result, "Dados deletado com sucesso");
    }
}
