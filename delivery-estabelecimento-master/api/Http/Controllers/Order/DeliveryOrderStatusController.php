<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 16/06/2020
 * Time: 17:06
 */

namespace Api\Http\Controllers\Order;


use Api\Http\Responses\ApiResponse;
use Api\Repositories\Order\DeliveryOrderStatusRepository;
use App\Http\Controllers\Controller;

class DeliveryOrderStatusController extends Controller
{
    /**
     * @var DeliveryOrderStatusRepository
     */
    private $repository;

    public function __construct(DeliveryOrderStatusRepository $repository)
    {
        $this->repository = $repository;
    }

    public function index()
    {
        try {
            $result = $this->repository->findManageable();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar status de pedidos");
        }

        return ApiResponse::success($result);
    }
}
