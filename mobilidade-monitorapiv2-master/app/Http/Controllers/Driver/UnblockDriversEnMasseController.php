<?php

namespace App\Http\Controllers\Driver;
use App\Http\Responses\ApiResponse;
use App\Http\Controllers\Controller;
use App\Services\Driver\UnblockDriversEnMasseService;
use Illuminate\Http\Request;

class UnblockDriversEnMasseController extends Controller
{
    private $service;

    public function __construct(UnblockDriversEnMasseService $service)
    {
        $this->service = $service;
    }

    public function handle(Request $request)
    {
        if (!$request->hasFile('file'))
            return ApiResponse::error("Não foi possivel carregar o arquivo do input file.", "Erro ao importar o arquivo");

        try {
            $result = $this->service->handle($request->file('file'));

            $message = isset($result['message']) ? $result['message'] : 'Processamento concluído';
            return ApiResponse::success($result, $message);

        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), "Erro ao processar arquivo");
        }
    }
}
