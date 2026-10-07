<?php

namespace App\Http\Controllers\Report\Select;

use App\Constants\Balance\BalanceFlowConst;
use App\Constants\Trip\TripCallTypeConst;
use App\Constants\Trip\TripConst;
use App\Constants\Users\UserConst;
use App\Http\Responses\ApiResponse;
use App\Repositories\Balance\BalanceFlowRepository;
use App\Repositories\Balance\BalanceFlowTypeRepository;
use App\Repositories\Central\CentralRepository;
use App\Repositories\Delivery\DeliveryOrderStatusRepository;
use App\Repositories\Delivery\DeliveryPaymentFormRepository;
use App\Repositories\Report\Select\CitySelectRepository;
use App\Repositories\Report\Select\CustomerRegisterStatusSelectRepository;
use App\Repositories\Report\Select\DriverRegisterStatusSelectRepository;
use App\Repositories\Report\Select\PartnerRegisterStatusSelectRepository;
use App\Repositories\Report\Select\TripCallTypeSelectRepository;
use App\Repositories\Report\Select\TripPaymentFormSelectRepository;
use App\Repositories\Report\Select\TripTypeSelectRepository;
use App\Http\Controllers\Controller;
use App\Repositories\Report\Select2\CentralSelectRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SelectController extends Controller
{
    public function listTripPaymentForm(TripPaymentFormSelectRepository $repository)
    {
        try {
            $result = $repository->listBySelect();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar select");
        }

        return ApiResponse::success($result);
    }

    public function listDriverRegisterStatus(DriverRegisterStatusSelectRepository $repository)
    {
        try {
            $result = $repository->listBySelect();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar select");
        }

        return ApiResponse::success($result);
    }

    public function listTripCallType(TripCallTypeSelectRepository $repository)
    {
        try {
            $result = $repository->listBySelect();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar select");
        }

        return ApiResponse::success($result);
    }

    public function listCitiesActives(CitySelectRepository $repository)
    {
        try {
            $result = $repository->listActives(Auth::user());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar select");
        }

        return ApiResponse::success($result);
    }

    public function listTripStatuses()
    {
        return ApiResponse::success(TripConst::STATUSES_TRANSLATED_FOR_SELECT);
    }

    public function listTripTypes(TripTypeSelectRepository $repository)
    {
        try {
            $result = $repository->listBySelect();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar select");
        }

        return ApiResponse::success($result);
    }

    /**
     * @param CustomerRegisterStatusSelectRepository $repository
     * @return \Illuminate\Http\JsonResponse
     */
    public function listCustomerRegisterStatus(CustomerRegisterStatusSelectRepository $repository)
    {
        try {
            $result = $repository->listBySelect();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar select");
        }

        return ApiResponse::success($result);
    }

    public function listPartnerRegisterStatus(PartnerRegisterStatusSelectRepository $repository)
    {
        try {
            $result = $repository->listBySelect();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar select");
        }

        return ApiResponse::success($result);
    }

    /**
     * @param BalanceFlowTypeRepository $balanceFlowTypeRepository
     * @return \Illuminate\Http\JsonResponse
     */
    public function listByFlowType(BalanceFlowTypeRepository $balanceFlowTypeRepository)
    {
        try {
            $result = $balanceFlowTypeRepository->listBySelect();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar select");
        }

        return ApiResponse::success($result);
    }

    public function listTypesOfVoucherMovements()
    {
        return ApiResponse::success(BalanceFlowConst::VOUCHER_MOVEMENTS);
    }

    public function listDeliveryOrderStatuses(DeliveryOrderStatusRepository $deliveryOrderStatusRepository)
    {
        try {
            $result = $deliveryOrderStatusRepository->listBySelect();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar select");
        }

        return ApiResponse::success($result);
    }

    public function listDeliveryPaymentForms(DeliveryPaymentFormRepository $deliveryPaymentFormRepository)
    {
        try {
            $result = $deliveryPaymentFormRepository->listBySelect();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar select");
        }

        return ApiResponse::success($result);
    }

    public function listUserRegistrationLocations(): JsonResponse
    {
        return ApiResponse::success(UserConst::REGISTRATION_LOCATIONS_FOR_SELECT);
    }

    public function listAllCentral(CentralRepository $centralRepository)
    {
        try {
            $result = $centralRepository->listAllCentral();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar central");
        }

        return ApiResponse::success($result);
    }

    public function listTypesOfVoucherMovementsCentral()
    {
        return ApiResponse::success(BalanceFlowConst::VOUCHER_MOVEMENTS_CENTRAL);
    }

    public function listCallSourceType()
    {
        return ApiResponse::success(TripCallTypeConst::TRIP_CALL_TYPE);
    }
}
