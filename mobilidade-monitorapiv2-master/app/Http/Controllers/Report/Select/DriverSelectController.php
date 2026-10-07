<?php

namespace App\Http\Controllers\Report\Select;

use App\Http\Responses\ApiResponse;
use App\Repositories\Report\Select2\DriverSelectRepository;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DriverSelectController extends Controller
{
    /**
     * @var DriverSelectRepository
     */
    private $repository;

    public function __construct(DriverSelectRepository $repository)
    {
        $this->repository = $repository;
    }

    public function listSelect2(Request $request)
    {
        try {
            $result = $this->repository
                ->listBySelect2($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar os motoristas");
        }

        return ApiResponse::success($result);
    }
}
