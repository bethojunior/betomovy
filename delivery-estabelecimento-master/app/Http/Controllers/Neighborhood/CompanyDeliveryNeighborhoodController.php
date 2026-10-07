<?php

namespace App\Http\Controllers\Neighborhood;

use App\Http\Controllers\Controller;
use App\Http\Requests\Neighborhood\CompanyDeliveryNeighborhoodRequest;
use Api\Http\Responses\ApiResponse;
use App\Models\Neighborhood\CompanyDeliveryNeighborhood;
use App\Services\Neighborhood\CompanyDeliveryNeighborhoodService;
use Illuminate\Http\Request;

class CompanyDeliveryNeighborhoodController extends Controller
{
    /**
     * @var CompanyDeliveryNeighborhoodService
     */
    private $service;

    public function __construct(CompanyDeliveryNeighborhoodService $service)
    {
        $this->service = $service;
    }

    public function store(CompanyDeliveryNeighborhoodRequest $request)
    {
        try {
            $this->service
                ->store($request->validated());

            toast("Zona de entrega inserida com sucesso", 'success');
        } catch (\Exception $e) {
            toast($e->getMessage(), 'error');
        }
        return redirect()
            ->back();
    }

    public function delete(CompanyDeliveryNeighborhood $companyDeliveryNeighborhood)
    {
        try {
            $this->service
                ->delete($companyDeliveryNeighborhood);

            toast("Zona de entrega excluída com sucesso", 'success');
        } catch (\Exception $e) {
            toast($e->getMessage(), 'error');
        }

        return redirect()
            ->back();
    }

    public function activate(CompanyDeliveryNeighborhood $companyDeliveryNeighborhood,
                             Request $request)
    {
        try {
            $companyDeliveryNeighborhood = $this->service
                ->updateActive($companyDeliveryNeighborhood, true);
            toast("Zona de entrega ativada com sucesso", 'success');
        } catch (\Exception $e) {
            toast($e->getMessage(), 'error');
        }

        if ($request->ajax())
            return ApiResponse::success($companyDeliveryNeighborhood);

        return redirect()
            ->back();
    }

    public function disable(CompanyDeliveryNeighborhood $companyDeliveryNeighborhood,
                            Request $request)
    {
        try {
            $companyDeliveryNeighborhood = $this->service
                ->updateActive($companyDeliveryNeighborhood, false);
            toast("Zona de entrega desativada com sucesso", 'success');
        } catch (\Exception $e) {
            toast($e->getMessage(), 'error');
        }

        if ($request->ajax())
            return ApiResponse::success($companyDeliveryNeighborhood);

        return redirect()
            ->back();
    }
}
