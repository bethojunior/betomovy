<?php

namespace App\Services\Sale;

use App\Constants\StatusConst;
use App\Constants\Users\GenderConst;
use App\Exceptions\Sale\UniquePromotionCityException;
use App\Models\DiscountCoupon\DiscountCoupon;
use App\Models\Sale\SaleTrip;
use App\Repositories\Sale\SaleTripRepository;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SaleTripService
{
    /**
     * @var SaleTripRepository
     */
    private $repository;

    public function __construct(SaleTripRepository $repository)
    {
        $this->repository = $repository;
    }

    public function all(array $request = [], int $cityId = null): Collection
    {
        return $this->repository->findAll($request, $cityId, (bool)(Auth::user())->role->support);
    }

    public function find(int $id)
    {
        return $this->repository->find($id);
    }

    /**
     * @param array $data
     * @return Builder|Model
     */
    public function store(array $data)
    {
        if ($data['status']) {
            $existsCity = $this->repository->where([
                ['cityId', $data['cityId']],
                ['status', StatusConst::ACTIVE],
            ])->first();

            if ($existsCity) {
                throw new UniquePromotionCityException("Essa cidade já tem uma promoção ativa");
            }
        }

        try {
            DB::beginTransaction();
            $saleTrip = SaleTrip::create($data);

            if ($data['type'] === "trip") {
                $discountCouponData = [
                    'code' => $data['label'],
                    'tripPaymentFormId' => $data['tripPaymentFormId'] ?? null,
                    'genderId' => GenderConst::ALL,
                    'value' => 100,
                    'valueType' => "%",
                    'limitedTo' => $data['limitedTo'],
                    'fromValue' => 0,
                    'bonusDriver' => false,
                    'uniqueUse' => true,
                    'active' => intval($data['status']),
                    'dateStart' => Carbon::parse($data['startDay'])->startOfDay(),
                    'dateEnd' => Carbon::parse($data['endDay'])->endOfDay(),
                    'cityId' => $data['cityId'],
                    'maxDiscountValue' => $data['limitedTo'],
                    'saleTripId' => $saleTrip->id
                ];

                DiscountCoupon::create($discountCouponData);
            }
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return $saleTrip;
    }

    public function delete(int $id): ?bool
    {
        $saleTrip = $this->repository->find($id);

        if ($saleTrip->type === 'trip') {
            $saleTrip->discountCoupon->update([
                'active' => false,
                'statusId' => StatusConst::REMOVED
            ]);
        }

        return $saleTrip->delete();
    }

    /**
     * @param array $data
     * @param int $id
     * @return Builder|Model
     */
    public function update(array $data, int $id)
    {
        $saleTrip = $this->repository->find($id);

        if (!$saleTrip) {
            throw new Exception("Essa promoção não existe");
        }

        $existsCity = $this->repository->where([
            ['cityId', $data['cityId']],
            ['status', StatusConst::ACTIVE],
        ])->first();

        if ($existsCity && $existsCity->id !== $id) {
            throw new UniquePromotionCityException("Essa cidade já tem uma promoção ativa");
        }

        if ($data['type'] === "trip") {
            $tripPaymentFormCash = 2;

            $discountCouponData = [
                'code' => $data['label'],
                'tripPaymentFormId' => $tripPaymentFormCash,
                'genderId' => GenderConst::ALL,
                'value' => 100,
                'valueType' => "%",
                'limitedTo' => $data['limitedTo'],
                'fromValue' => 0,
                'bonusDriver' => false,
                'uniqueUse' => true,
                'active' => intval($data['status']),
                'statusId' => $data['status'] == 1 ? StatusConst::ACTIVE : StatusConst::REMOVED,
                'dateStart' => Carbon::parse($data['startDay'])->startOfDay(),
                'dateEnd' => Carbon::parse($data['endDay'])->endOfDay(),
                'cityId' => $data['cityId'],
                'maxDiscountValue' => $data['limitedTo'],
                'saleTripId' => $saleTrip->id
            ];

            DiscountCoupon::updateOrCreate(['saleTripId' => $saleTrip->id], $discountCouponData);
        } else if ($saleTrip->discountCoupon && $data['type'] === "voucher") {
            $saleTrip->discountCoupon->update([
                'active' => false,
                'statusId' => StatusConst::REMOVED
            ]);
        }

        $saleTrip->update($data);

        return $saleTrip;
    }
}
