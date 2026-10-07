<?php

/**
 * Created by PhpStorm.
 * User: BJR
 * Date: 02/01/2026
 * Time: 16:47
 */

namespace App\Services\Report\Driver;

use App\Constants\Pulse\GroupPulseConst;
use App\Constants\Report\ReportConst;
use App\Exceptions\Report\ReportException;
use App\Exports\Report\ReportDefaultExport;
use App\Exports\Report\ReportDefaultMultiExport;
use App\Models\User\Driver;
use App\Repositories\Balance\CreditPrepaidPurchaseRepository;
use App\Repositories\Report\CreditPrepaidPurchaseReportRepository;
use App\Repositories\Report\Driver\FinancialDetailOfTripReportRepository;
use App\Repositories\Report\DriverReportRepository;
use App\Repositories\Report\TripReportRepository;
use App\Repositories\Report\TripSummaryViewReportRepository;
use App\Utils\FormatString;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use App\Services\Pulse\PulseService;

class DriverReportService
{

    public PulseService $pulse;
    /**
     * @var DriverReportRepository
     */
    private $repository;
    /**
     * @var FinancialDetailOfTripReportRepository
     */
    private $financialDetailOfTripReportRepository;
    private $tripReportRepository;

    /**
     * DriverReportService constructor.
     * @param DriverReportRepository $repository
     * @param FinancialDetailOfTripReportRepository $financialDetailOfTripReportRepository
     */
    public function __construct(
        DriverReportRepository $repository,
        FinancialDetailOfTripReportRepository $financialDetailOfTripReportRepository,
        TripSummaryViewReportRepository $tripSummaryViewReportRepository,
        TripReportRepository $tripReportRepository
    ) {
        $this->repository = $repository;
        $this->financialDetailOfTripReportRepository = $financialDetailOfTripReportRepository;
        $this->tripSummaryViewReportRepository = $tripSummaryViewReportRepository;
        $this->tripReportRepository = $tripReportRepository;
        $this->pulse = new PulseService('monitor-api-' . env('APP_NAME'), GroupPulseConst::REPORT);
    }

    /**
     * @param array $request
     * @return ReportDefaultExport
     */
    public function findAll(array $request)
    {
        $drivers = $this->repository->findAll($request, (Auth::user()));

        return new ReportDefaultExport(
            $drivers->transform(function ($driver) {
                return [
                    'Nome' => FormatString::removeEmoji($driver->name),
                    'CPF' => $driver->document,
                    'Telefone' => $driver->phone,
                    'Email' => $driver->email,
                    'Tipo de Motorista' => $driver->userType,
                    'Status do Motorista' => $driver->driverRegisterStatus,
                    'Placa' => $driver->plate,
                    'Marca' => $driver->brand,
                    'Modelo' => $driver->model,
                    'Cor' => $driver->color,
                    'Ano' => $driver->year,
                    'Cidade' => $driver->cityName,
                    'Saldo Atual' => $driver->balance,
                    'Registrado' => $driver->created_at ?
                        $driver->created_at->format('d/m/Y H:i:s') : null,
                    'Viagens Finalizadas' => $driver->quantityTripsFinished ?? 0
                ];
            })
                ->toArray()
        );
    }

    /**
     * @param array $request
     * @return ReportDefaultMultiExport
     * @throws ReportException
     */
    public function financialTripDrivers(array $request)
    {

        if (!isset($request['driverId'])) {
            return $this->financialTripDriversLessFilter($request);
        }

        $data = [];
        $trips = $this->financialDetailOfTripReportRepository
            ->findByDriver($request['driverId'], $request);

        $trips->transform(function ($trip) {
            return [
                'Data Viagem' => $trip->date->format('d/m/Y H:i:s'),
                'Cliente' => FormatString::removeEmoji($trip->customerName),
                'Origem' => $trip->originAddress,
                'Destino' => $trip->destinationAddress,
                'Forma de Pagamento' => $trip->paymentForm,
                'Valor Viagem' => brazilianCash($trip->price),
                'Taxa App (-)' => brazilianCash($trip->appFee),
                'Impostos + Outras Taxas (-)' => brazilianCash($trip->anotherFee),
                'Taxa Por Forma de Pgto (-)' => brazilianCash($trip->paymentFormFee),
                'Taxa de cancelamento Cliente (-)' => brazilianCash($trip->customerCancellationFee),
                'Bonificações (+)' => brazilianCash($trip->reward),
                'Valor Líquido' => brazilianCash($trip->netValue),
            ];
        });
        if ($trips->isNotEmpty()) {
            $data = array_chunk($trips->toArray(), ReportConst::ROWS_CHUNK_SIZE);
        }

        return new ReportDefaultMultiExport($data);
    }

    public function financialTripDriversLessFilter(array $request)
    {
        $data = [];
        $trips = $this->financialDetailOfTripReportRepository
            ->financialTripDriversLessFilter($request, (Auth::user())->role);

        $trips->transform(function ($trip) {
            return [
                'Data Viagem' => $trip->date->format('d/m/Y- H:i:s'),
                'Motorista' => FormatString::removeEmoji($trip->driverName),
                'Cliente' => FormatString::removeEmoji($trip->customerName),
                'Origem' => $trip->originAddress,
                'Destino' => $trip->destinationAddress,
                'Forma de Pagamento' => $trip->paymentForm,
                'Valor Viagem' => brazilianCash($trip->price),
                'Taxa App (-)' => brazilianCash($trip->appFee),
                'Impostos + Outras Taxas (-)' => brazilianCash($trip->anotherFee),
                'Taxa Por Forma de Pgto (-)' => brazilianCash($trip->paymentFormFee),
                'Taxa de cancelamento Cliente (-)' => brazilianCash($trip->customerCancellationFee),
                'Bonificações (+)' => brazilianCash($trip->reward),
                'Valor Líquido' => brazilianCash($trip->netValue),
            ];
        });

        if ($trips->isNotEmpty()) {
            $data = array_chunk($trips->toArray(), ReportConst::ROWS_CHUNK_SIZE);
        }

        return new ReportDefaultMultiExport($data);
    }

    /**
     * @param array $request
     * @return ReportDefaultExport
     * @throws ReportException
     */
    public function driverTripHistory(array $request)
    {
        $this->validateDriverTripHistory($request);

        $drivers = $this->repository
            ->tripHistory($request, Auth::user());

        return new ReportDefaultExport(
            $drivers->transform(function ($driver) {
                return [
                    'Nome' => FormatString::removeEmoji($driver->name),
                    'Status do Motorista' => $driver->driverRegisterStatus,
                    'Chamadas' => $driver->called,
                    'Atendidas' => $driver->allowed,
                    'Rejeitadas' => $driver->refused,
                    'Canceladas Pelo Motorista' => $driver->canceledByDriver,
                    'Canceladas Pelo Cliente' => $driver->canceledByCustomer,
                    'Finalizadas' => $driver->finished,
                    'Valor Total - R$ (Bruto)' => $driver->totalValue,
                ];
            })
                ->toArray()
        );
    }

    /**
     * @param array $request
     * @return ReportDefaultExport
     * @throws ReportException
     */
    public function driverTripHistoryDate(array $request)
    {
        if (!isset($request['date']))
            throw new ReportException("Uma data precisa ser informada");

        $drivers = $this->repository
            ->tripHistoryDate($request);

        return new ReportDefaultExport(
            $drivers->transform(function ($driver) {
                return [
                    'Nome' => $driver->name,
                    'Chamadas' => $driver->called,
                    'Atendidas' => $driver->allowed,
                    'Rejeitadas' => $driver->refused,
                    'Canceladas Pelo Motorista' => $driver->canceledByDriver,
                    'Canceladas Pelo Cliente' => $driver->canceledByCustomer,
                    'Finalizadas' => $driver->finished,
                    'Valor Total - R$ (Bruto)' => $driver->totalValue,
                ];
            })
                ->toArray()
        );

        // return [];
    }

    /**
     * @param array $request
     * @return ReportDefaultExport
     * @throws ReportException
     */
    public function historyDriverAllTripsValues(array $request)
    {
        $this->validateDriverTripHistory($request);

        $drivers = $this->repository
            ->historyDriverAllTripsValues($request, (Auth::user())->role);

        return new ReportDefaultExport(
            $drivers->transform(function ($driver) {

                return [
                    'Motorista' => FormatString::removeEmoji($driver->name),
                    'Cidade' => $driver->cityName,
                    'Número Corridas' => $driver->tripCount ?? 0,
                    'Número de Passageiros que tem esse motorista como favorito' =>
                    $driver->numberCustomersHaveFavoriteThisDriver ?? 0,
                    'Total das Corridas (R$)' => $driver->totalValueTrips ?? 0,
                    'Total do Motorista (R$)' => $driver->totalValueDriver ?? 0,
                    'Total do App (R$)' => $driver->totalValueApp ?? 0,
                ];
            })
                ->toArray()
        );
    }

    /**
     * @param array $request
     * @return ReportDefaultExport
     */
    public function driverOnlineTime(array $request)
    {
        $drivers = $this->repository
            ->driverOnlineTime($request, (Auth::user())->role);

        return new ReportDefaultExport(
            $drivers->transform(function ($driver) {

                return [
                    'Motorista' => FormatString::removeEmoji($driver->name),
                    'CPF' => $driver->document,
                    'Cidade' => $driver->cityName,
                    'Data de Login' => $driver->dateLogin,
                    'Quantidade de Logins' => $driver->numberOfLogins,
                    'Tempo Logado (min)' => $driver->minutesLogin,
                ];
            })
                ->toArray()
        );
    }

    /**
     * @param array $request
     * @throws ReportException
     */
    private function validateDriverTripHistory(array $request)
    {

        if (!isset($request['dateStart'])) {
            $this->pulse->handle(
                '[ReportGenerateCommand::ERROR]',
                'dateStart não informado | payload: ' . json_encode($request),
                'error'
            );

            throw new ReportException("Uma data de início precisa ser informada");
        }

        if (!isset($request['dateEnd'])) {
            $this->pulse->handle(
                '[ReportGenerateCommand::ERROR]',
                'dateEnd não informado | payload: ' . json_encode($request),
                'error'
            );

            throw new ReportException("Uma data final precisa ser informada");
        }

        $dateStart = Carbon::parse($request['dateStart']);
        $dateEnd   = Carbon::parse($request['dateEnd']);

        if ($dateStart->isAfter($dateEnd)) {
            $this->pulse->handle(
                '[ReportGenerateCommand::ERROR]',
                'dateStart maior que dateEnd | ' . json_encode([
                    'dateStart' => $request['dateStart'],
                    'dateEnd'   => $request['dateEnd'],
                ]),
                'error'
            );

            throw new ReportException(
                "A Data de início não pode ser maior que a data final"
            );
        }

        if ($dateStart->diffInDays($dateEnd) > 31) {
            $this->pulse->handle(
                '[ReportGenerateCommand::ERROR]',
                'Intervalo maior que 30 dias | ' . json_encode([
                    'dateStart' => $request['dateStart'],
                    'dateEnd'   => $request['dateEnd'],
                    'diffDays'  => $dateStart->diffInDays($dateEnd),
                ]),
                'error'
            );

            throw new ReportException(
                "O período entre as datas não pode ser maior que 31 dias"
            );
        }
    }


    public function prepaidPurchase(array $request)
    {
        $prepaidPurchases = (new CreditPrepaidPurchaseReportRepository())
            ->findAll($request, (Auth::user())->role);

        return new ReportDefaultExport(
            $prepaidPurchases->transform(function ($prepaidPurchase) {
                return [
                    'Id do Motorista' => $prepaidPurchase->idDriver,
                    'Nome do Motorista' => FormatString::removeEmoji($prepaidPurchase->driverName),
                    'Tarjeta' => $prepaidPurchase->stripe,
                    'Preço de Compra' => $prepaidPurchase->purchasePrice,
                    'Preço de Venda' => $prepaidPurchase->sellPrice,
                    'Status' => $prepaidPurchase->status,
                    'Data e Hora' => Carbon::parse($prepaidPurchase->created_at)->format('d/m/Y H:i:s'),
                ];
            })
                ->toArray()
        );
    }

    public function feeManagement(array $request)
    {
        $drivers = $this->repository->feeManagement($request, (Auth::user())->role);

        return new ReportDefaultExport(
            $drivers->transform(function ($driver) {
                return [
                    'Nome' => FormatString::removeEmoji($driver->name),
                    'CPF' => $driver->document,
                    'Telefone' => $driver->phone,
                    'Email' => $driver->email,
                    'Tipo de Motorista' => $driver->userType,
                    'Status do Motorista' => $driver->driverRegisterStatus,
                    'Cidade' => $driver->cityName,
                    'Total de Corridas Dinheiro(R$)' => brazilianCash($driver->quantityTripsPayCash ?? 0),
                    'Total de Corridas Cartão de Crédito(R$)' => brazilianCash($driver->quantityTripsPayCreditCard ?? 0),
                    'Total de Corridas Voucher(R$)' => brazilianCash($driver->quantityTripsPayVoucher ?? 0),
                    'Total de Corridas Maquineta(R$)' => brazilianCash($driver->quantityTripsPayCardInLocal ?? 0),
                    'Valor Total das Viagens(R$)' => brazilianCash($driver->amountTotalTrips ?? 0),
                    'Taxas por forma de pagamento (-)(R$)' => brazilianCash($driver->feesByPaymentForm ?? 0),
                    'Saldo Atual(R$)' => brazilianCash($driver->balance ?? 0),
                ];
            })
                ->toArray()
        );
    }

    public function balanceDrivers(array $request): ReportDefaultExport
    {
        $drivers = $this->repository->balanceDrivers($request, (Auth::user())->role);

        return new ReportDefaultExport(
            $drivers->transform(function ($driver) {
                return [
                    'Nome' => FormatString::removeEmoji($driver->name),
                    'CPF' => $driver->document,
                    'Telefone' => $driver->phone,
                    'Email' => $driver->email,
                    'Cidade' => $driver->city,
                    'Saldo Atual(R$)' => brazilianCash($driver->balance ?? 0),
                ];
            })
                ->toArray()
        );
    }

    public function blockedDrivers(array $request): ReportDefaultExport
    {
        $drivers = $this->repository->blockedDrivers($request, (Auth::user())->role);

        return new ReportDefaultExport(
            $drivers->transform(function ($driver) {
                return [
                    'Nome' => FormatString::removeEmoji($driver->name),
                    'CPF' => $driver->document,
                    'Telefone' => $driver->phone,
                    'Email' => $driver->email,
                    'Cidade' => $driver->city,
                    'Saldo Atual(R$)' => brazilianCash($driver->balance ?? 0),
                ];
            })
                ->toArray()
        );
    }

    public function synthetic(array $request, array $driverIds = []): array
    {
        if ($driverIds[0] == null) {
            return [
                'total_trip' => $this->tripReportRepository
                    ->totalQuantityByTripTypeAndCityAllDrivers($request, (Auth::user())->role),
                'active_drivers' => $this->repository
                    ->activeDriversAll($request, (Auth::user())->role),
                'inactive_drivers' => $this->repository
                    ->inactiveDriversAll($request, (Auth::user())->role),
                'moved_billing_values' => $this->tripReportRepository
                    ->movedBillingValuesAllDrivers($request, (Auth::user())->role),
                'trip_total_value' => $this->tripReportRepository
                    ->tripTotalPriceByPaymentFormAllDrivers($request, (Auth::user())->role),
                'total_driver_balance' => $this->repository
                    ->totalDriverBalanceAll($request, (Auth::user())->role),
                'total_tax_fee' => $this->tripReportRepository
                    ->totalTaxFeeAllDrivers($request, (Auth::user())->role)
            ];
        } else {
            return [
                'total_trip' => $this->tripReportRepository
                    ->totalQuantityByTripTypeAndCity($request, $driverIds, (Auth::user())->role),
                'active_drivers' => $this->repository
                    ->activeDrivers($request, $driverIds, (Auth::user())->role),
                'inactive_drivers' => $this->repository
                    ->inactiveDrivers($request, $driverIds, (Auth::user())->role),
                'moved_billing_values' => $this->tripReportRepository
                    ->movedBillingValues($request, $driverIds, (Auth::user())->role),
                'trip_total_value' => $this->tripReportRepository
                    ->tripTotalPriceByPaymentForm($request, $driverIds, (Auth::user())->role),
                'total_driver_balance' => $this->repository
                    ->totalDriverBalance($request, $driverIds, (Auth::user())->role),
                'total_tax_fee' => $this->tripReportRepository
                    ->totalTaxFee($request, $driverIds, (Auth::user())->role)
            ];
        }
    }


    /**
    public function synthetic(array $request): array
    {
        $results = [];
        foreach ($request['drivers'] as $driverId) {
            $results[$driverId] = [
                'total_trip' => $this->tripReportRepository
                    ->totalQuantityByTripTypeAndCity($request, (Auth::user())->role, $driverId),
                'active_drivers' => $this->repository
                    ->activeDrivers($request, (Auth::user())->role, $driverId),
                'inactive_drivers' => $this->repository
                    ->inactiveDrivers($request, (Auth::user())->role, $driverId),
                'moved_billing_values' => $this->tripReportRepository
                    ->movedBillingValues($request, (Auth::user())->role, $driverId),
                'trip_total_value' => $this->tripReportRepository
                    ->tripTotalPriceByPaymentForm($request, (Auth::user())->role, $driverId),
                'total_driver_balance' => $this->repository
                    ->totalDriverBalance($request, (Auth::user())->role, $driverId),
                'total_tax_fee' => $this->tripReportRepository
                    ->totalTaxFee($request, (Auth::user())->role, $driverId),
                'driver_name' => $this->repository
                    ->driverName($driverId),
            ];
        }

        return $results;
    }
     * */

    public function customerBlockedByDriver(array $request): ReportDefaultExport
    {
        $data = $this->repository->customerBlockedByDriver($request, (Auth::user()));

        return new ReportDefaultExport(
            $data->transform(function ($data) {
                return [
                    'Nome do motorista' => FormatString::removeEmoji($data->driverName),
                    'Nome do cliente' => FormatString::removeEmoji($data->customerName),
                    'Data de bloqueio' => Carbon::parse($data->blockedDateByCustomer)->format('d/m/Y H:i:s')
                ];
            })
                ->toArray()
        );
    }

    public function vehicleData(array $request): ReportDefaultExport
    {
        $data = $this->repository->vehicleData($request, (Auth::user())->role);

        return new ReportDefaultExport(
            $data->transform(function ($data) {
                return [
                    'Nome do motorista' => FormatString::removeEmoji($data->driverName),
                    'Status do motorista' => $data->driverRegisterStatus,
                    'Nº da CNH' => $data->driverCnh ?? 'Não informado',
                    'Modelo Veículo' => $data->carModel ?? 'Não informado',
                    'Marca Veículo' => $data->carBrand ?? 'Não informado',
                    'Ano Veículo' => $data->carYear ?? 'Não informado',
                    'Placa Veículo' => $data->carPlate ?? 'Não informado',
                    'Cor Veículo' => $data->carColor ?? 'Não informado',
                    'Renavan' => $data->carRenavam ?? 'Não informado',
                ];
            })
                ->toArray()
        );
    }

    public function excludedDrivers(array $request): ReportDefaultExport
    {
        $data = $this->repository->excludedDrivers($request, (Auth::user())->role);
        return new ReportDefaultExport(
            $data->transform(function ($data) {
                return [

                    'Nome' => FormatString::removeEmoji($data->driverName),
                    'Telefone' => $data->driverPhone,
                    'Email' => $data->driverEmail,
                    'Cidade' => $data->cityName,
                    'Data de exclusão' => Carbon::parse($data->excludedDate)->format('d/m/Y H:i:s')
                ];
            })
                ->toArray()
        );
    }
}
