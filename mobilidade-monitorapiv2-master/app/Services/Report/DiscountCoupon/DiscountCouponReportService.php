<?php


namespace App\Services\Report\DiscountCoupon;


use App\Constants\Trip\TripConst;
use App\Exports\Report\ReportDefaultExport;
use App\Repositories\Report\DiscountCouponReportRepository;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class DiscountCouponReportService
{
    private $repository;

    /**
     * DiscountCuponReportService constructor.
     * @param DiscountCouponReportRepository $discountCuponRepository
     */
    public function __construct(DiscountCouponReportRepository $discountCuponRepository)
    {
        $this->repository = $discountCuponRepository;
    }

    public function findAllDiscountedTrip(array $request)
    {
        $trips = $this->repository->findAllDiscountedTrip($request, (Auth::user())->role);

        return new ReportDefaultExport(
            $trips->transform(function ($trip) {
                $startDate = Carbon::parse($trip->date);
                $endDate = Carbon::parse($trip->endDate);

                return [
                    'Cupom' => $trip->code,
                    'Valor do Cupom' => brazilianCash($trip->value),
                    'Tipo de Valor' => $trip->valueType,
                    'ID da Viagem' => $trip->tripReference,
                    'Data Início' => $startDate->format('d/m/Y H:i:s'),
                    'Data Final' => $endDate->format('d/m/Y H:i:s'),
                    'Valor Inicial' => $trip->oldPrice ? brazilianCash($trip->oldPrice) : null,
                    'Valor com cupom' => $trip->price ? brazilianCash($trip->price) : null,
                    'Motorista' => $trip->driverName,
                    'Cliente' => $trip->userName,
                    'Status' => TripConst::translateStatus($trip->status),
                    'Forma de Pagamento' => $trip->paymentForm,
                    'Tipo de Viagem' => $trip->tripType,
                    'Forma de Chamado' => $trip->callType,
                    'Cidade' => $trip->city,
                ];
            })->toArray()
        );
    }
}
