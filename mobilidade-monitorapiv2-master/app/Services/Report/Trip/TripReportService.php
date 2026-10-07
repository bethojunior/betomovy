<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 06/11/2019
 * Time: 11:51
 */

namespace App\Services\Report\Trip;


use App\Constants\Trip\TripConst;
use App\Exceptions\Report\ReportException;
use App\Exports\Report\ReportDefaultExport;
use App\Exports\Report\ReportDefaultMultiExport;
use App\Repositories\Balance\BalanceFlowRepository;
use App\Repositories\Report\Driver\FinancialDetailOfTripReportRepository;
use App\Repositories\Report\TripReportRepository;
use App\Repositories\Report\TripSummaryViewReportRepository;
use App\Utils\FormatString;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\Auth;

class TripReportService
{
    /**
     * @var TripReportRepository
     */
    private $tripReportRepository;
    /**
     * @var TripSummaryViewReportRepository
     */
    private $tripSummaryViewReportRepository;
    /**
     * @var BalanceFlowRepository
     */
    private $balanceFlowRepository;

    public function __construct(TripReportRepository                  $tripReportRepository,
                                TripSummaryViewReportRepository       $tripSummaryViewReportRepository,
                                FinancialDetailOfTripReportRepository $financialDetailOfTripReportRepository,
                                BalanceFlowRepository                 $balanceFlowRepository)
    {
        $this->tripReportRepository = $tripReportRepository;
        $this->tripSummaryViewReportRepository = $tripSummaryViewReportRepository;
        $this->balanceFlowRepository = $balanceFlowRepository;
    }

    public function totalValuesByDriver(array $queryRequest = [])
    {
        $result = $this->tripReportRepository
            ->tripValuesByDriver($queryRequest);

        return
            $result->isEmpty() ? null : $result;
    }


    public function countersTripHistory(array $request)
    {
        if (!isset($request['date']))
            throw new ReportException("O campo data precisa ser enviado");

        $dayStart = Carbon::parse($request['date']);
        $dayEnd = Carbon::parse($request['date']);

        $dayResult = $this->tripReportRepository
            ->counterTripHistoryByPeriod($dayStart, $dayEnd, $request, (Auth::user())->role);

        $weekStart = $dayStart->copy()->startOfWeek();
        $weekEnd = $dayEnd->copy()->endOfWeek();

        $weekResult = $this->tripReportRepository
            ->counterTripHistoryByPeriod($weekStart, $weekEnd, $request, (Auth::user())->role);

        $monthStart = $weekStart->copy()->startOfMonth();
        $monthEnd = $weekEnd->copy()->endOfMonth();

        $monthResult = $this->tripReportRepository
            ->counterTripHistoryByPeriod($monthStart, $monthEnd, $request, (Auth::user())->role);

        $arrayResult = [
            [
                'Tipo' => '',
                'Dia' => $dayStart->format('d/m/Y'),
                'Semana' => $weekStart->format('d/m/Y') . ' a ' . $weekEnd->format('d/m/Y'),
                'Mês' => ucfirst($monthStart->monthName),
            ],
        ];

        $columnsAndAttributes = [
            'CHAMADAS' => 'total',
            'ATENDIDAS' => 'allowed',
            'REJEITADAS' => 'rejected',
            'CANCELADAS' => 'canceled',
            'CANCELADAS / MOTORISTA' => 'canceledByDriver',
            'CANCELADAS / CLIENTE' => 'canceledByCustomer',
        ];

        foreach ($columnsAndAttributes as $column => $attribute) {
            $arrayResult[] = [
                'Tipo' => $column,
                'Dia' => $dayResult->$attribute ?? 0,
                'Semana' => $weekResult->$attribute ?? 0,
                'Mês' => $monthResult->$attribute ?? 0,
            ];
        }

        return new ReportDefaultExport($arrayResult);
    }

    /**
     * @param array $request
     * @return ReportDefaultMultiExport
     * @throws ReportException
     */
    public function listAll(array $request = [])
    {
        $this->validateTripHistory($request);

        $data = [];
        $trips = $this->tripReportRepository->findAll($request, Auth::user());

        $trips->transform(function ($trip) {
            return [
                'ID' => $trip->tripReference,
                'Criado por / Operador' => FormatString::removeEmoji($trip->createdByName),
                'Email do operador' => $trip->createdByEmail,
                'Data Início' => Carbon::parse($trip->date)->format('d/m/Y H:i:s'),
                'Data Final' => $trip->endDate ? Carbon::parse($trip->endDate)->format('d/m/Y H:i:s') : null,
                'Motorista' => FormatString::removeEmoji($trip->driverName),
                'Email Motorista' => $trip->driverEmail,
                'Cliente' => FormatString::removeEmoji($trip->customerName),
                'Email Cliente' => $trip->customerEmail,
                'Telefone Cliente' => preg_replace('/[^0-9]/', '', $trip->customerPhone),
                'Distância (KM)' => $trip->distance,
                'Tempo Aproximado (MIN)' => $trip->estimatedTripTime,
                'Status' => TripConst::translateStatus($trip->status),
                'Tipo de Viagem' => $trip->tripType,
                'Forma de Chamado' => $trip->tripCallType,
                'Cidade' => $trip->cityName,
                'Origem' => FormatString::removeEmoji($trip->originAddress),
                'Destino' => FormatString::removeEmoji($trip->destinationAddress),
                'Forma de Pagamento' => FormatString::removeEmoji($trip->paymentForm),
                'Cupom de Desconto Utilizado' => FormatString::removeEmoji($trip->discountCoupon),
                'Valor R$' => $trip->price ? brazilianCash($trip->price) : null,
                'Taxa do Aplicativo R$' => brazilianCash($trip->appValue ?? 0),
                'Taxa de Cancelamento R$' => $trip->cancellationFee ? brazilianCash($trip->cancellationFee) : null,
                'Taxa de Forma de Pagamento R$' => $trip->paymentFormFee ? brazilianCash($trip->paymentFormFee) : null,
                'Outras Taxas R$' => $trip->otherFee ? brazilianCash($trip->otherFee) : null,
                'Bonificação R$' => $trip->driverReward ? brazilianCash($trip->driverReward) : null,
                'Valor Líquido do Motorista R$' => brazilianCash($trip->driverValue ?? 0),
                'Quem fez o Cancelamento' => TripConst::translateCanceledBy($trip->canceledBy),
                'Motivo do Cancelamento' => FormatString::removeEmoji($trip->cancellationReasons),
                'Avaliação do Passageiro pelo Motorista' => $trip->evaluationByDriver,
                'Avaliação do Motorista pelo Passageiro' => $trip->evaluationByCustomer,
                'Observação' => FormatString::removeEmoji($trip->description),
                'Dados adicionais' => $trip->documents,
                'Sistema Operacional' => $trip->platform,
            ];
        });

        if ($trips->isNotEmpty()) {
            $data = array_chunk($trips->toArray(), 5000);
        }

        return new ReportDefaultMultiExport($data);
    }

    /**
     * @param array $request
     * @return ReportDefaultExport
     * @throws ReportException
     */
    public function listAllWithCentralFee(array $request = [])
    {
        $this->validateTripHistory($request);

        $trips = $this->tripReportRepository
            ->findAll($request, Auth::user(), true);

        $trips->transform(function ($trip) {
            return [
                'ID' => $trip->tripReference,
                'Criado por / Operador' => FormatString::removeEmoji($trip->createdByName),
                'Email do operador' => $trip->createdByEmail,
                'Data Início' => Carbon::parse($trip->date)->format('d/m/Y H:i:s'),
                'Data Final' => $trip->endDate ? Carbon::parse($trip->endDate)->format('d/m/Y H:i:s') : null,
                'Motorista' => FormatString::removeEmoji($trip->driverName),
                'Email Motorista' => $trip->driverEmail,
                'Cliente' => FormatString::removeEmoji($trip->customerName),
                'Email Cliente' => $trip->customerEmail,
                'Distância (KM)' => $trip->distance,
                'Tempo Aproximado (MIN)' => $trip->estimatedTripTime,
                'Status' => TripConst::translateStatus($trip->status),
                'Tipo de Viagem' => $trip->tripType,
                'Forma de Chamado' => $trip->tripCallType,
                'Cidade' => $trip->cityName,
                'Origem' => $trip->originAddress,
                'Destino' => $trip->destinationAddress,
                'Forma de Pagamento' => $trip->paymentForm,
                'Cupom de Desconto Utilizado' => $trip->discountCoupon,
                'Valor R$' => $trip->price ? brazilianCash($trip->price) : null,
                'Taxa do Aplicativo R$' => brazilianCash($trip->appValue ?? 0),
                'Taxa de Cancelamento R$' => $trip->cancellationFee ? brazilianCash($trip->cancellationFee) : null,
                'Taxa de Forma de Pagamento R$' => $trip->paymentFormFee ? brazilianCash($trip->paymentFormFee) : null,
                'Outras Taxas R$' => $trip->otherFee ? brazilianCash($trip->otherFee) : null,
                'Taxa de retorno' => $trip->returnFee ? brazilianCash($trip->returnFee) : null,
                'Bonificação R$' => $trip->driverReward ? brazilianCash($trip->driverReward) : null,
                'Valor Líquido do Motorista R$' => brazilianCash($trip->driverValue ?? 0),
                'Quem fez o Cancelamento' => TripConst::translateCanceledBy($trip->canceledBy),
                'Motivo do Cancelamento' => $trip->cancellationReasons,
                'Avaliação do Passageiro pelo Motorista' => $trip->evaluationByDriver,
                'Avaliação do Motorista pelo Passageiro' => $trip->evaluationByCustomer,
                'Observação' => $trip->description,
                'Dados adicionais' => $trip->documents,
                'Sistema Operacional' => $trip->platform
            ];
        });

        $array = $trips->toArray();

        return new ReportDefaultExport($array);
    }

    /**
     * @param array $request
     * @return ReportDefaultExport
     */
    public function corporateTravelList(array $request = [], int $cityId = null)
    {
        $this->validateTripHistory($request);

        $trips = $this->tripReportRepository->corporateTravelList($request, (Auth::user())->role->support, $cityId);

        return new ReportDefaultExport($trips->transform(function ($trip) {

            $startDate = Carbon::parse($trip->date);
            $endDate = Carbon::parse($trip->endDate);

            return [
                'Passageiro' => FormatString::removeEmoji($trip->customerName),
                'CPF' => $trip->document,
                'Empresa' => $trip->fantasyName,
                'Status da viagem' => TripConst::translateStatus($trip->status),
                'Preço R$' => $trip->price ? brazilianCash($trip->price) : null,
                'Data Início' => $startDate->format('d/m/Y H:i:s'),
                'Data Final' => $endDate->format('d/m/Y H:i:s') ?? null
            ];
        })
            ->toArray()
        );
    }

    /**
     * @param array $request
     * @return ReportDefaultExport
     */
    public function financialStatementAdministrativeVoucher(array $request = [], int $cityId = null)
    {

        $trips = $this->balanceFlowRepository->financialStatementAdministrativeVoucher($request, (Auth::user())->role->support, $cityId);

        return new ReportDefaultExport($trips->transform(function ($trip) {

            $tripDate = Carbon::parse($trip->date);

            return [
                'Empresa' => $trip->fantasyName,
                'Data' => $tripDate,
                'Preço R$' => $trip->value,
                'Fluxo' => $trip->flow,
                'Descrição' => $trip->name
            ];
        })
            ->toArray()
        );
    }

    /**
     * @param array $request
     * @throws ReportException
     */
    private function validateTripHistory(array $request)
    {
        if (!isset($request['dateStart']))
            throw new ReportException("Uma data de início precisa ser informada");

        if (!isset($request['dateEnd']))
            throw new ReportException("Uma data final precisa ser informada");

        $dateStart = Carbon::parse($request['dateStart']);
        $dateEnd = Carbon::parse($request['dateEnd']);

        if ($dateStart->isAfter($dateEnd))
            throw new ReportException("A Data de início não pode ser maior que a data final");

        if ($dateStart->diffInDays($dateEnd) > 90)
            throw new ReportException("O período entre as datas não pode ser maior que 90 dias");
    }

    public function getAllSharedRoutes(array $request)
    {
        $trips = $this->tripReportRepository
            ->getAllSharedRoutes($request, (Auth::user())->role);

        return new ReportDefaultExport($trips->transform(function ($trip) {
            return [
                'Motorista' => FormatString::removeEmoji($trip->driverName),
                'Cliente' => FormatString::removeEmoji($trip->customerName),
                'Ticket' => $trip->tripReference,
                'Data Início' => Carbon::parse($trip->date)->format('d/m/Y H:i:s'),
                'Data Final' => $trip->endDate ? Carbon::parse($trip->endDate)->format('d/m/Y H:i:s') : null,
                'Valor R$' => $trip->value ? brazilianCash($trip->value) : null,
                'Status' => TripConst::translateStatus($trip->status),
                'Forma de Pagamento' => $trip->tripPaymentForm,
                'Origem' => $trip->origin,
                'Destino' => $trip->destination,
            ];
        })->toArray()
        );
    }

    public function callProduction(array $request = [])
    {
        $this->validateTripHistory($request);

        $data = [];
        $trips = $this->tripReportRepository->callProduction($request, Auth::user());

        $trips->transform(function ($trip) {
            $waypoints = $trip->tripWayPoints;
            $stopCount = count($waypoints);
            $stops = "";
            foreach ($waypoints as $waypoint) {
                $stops .= $waypoint->address . " || ";
            }
            $stops = rtrim($stops, " || ");
            return [
                'Origem Chamado' => $trip->tripCallType !== 'CHAMADA POR CENTRAL' ? 'App' : 'Central',
                'KM Total' => number_format($trip->distance, 2),
                'Cidade' => $trip->cityName,
                'Cliente' => FormatString::removeEmoji($trip->customerName),
                'Criado por / Operador' => FormatString::removeEmoji($trip->createdByName),
                'Email do operador' => $trip->createdByEmail,
                'Entregador / Motorista / Parceiro' => FormatString::removeEmoji($trip->driverName),
                'Origem' => FormatString::removeEmoji($trip->originAddress),
                'Destino' => FormatString::removeEmoji($trip->destinationAddress),
                'Paradas' => $stopCount > 0 ? $stopCount . " paradas: " . $stops : "Sem paradas",
                'Forma de Pagamento' => FormatString::removeEmoji($trip->paymentForm),
                'Status' => TripConst::translateStatus($trip->status),
                'Valor R$' => $trip->price ? brazilianCash($trip->price) : null,
                'Taxa do Aplicativo R$' => brazilianCash($trip->appValue ?? 0),
                'Bonificação R$' => $trip->driverReward ? brazilianCash($trip->driverReward) : null,
                'Viagem R$' => brazilianCash($trip->driverValue ?? 0),
                'Data Início' => Carbon::parse($trip->date)->format('d/m/Y H:i:s'),
                'Data Final' => $trip->endDate ? Carbon::parse($trip->endDate)->format('d/m/Y H:i:s') : null,
            ];
        });

        $array = $trips->toArray();

        return new ReportDefaultExport($array);
    }

}
