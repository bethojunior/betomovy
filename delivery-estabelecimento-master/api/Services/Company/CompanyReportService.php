<?php


namespace Api\Services\Company;


use Api\Exports\Report\ReportDefaultExport;
use Api\Repositories\Order\DeliveryOrderRepository;
use Api\Utils\FormatString;
use Carbon\Carbon;
use Common\Models\Order\DeliveryOrder;

class CompanyReportService
{
    private $repository;

    public function __construct(DeliveryOrderRepository $repository)
    {
        $this->repository = $repository;
    }

    public function orders($companyId, array $request)
    {
        $orders = $this->repository->findAllToReport($companyId, $request);
        return new ReportDefaultExport($orders->transform(function ($order) {
            return [
                'ID Pedido' => $order->id,
                'ID Estabelecimento' => $order->companyId,
                'Estabelecimento' => FormatString::removeEmoji($order->companyName),
                'ID Cliente' => $order->userId,
                'Cliente' => FormatString::removeEmoji($order->userName),
                'ID Entregador' => $order->driverId,
                'Entregador' => FormatString::removeEmoji($order->driverName),
                'Valor Pedido' => $order->orderValue ? FormatString::brazilianCash($order->orderValue) : null,
                'Status' => $order->deliveryOrderStatus,
                'Forma de Pagamento' => $order->deliveryPaymentForm,
                'Cupom de Desconto' => $order->discountCoupon,
                'Valor do Cupom' => $order->discountCouponValue ? FormatString::brazilianCash($order->discountCouponValue) : null,
                'Taxa de Entrega' => $order->deliveryFee ? FormatString::brazilianCash($order->deliveryFee) : null,
                'Valor Total do Pedido' => $order->totalOrderValue ? FormatString::brazilianCash($order->totalOrderValue) : null,
                'Taxa Sob Venda $' => $order->chargeOrderPercentage ? FormatString::brazilianCash($order->chargeOrderPercentage) : null,
                'Taxa Sob Venda %' => $order->chargeOrderValue,
                'Data' => Carbon::parse($order->created_at)->format('d/m/Y H:i:s'),
            ];
        })->toArray());
    }
}
