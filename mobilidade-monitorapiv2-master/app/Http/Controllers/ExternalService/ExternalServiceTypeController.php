<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 28/07/2020
 * Time: 15:25
 */

namespace App\Http\Controllers\ExternalService;


use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Repositories\ExternalService\ExternalServiceTypeRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExternalServiceTypeController extends Controller
{
    private $repository;

    public function __construct(ExternalServiceTypeRepository $repository)
    {
        $this->repository = $repository;
    }

    public function index(Request $request): JsonResponse
    {
        try {
            $result = $this->repository->findAll($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar tipos de serviços");
        }

        return ApiResponse::success($result);
    }

    public function findFully(Request $request)
    {
        try {
            $result = $this->repository->findFully($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar tipos de serviços");
        }

        return ApiResponse::success($result);
    }
}
