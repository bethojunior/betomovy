<?php

namespace App\Http\Controllers\ConfigListContacts;

use App\Http\Responses\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\ConfigListContacts\ConfigListContactsRequest;
use App\Services\ConfigListContacts\ConfigListContactsGeneralService;

class ConfigListContactsGeneralController extends Controller
{
    private $service;

    public function __construct(ConfigListContactsGeneralService $service)
    {
        $this->service = $service;
    }

    public function getConfigListContacts()
    {
        try {
            $result = $this->service->getConfigListContacts();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao pegar configurações");
        }

        return ApiResponse::success($result, "Configurações retornada com sucesso");
    }

    public function updateConfigListContacts(int $id, ConfigListContactsRequest $request)
    {
        try {
            $result = $this->service->updateConfigListContact($id, $request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar dados");
        }

        return ApiResponse::success($result, "Dados atualizado com sucesso");
    }
}
