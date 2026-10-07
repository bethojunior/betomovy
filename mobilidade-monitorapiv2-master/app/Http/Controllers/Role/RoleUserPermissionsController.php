<?php

namespace App\Http\Controllers\Role;

use App\Http\Responses\ApiResponse;
use App\Services\Role\RoleUserPermissionService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class RoleUserPermissionsController extends Controller
{
    /**
     * @var RoleUserPermissionService
     */
    private $service;

    public function __construct(RoleUserPermissionService $service)
    {
        $this->service = $service;
    }

    public function all(Request $request)
    {
        try {
            $result = $this->service
                ->findAll($request->user());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar as permissões");
        }

        return ApiResponse::success($result);
    }
}
