<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Repositories\Company\CompanyServiceTypeRepository;
use Illuminate\Http\Request;

class CompanyServiceTypeController extends Controller
{
    /**
     * @var CompanyServiceTypeRepository
     */
    private $repository;

    public function __construct(CompanyServiceTypeRepository $repository)
    {
        $this->repository = $repository;
    }

    public function index()
    {
        try {
            $result = $this->repository->all();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar os tipos de serviços empresariais");
        }

        return ApiResponse::success($result);
    }
}
