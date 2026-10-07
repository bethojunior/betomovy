<?php

namespace App\Http\Controllers\ChatBot;

use App\Http\Requests\ChatBot\ChatBotTripRequest;
use App\Http\Responses\ApiResponse;
use App\Services\ChatBot\ChatBotTripService;
use App\Services\Trip\TripPaymentFormService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ChatBotTripController extends Controller
{
    private $service;

    public function __construct(ChatBotTripService $service)
    {
        $this->service = $service;
    }


    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function all()
    {
        try {
            $chatBotTrip = $this->service
                ->findAll();
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
                ], "Erro ao buscar mensagens automáticas");
        }

        return ApiResponse::success($chatBotTrip, "Mensagens automáticas encontradas");
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
            return ApiResponse::error($e, "Erro ao inserir mensagem automática");
        }

        return ApiResponse::created($result, "Mensagem automática criada com sucesso");
    }


    /**
     * @param $id
     * @param ChatBotTripRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function edit($id, ChatBotTripRequest $request)
    {
        try {
            $result = $this->service
                ->edit($id, $request->all());
        } catch (\Exception $exception) {
            return ApiResponse::error($exception, "Erro ao editar mensagem automática");
        }

        return ApiResponse::success($result);
    }


    /**
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function delete($id)
    {

        try {
            $result = $this->service
                ->delete($id);

        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao deletar mensagem automática");
        }

        return ApiResponse::success($result, "Mensagem automática excluída com sucesso");
    }
}
