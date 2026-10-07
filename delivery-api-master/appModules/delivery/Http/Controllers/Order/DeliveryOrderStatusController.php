<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/07/2020
 * Time: 18:15
 */

namespace Delivery\Http\Controllers\Order;


use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Delivery\Repositories\Order\DeliveryOrderStatusRepository;

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

    public function findShowableInApp()
    {
        try {
            $result = $this->repository->findShowableInApp();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar status de pedidos");
        }

        return ApiResponse::success($result);
    }
}
