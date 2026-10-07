<?php


namespace App\Http\Controllers\Report;


use Api\Repositories\Order\DeliveryOrderStatusRepository;
use App\Http\Controllers\Controller;
use App\Repositories\Company\DeliveryPaymentFormRepository;

class ReportController extends Controller
{
    private $deliveryOrderStatusRepository;

    public function __construct(DeliveryOrderStatusRepository $deliveryOrderStatusRepository)
    {
        $this->deliveryOrderStatusRepository = $deliveryOrderStatusRepository;
    }

    public function orders(DeliveryPaymentFormRepository $deliveryPaymentFormRepository)
    {
        $listDeliveryOrderStatus = $this->deliveryOrderStatusRepository->all();
        $deliveryPaymentForms = $deliveryPaymentFormRepository->all();
        return view('report.orders',compact('listDeliveryOrderStatus', 'deliveryPaymentForms'));
    }
}
