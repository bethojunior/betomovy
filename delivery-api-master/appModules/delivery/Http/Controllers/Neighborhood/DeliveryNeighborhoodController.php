<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/06/2020
 * Time: 18:35
 */

namespace Delivery\Http\Controllers\Neighborhood;


use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Delivery\Http\Requests\Neighborhood\FindNeighborhoodRequest;
use Delivery\Models\Company\Company;
use Delivery\Models\Neighborhood\DeliveryNeighborhood;
use Delivery\Services\Neighborhood\DeliveryNeighborhoodService;

class DeliveryNeighborhoodController extends Controller
{
    /**
     * @var DeliveryNeighborhoodService
     */
    private $service;

    public function __construct(DeliveryNeighborhoodService $service)
    {
        $this->service = $service;
    }

    public function findByCoordinate(FindNeighborhoodRequest $request)
    {
        try {
            $result = $this->service
                ->findByCoordinate($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar os bairros");
        }

        return ApiResponse::success($result);
    }

    public function consultDeliveryPrice(DeliveryNeighborhood $deliveryNeighborhood, Company $company)
    {
        try {
            $result = $this->service
                ->consultDeliveryPrice($deliveryNeighborhood, $company);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao consultar preço");
        }

        return ApiResponse::success($result);
    }
}
