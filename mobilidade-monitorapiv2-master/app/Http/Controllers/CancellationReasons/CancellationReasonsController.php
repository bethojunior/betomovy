<?php


namespace App\Http\Controllers\CancellationReasons;


use App\Http\Controllers\Controller;
use App\Http\Requests\CancellationReasons\CancellationReasonsRequest;
use App\Http\Responses\ApiResponse;
use App\Services\CancellationReasons\CancellationReasonsService;
use Illuminate\Http\Request;

class CancellationReasonsController extends Controller
{
    /**
     * @var CancellationReasonsService
     */
    private $service;

    /**
     * CancellationReasonsController constructor.
     * @param CancellationReasonsService $service
     */
    public function __construct(CancellationReasonsService $service)
    {
        $this->service = $service;
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $cancellationReasons = $this->service
                ->findAll();
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], "Erro ao buscar mensagens de cancelamento");
        }

        return ApiResponse::success($cancellationReasons, "Mensagens de cancelamentos encontradas");
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function insert(Request $request)
    {
        try {
            $cancellationReasons = $this->service
                ->insert($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir mensagem de cancelamento");
        }

        return ApiResponse::created($cancellationReasons, "Mensagem de cancelamento criada com sucesso");
    }

    /**
     * @param $id
     * @param CancellationReasonsRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update($id, CancellationReasonsRequest $request)
    {
        try {
            $cancellationReasons = $this->service
                ->update($id, $request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar mensagem de cancelamento");
        }

        return ApiResponse::success($cancellationReasons);
    }

    /**
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function delete($id)
    {
        try {
            $cancellationReasons = $this->service
                        ->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao deletar mensagem de cancelamento");
        }

        return ApiResponse::success($cancellationReasons, "Mensagem de cancelamento excluída com sucesso");
    }
}
