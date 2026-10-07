<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/11/2019
 * Time: 08:39
 */

namespace App\Services\DiscountCoupon;


use App\Constants\StatusConst;
use App\Models\DiscountCoupon\DiscountCoupon;
use App\Repositories\DiscountCoupon\DiscountCouponRepository;
use Illuminate\Support\Facades\Auth;

class DiscountCouponService
{
    /**
     * @var DiscountCouponRepository
     */
    private $repository;

    public function __construct(DiscountCouponRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll(array $queryRequest = [])
    {
        return $this->repository
            ->findAll($queryRequest, (Auth::user())->role);
    }

    public function insert(array $request)
    {
        $discountCoupon = new DiscountCoupon($request);

        $this->repository->save($discountCoupon);

        return $discountCoupon;
    }

    public function updateStatus($id, int $active = 1)
    {
        /** @var DiscountCoupon $discountCoupon */
        $discountCoupon = $this->repository
            ->find($id);

        $discountCoupon
            ->active = $active;

        $this->repository
            ->save($discountCoupon);

        return $discountCoupon;
    }

    public function delete($id)
    {
        /** @var DiscountCoupon $discountCoupon */
        $discountCoupon = $this->repository
            ->find($id);

        $discountCoupon
            ->statusId = StatusConst::REMOVED;

        $this->repository
            ->save($discountCoupon);

        return true;
    }
}
