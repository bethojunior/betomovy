<?php

namespace App\Http\Controllers\Enum;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\Enum\BankService;
use Illuminate\Http\Request;

class BankController extends Controller
{
    /**
     * @var BankService
     */
    private $service;

    public function __construct(BankService $service)
    {
        $this->service = $service;
    }

    public function __invoke()
    {
        try {
            $result = $this->service
                ->findAll();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar os bancos");
        }

        return ApiResponse::success($result);
    }
}
