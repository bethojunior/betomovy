<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 19/05/2020
 * Time: 15:52
 */

namespace App\Services\Delivery;


use App\Models\Delivery\DeliveryPaymentForm;
use App\Repositories\Delivery\DeliveryPaymentFormRepository;

class DeliveryPaymentFormService
{
    /**
     * @var DeliveryPaymentFormRepository
     */
    private $repository;

    public function __construct(DeliveryPaymentFormRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll()
    {
        return $this->repository
            ->findAll();
    }

    /**
     * @param array $request
     * @return DeliveryPaymentForm
     */
    public function insert(array $request): DeliveryPaymentForm
    {
        $deliveryPaymentForm = new DeliveryPaymentForm($request);
        $deliveryPaymentForm->save();

        return $deliveryPaymentForm;
    }

    /**
     * @param DeliveryPaymentForm $deliveryPaymentForm
     * @param array $request
     * @return DeliveryPaymentForm
     * @throws \Exception
     */
    public function update(DeliveryPaymentForm $deliveryPaymentForm, array $request): DeliveryPaymentForm
    {
        $deliveryPaymentForm->delete();

        return $this->insert($request);
    }

    /**
     * @param DeliveryPaymentForm $deliveryPaymentForm
     * @return bool|null
     * @throws \Exception
     */
    public function delete(DeliveryPaymentForm $deliveryPaymentForm): ?bool
    {
        return $deliveryPaymentForm->delete();
    }
}
