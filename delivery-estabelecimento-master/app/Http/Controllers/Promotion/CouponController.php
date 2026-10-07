<?php


namespace App\Http\Controllers\Promotion;


use App\Http\Controllers\Controller;
use App\Http\Requests\Promotion\DiscountCouponDeliveryRequest;
use App\Services\Promotion\DiscountCouponDeliveryService;

class CouponController extends Controller
{
    private $service;

    public function __construct(DiscountCouponDeliveryService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $coupons = $this->service->list();

        return view('promotion.coupons',['coupons'=> $coupons]);
    }

    public function store(DiscountCouponDeliveryRequest $request)
    {
        try {
            $this->service->store($request->validated());

            toast("Cupom inserida com sucesso", 'success');
        } catch (\Exception $e) {
            toast($e->getMessage(), 'error');
        }
        return redirect()
            ->back();
    }

    public function delete($id)
    {
        try {
            $this->service->delete($id);

            toast("Cupom excluido com sucesso", 'success');
        } catch (\Exception $e) {
            toast($e->getMessage(), 'error');
        }
        return redirect()
            ->back();
    }
}
