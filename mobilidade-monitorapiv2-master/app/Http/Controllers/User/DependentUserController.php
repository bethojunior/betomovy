<?php

namespace App\Http\Controllers\User;

use App\Http\Responses\ApiResponse;
use App\Services\User\DependentUserService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DependentUserController extends Controller
{
    /**
     * @var DependentUserService
     */
    private $service;

    public function __construct(DependentUserService $service)
    {
        $this->service = $service;
    }

    public function findByUser($userId)
    {
        try {
            $result = $this->service
                ->getByUser($userId);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar os dependentes do usuário");
        }

        return ApiResponse::success($result);
    }
}
