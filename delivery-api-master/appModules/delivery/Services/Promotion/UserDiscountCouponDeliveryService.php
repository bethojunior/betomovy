<?php


namespace Delivery\Services\Promotion;


use Delivery\Models\Promotion\UserDiscountCouponDelivery;
use Delivery\Repositories\Promotion\DiscountCouponDeliveryRepository;
use Delivery\Repositories\Promotion\UserDiscountCouponDeliveryRepository;

class UserDiscountCouponDeliveryService
{
    private $repository;
    private $discountCouponDeliveryRepository;

    public function __construct(UserDiscountCouponDeliveryRepository $repository,
        DiscountCouponDeliveryRepository $discountCouponDeliveryRepository)
    {
        $this->repository = $repository;
        $this->discountCouponDeliveryRepository = $discountCouponDeliveryRepository;
    }

    /**
     * @param array $request
     * @return UserDiscountCouponDelivery
     * @throws \Exception
     */
    public function insert(array $request)
    {
        $discountCouponDelivery = $this->discountCouponDeliveryRepository->findCouponByCode($request['code']);

        if(is_null($discountCouponDelivery))
            throw new \Exception("Cupom inválido");

        $userDiscountCouponDelivery = new UserDiscountCouponDelivery($request);
        $userDiscountCouponDelivery->discountCouponDeliveryId = $discountCouponDelivery->id;
        $userDiscountCouponDelivery->userId = $request['userId'];

        if($this->repository->couponAlreadyAdded($userDiscountCouponDelivery))
            throw new \Exception("Cupom já adicionado");

        $userDiscountCouponDelivery->save();

        return $userDiscountCouponDelivery;
    }

    public function findAll($userId)
    {
        return $this->repository->findAll($userId);
    }

    public function findAllCompany($userId,$companyId)
    {
        return $this->repository->findAllCompany($userId, $companyId);
    }
}
