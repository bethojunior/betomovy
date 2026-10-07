<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 28/07/2020
 * Time: 15:52
 */

namespace App\Http\Controllers\ExternalService;


use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Repositories\ExternalService\ExternalServiceActionRepository;

class ExternalServiceActionController extends Controller
{
    /**
     * @var ExternalServiceActionRepository
     */
    private $repository;

    public function __construct(ExternalServiceActionRepository $repository)
    {
        $this->repository = $repository;
    }

    public function index()
    {
        try {
            $result = $this->repository->all();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar ações para envio de notificações");
        }

        return ApiResponse::success($result);
    }
}
