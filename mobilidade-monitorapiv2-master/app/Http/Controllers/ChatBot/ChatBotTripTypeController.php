<?php

namespace App\Http\Controllers\ChatBot;

use App\Http\Requests\ChatBot\ChatBotTripTypeRequest;
use App\Http\Responses\ApiResponse;
use App\Services\ChatBot\ChatBotTripTypeService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ChatBotTripTypeController extends Controller
{
    private $service;

    public function __construct(ChatBotTripTypeService $service)
    {
        $this->service = $service;
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function all()
    {
        try {
            $chatBotTripType = $this->service
                ->findAll();
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], "Erro ao buscar tipos de mensagens automáticas");
        }

        return ApiResponse::success($chatBotTripType, "Tipos de mensagens automáticas encontradas");
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function insert(Request $request)
    {
        try {
            $result = $this->service
                ->insert($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir tipo de mensagem automática");
        }

        return ApiResponse::created($result, "Tipo de mensagem automática criada com sucesso");
    }

    /**
     * @param $id
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function edit($id, ChatBotTripTypeRequest $request)
    {
        try {
            $result = $this->service
                ->edit($id, $request->all());
        } catch (\Exception $exception) {
            return ApiResponse::error($exception, "Erro ao editar o tipo de mensagem automática");
        }

        return ApiResponse::success($result);
    }
}
