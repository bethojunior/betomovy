<?php


namespace Delivery\Services\Order;


use Delivery\Models\Order\DeliveryRating;
use Delivery\Repositories\Company\CompanyDeliveryConfigRepository;
use Delivery\Repositories\Company\CompanyDeliveryOrderConfigRepository;
use Delivery\Repositories\Order\DeliveryOrderRepository;
use Delivery\Repositories\Order\DeliveryRatingRepository;

class DeliveryRatingService
{
    private $deliveryRatingRepository;
    private $deliveryOrderRepository;
    private $companyDeliveryConfigRepository;

    public function __construct(
        DeliveryRatingRepository $deliveryRatingRepository,
        DeliveryOrderRepository $deliveryOrderRepository,
        CompanyDeliveryConfigRepository $companyDeliveryConfigRepository
    )
    {
        $this->deliveryRatingRepository = $deliveryRatingRepository;
        $this->deliveryOrderRepository = $deliveryOrderRepository;
        $this->companyDeliveryConfigRepository = $companyDeliveryConfigRepository;
    }


    /**
     * @param array $request
     * @return DeliveryRating
     * @throws \Exception
     */
    public function evaluate(array $request)
    {
        if ($this->deliveryRatingRepository->findByOrder($request['deliveryOrderId']))
            throw new \Exception("Pedido já avaliado");

        $deliveryOrder = $this->deliveryOrderRepository->findFully($request['deliveryOrderId']);

        $deliveryRating = new DeliveryRating();
        $deliveryRating->deliveryOrderId = $request['deliveryOrderId'];
        $deliveryRating->ratingOfTheEstablishment = $request['ratingOfTheEstablishment'] ?? null;
        $deliveryRating->priceRange = $request['priceRange'] ?? null;
        $deliveryRating->deliveryQuality = $request['priceRange'] ?? null;
        $deliveryRating->companyId = $deliveryOrder->companyId;
        $deliveryRating->driverId = $deliveryOrder->driverId;

        $deliveryRating->save();

        $companyDeliveryConfig = $this->companyDeliveryConfigRepository->findByCompany($deliveryOrder->companyId);

        $companyDeliveryConfig->deliveryRating = $this->deliveryRatingRepository->calculateRating($deliveryOrder->companyId)->avg;

        $companyDeliveryConfig->save();

        return $deliveryRating;
    }


}
