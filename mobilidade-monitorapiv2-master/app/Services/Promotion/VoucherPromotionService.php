<?php


namespace App\Services\Promotion;


use App\Constants\StatusConst;
use App\Models\Promotion\VoucherPromotion;
use App\Repositories\Promotion\VoucherPromotionRepository;
use Illuminate\Support\Facades\Auth;

class VoucherPromotionService
{
    private $repository;

    public function __construct(VoucherPromotionRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll(array $request = [])
    {
        return $this->repository->findAll($request, (Auth::user())->role);
    }

    public function find(int $id)
    {
        return VoucherPromotion::findOrFail($id);
    }

    public function save(array $data)
    {
        return VoucherPromotion::create($data);
    }

    public function update(int $id, array $data)
    {
        $voucherPromotion = VoucherPromotion::findOrFail($id);
        $voucherPromotion->update($data);

        return $voucherPromotion;
    }

    public function delete(int $id)
    {
        $voucherPromotion = VoucherPromotion::findOrFail($id);
        $voucherPromotion->statusId = StatusConst::REMOVED;

        return $voucherPromotion->save();
    }
}
