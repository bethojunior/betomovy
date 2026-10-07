<?php

namespace App\Http\Controllers\Role;

use App\Http\Responses\ApiResponse;
use App\Services\Role\UserGroupService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class UserGroupController extends Controller
{
    private $service;

    public function __construct(UserGroupService $service)
    {
        $this->service = $service;
    }

    public function all()
    {
        try {
            $result = $this->service
                ->findAll();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar os grupos de usuários");
        }

        return ApiResponse::success($result);
    }
}
