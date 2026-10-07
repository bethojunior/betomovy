<?php

namespace App\Http\Controllers\Config;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\Config\FirestoreService;

class FirestoreController extends Controller
{
    private $service;

    public function __construct(FirestoreService $service)
    {
        $this->service = $service;
    }

    public function cleanAllTripCollection()
    {
        try {
            $this->service->cleanAllCollection();
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro um erro ao tenta limpar as firebase');
        }

        return ApiResponse::success(null,"Limpeza feita com sucesso");
    }

    public function checkRealtime()
    {
        try {
            $this->service->checkRealtime();
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao validar firestore');
        }

        return ApiResponse::success(null,"Sucesso ao verificar firestore");
    }
}
