<?php

namespace App\Http\Controllers\DataImport;

use App\Http\Responses\ApiResponse;
use App\Services\DataImport\ImportCustomerService;
use App\Services\DataImport\ImportDriverService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ImportController extends Controller
{
    public function customer(Request $request, ImportCustomerService $service)
    {
        try {
            if (!$request->hasFile('file')) return ApiResponse::error("Não foi possivel carregar o arquivo do input file.", "Erro ao importar o arquivo");

            if (!$request->filled('cityId')) {
                return ApiResponse::error("Cidade é obrigatória.", "Erro ao importar o arquivo");
            }

            $result = $service->import(
                $request->file('file'),
                $request->user(),
                (int) $request->get('cityId')
            );
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao importar o arquivo");
        }

        return ApiResponse::success($result);
    }

    public function driver(Request $request, ImportDriverService $service)
    {
        try {
            if (!$request->hasFile('file')) {
                return ApiResponse::error("Não foi possivel carregar o arquivo do input file.", "Erro ao importar o arquivo");
            }

            if (!$request->filled('userTypeId') || !$request->filled('cityId')) {
                return ApiResponse::error("Categoria e cidade são obrigatórias.", "Erro ao importar o arquivo");
            }

            $result = $service->import(
                $request->file('file'),
                $request->user(),
                (int) $request->get('userTypeId'),
                (int) $request->get('cityId')
            );
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao importar o arquivo");
        }

        return ApiResponse::success($result);
    }
}
