<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 01/06/2020
 * Time: 08:11
 */

namespace Delivery\Services\Product;


use Delivery\Models\Product\DeliveryProduct;
use Delivery\Repositories\Product\DeliveryCategoryRepository;
use Delivery\Repositories\Product\DeliveryProductRepository;

class DeliveryProductService
{
    /**
     * @var DeliveryCategoryRepository
     */
    private $deliveryCategoryRepository;
    /**
     * @var DeliveryProductRepository
     */
    private $deliveryProductRepository;

    public function __construct(DeliveryCategoryRepository $deliveryCategoryRepository,
                                DeliveryProductRepository $deliveryProductRepository)
    {
        $this->deliveryCategoryRepository = $deliveryCategoryRepository;
        $this->deliveryProductRepository = $deliveryProductRepository;
    }

    public function findByCategoriesAndCompany(int $companyId)
    {
        return $this->deliveryCategoryRepository
            ->findByCompany($companyId);
    }

    public function find(DeliveryProduct $deliveryProduct)
    {
        return $this->deliveryProductRepository
            ->findOne($deliveryProduct->id);
    }
}
