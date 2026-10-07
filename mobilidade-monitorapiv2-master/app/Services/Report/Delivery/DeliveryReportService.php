<?php


namespace App\Services\Report\Delivery;


use App\Exports\Report\ReportDefaultExport;
use App\Repositories\Report\DeliveryReportRepository;
use App\Utils\FormatString;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class DeliveryReportService
{
    private $repository;

    public function __construct(DeliveryReportRepository $repository)
    {
        $this->repository = $repository;
    }

    public function allOrders(array $request = [], int $cityId = null)
    {
        $orders = $this->repository->allOrders($request, (bool)(Auth::user())->role->support, $cityId);

        return new ReportDefaultExport(
            $orders->transform(function ($order) {
                return [
                    'ID Estabelecimento' => $order->companyId,
                    'Estabelecimento' => FormatString::removeEmoji($order->companyName),
                    'ID Cliente' => $order->userId,
                    'Cliente' => FormatString::removeEmoji($order->userName),
                    'ID Motorista' => $order->driverId,
                    'Motorista' => FormatString::removeEmoji($order->driverName),
                    'ID Pedido' => $order->id,
                    'Valor Pedido' => $order->orderValue ? brazilianCash($order->orderValue) : null,
                    'Status' => $order->deliveryOrderStatus,
                    'Forma de Pagamento' => $order->deliveryPaymentForm,
                    'Cupom de Desconto' => $order->discountCoupon,
                    'Valor do Cupom' => $order->discountCouponValue ? brazilianCash($order->discountCouponValue) : null,
                    'Taxa de Entrega' => $order->deliveryFee ? brazilianCash($order->deliveryFee) : null,
                    'Valor Total do Pedido' => $order->totalOrderValue ? brazilianCash($order->totalOrderValue) : null,
                    'Taxa Sob Venda $' => $order->chargeOrderValue ? brazilianCash($order->chargeOrderValue) : null,
                    'Taxa Sob Venda %' => $order->chargeOrderPercentage,
                    'Data' => Carbon::parse($order->created_at)->format('d/m/Y H:i:s'),
                ];
            })->toArray()
        );
    }
    public function deliveryFeeManagement(array $request = [])
    {
        $couriers = $this->repository->deliveryFeeManagement($request, (Auth::user())->role);

        return new ReportDefaultExport($couriers->transform(function ($courier) {
            return [
                'Nome' => FormatString::removeEmoji($courier->name),
                'CPF' => $courier->document,
                'Telefone' => $courier->phone,
                'Email' => $courier->email,
                'Tipo de Motorista' => $courier->userType,
                'Status do Motorista' => $courier->driverRegisterStatus,
                'Cidade' => $courier->cityName,
                'Taxa de Cliente (+) R$' => $courier->deliveryRateTax ? brazilianCash($courier->deliveryRateTax) : null,
                'Taxa Retida Enregador (-) R$' => $courier->deliveryServiceFee ? brazilianCash($courier->deliveryServiceFee) : null,
                'Saldo Atual(R$)' => brazilianCash($courier->balance ?? 0),
                'Data' => Carbon::parse($courier->created_at)->format('d/m/Y H:i:s'),
            ];
        })
            ->toArray()
        );
    }
}
