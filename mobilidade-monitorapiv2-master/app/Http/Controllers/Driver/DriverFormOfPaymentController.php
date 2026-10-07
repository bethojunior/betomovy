<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 30/07/2020
 * Time: 13:51
 */

namespace App\Http\Controllers\Driver;


use App\Http\Controllers\Controller;
use App\Http\Requests\Driver\DriverFormOfPaymentBlockedRequest;
use App\Http\Requests\Driver\DriverFormOfPaymentImpositionRequest;
use App\Http\Responses\ApiResponse;
use App\Models\User\Driver;
use App\Services\Driver\DriverFormOfPaymentService;

class DriverFormOfPaymentController extends Controller
{
    /**
     * @var DriverFormOfPaymentService
     */
    private $service;

    public function __construct(DriverFormOfPaymentService $service)
    {
        $this->service = $service;
    }

    public function findByDriver($driverId)
    {
        try {
            $result = $this->service
                ->findByDriver($driverId);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar as formas de recebimento do motorista");
        }

        return ApiResponse::success($result);
    }

    public function findBlockedByDriver($driverId)
    {
        try {
            $result = $this->service
                ->findBlockedByDriver($driverId);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar as formas de recebimento bloqueadas do motorista");
        }

        return ApiResponse::success($result);
    }

    public function blockFormOfPayment($driverId, DriverFormOfPaymentBlockedRequest $request)
    {
        try {
            $result = $this->service
                ->blockFormOfPayment($driverId, $request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao bloquear as formas de recebimento do motorista");
        }

        return ApiResponse::success($result);
    }

    public function findByDriverImposition($driverId)
    {
        try {
            $result = $this->service
                ->findByDriverImposition($driverId);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar as formas de recebimento do motorista");
        }

        return ApiResponse::success($result);
    }

    public function impositionFormOfPayment($driverId, DriverFormOfPaymentImpositionRequest $request)
    {
        try {
            $result = $this->service
                ->impositionFormOfPayment($driverId, $request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao imposição as formas de recebimento do motorista");
        }

        return ApiResponse::success($result);
    }
}
