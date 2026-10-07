<?php

namespace App\Http\Controllers\Config;

use App\Exceptions\Config\ConfigException;
use App\Http\Responses\ApiResponse;
use App\Services\Config\ConfigService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ConfigController extends Controller
{
    /**
     * @var ConfigService
     */
    private $service;

    public function __construct(ConfigService $service)
    {
        $this->service = $service;
    }

    public function findByKey($key)
    {
        try {
            $config_value = $this->service
                ->findByKey($key);
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], "Erro ao buscar configuração");
        }

        return ApiResponse::success($config_value, "Configuração encontrada");
    }
}
