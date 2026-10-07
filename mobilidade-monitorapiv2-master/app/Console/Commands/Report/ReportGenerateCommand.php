<?php

namespace App\Console\Commands\Report;

use App\Constants\Pulse\GroupPulseConst;
use App\Constants\Report\ReportConst;
use App\Models\Report\ReportRecord;
use App\Services\Report\Audit\InternalAuditReportService;
use App\Services\Report\Customer\CustomerReportService;
use App\Services\Report\Delivery\DeliveryReportService;
use App\Services\Report\DiscountCoupon\DiscountCouponReportService;
use App\Services\Report\Driver\DriverReportService;
use App\Services\Report\Driver\DriverBalanceReportService;
use App\Services\Report\Driver\DriverHoursWorkedReportService;
use App\Services\Report\EstablishmentCollectionManagement\EstablishmentCollectionManagementReportService;
use App\Services\Report\Indication\IndicationReportService;
use App\Services\Report\Trip\TripReportService;
use App\Services\Report\Voucher\VoucherPurchaseReportService;
use App\Services\Report\Voucher\VoucherReportService;
use PDF;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use App\Services\Pulse\PulseService;
use App\Services\Report\Trip\TripReportHoursWaiting;

class ReportGenerateCommand extends Command
{
    protected $signature = 'report:generate {idReportRecord}';
    protected $description = 'Comando para gerar relatório e salvar na nuvem | Bucket';

    private $driverReportService;
    private $tripReportService;
    private $customerReportService;
    private $voucherPurchaseReportService;
    private $voucherReportService;
    private $discountCouponReportService;
    private $indicationReportService;
    private $establishmentCollectionManagementReportService;
    private $deliveryReportService;
    private $internalAuditReportService;
    private $driverBalanceReportService;
    private $driverHoursWorkedReportService;
    private $tripReportHoursWaiting;
    public  $pulse;
    public function __construct(
        DriverReportService                            $driverReportService,
        TripReportService                              $tripReportService,
        CustomerReportService                          $customerReportService,
        VoucherPurchaseReportService                   $voucherPurchaseReportService,
        VoucherReportService                           $voucherReportService,
        DiscountCouponReportService                    $discountCouponReportService,
        IndicationReportService                        $indicationReportService,
        EstablishmentCollectionManagementReportService $establishmentCollectionManagementReportService,
        DeliveryReportService                          $deliveryReportService,
        InternalAuditReportService                     $internalAuditReportService,
        DriverBalanceReportService                     $driverBalanceReportService,
        DriverHoursWorkedReportService                 $driverHoursWorkedReportService,
        TripReportHoursWaiting                         $tripReportHoursWaiting
    ) {
        parent::__construct();

        $this->driverReportService = $driverReportService;
        $this->tripReportService = $tripReportService;
        $this->customerReportService = $customerReportService;
        $this->voucherPurchaseReportService = $voucherPurchaseReportService;
        $this->voucherReportService = $voucherReportService;
        $this->discountCouponReportService = $discountCouponReportService;
        $this->indicationReportService = $indicationReportService;
        $this->establishmentCollectionManagementReportService = $establishmentCollectionManagementReportService;
        $this->deliveryReportService = $deliveryReportService;
        $this->internalAuditReportService = $internalAuditReportService;
        $this->driverBalanceReportService = $driverBalanceReportService;
        $this->driverHoursWorkedReportService = $driverHoursWorkedReportService;
        $this->tripReportHoursWaiting = $tripReportHoursWaiting;
        $this->pulse = new PulseService('monitor-api-' . env('APP_NAME'), GroupPulseConst::REPORT);
    }

    public function handle()
    {
        $this->info('Iniciando processo...');
        $reportRecord = ReportRecord::find($this->argument('idReportRecord'));

        if (!$reportRecord) {
            $this->error("Solicitação de relatório não encontrada!");
            return 0;
        }
        if ($reportRecord->status === 'finished') {
            $this->alert("Relatório {$reportRecord->id} já foi gerado!");
            return 0;
        }

        $reportRecord->status = 'in_process';
        $reportRecord->save();

        try {
            $this->info("Gerando relatório {$reportRecord->id}...");
            [$reportName, $report] = $this->getDataReport($reportRecord->reportId, $reportRecord->filters, $reportRecord->userId);

            if (isset($reportRecord->filters['isPdf']) && $reportRecord->filters['isPdf'] && $reportRecord->report->enablePdf) {
                $this->generateReportAndUploadPdf($reportRecord, $reportName, $report);

                return 0;
            }

            $this->generateReportAndUploadExcel($reportRecord, $reportName, $report);
        } catch (\Throwable $exception) {
            $this->pulse->handle(
                '[when:[' . now() . '][ReportGenerateCommand::ERROR]',
                '[when[' . now() . '] ' . $exception->getTraceAsString() . ']',
                'error'
            );

            $reportRecord->status = 'error';
            $reportRecord->error = json_encode([
                'message' => 'Erro ao gerar relatório',
                'error' => $exception->getMessage(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
            ]);
            $reportRecord->save();
            $this->error("Erro ao gerar relatório!");
            $this->error("Error: {$exception->getMessage()}");
            $this->error("File: {$exception->getFile()}");
            $this->error("Line: {$exception->getLine()}");
        }

        return 0;
    }

    public function getDataReport(int $reportId, array $filters, int $userId): array
    {
        Auth::loginUsingId($userId);
        $reportName = '';

        $report = [];
        switch ($reportId) {
            case ReportConst::DRIVER_LISTING:
                $reportName = 'Listagem de motoristas - ' . Carbon::now()->toDateTimeLocalString();
                $report = $this->driverReportService->findAll($filters);
                break;
            case ReportConst::TRAVEL_FINANCE:
                $reportName = 'Financeiro de Viagens - ' . Carbon::now()->toDateTimeLocalString();
                $report = $this->driverReportService->financialTripDrivers($filters);
                break;
            case ReportConst::TRAVEL_HISTORY_BY_PERIOD:
                $reportName = 'Histórico de Viagens - Por Período - ' . Carbon::now()->toDateTimeLocalString();
                $report = $this->driverReportService->driverTripHistory($filters);
                break;
            case ReportConst::TRAVEL_HISTORY_NUMBERS:
                $reportName = 'Histórico de Viagens - Números - ' . Carbon::now()->toDateTimeLocalString();
                $report = $this->tripReportService->countersTripHistory($filters);
                break;
            case ReportConst::TRAVEL_LISTING:
                $reportName = 'Listagem de Viagens - ' . Carbon::now()->toDateTimeLocalString();
                $report = $this->tripReportService->listAll($filters);
                break;
            case ReportConst::CUSTOMER_LISTING:
                $reportName = 'Listagem de clientes - ' . Carbon::now()->toDateTimeLocalString();
                $report = $this->customerReportService->findAll($filters);
                break;
            case ReportConst::CUSTOMER_FAVORITE_DRIVER:
                $reportName = 'Motoristas Favoritos - ' . Carbon::now()->toDateTimeLocalString();
                $report = $this->customerReportService->findFavoriteDriver($filters);
                break;
            case ReportConst::TRAVEL_FINANCE_GENERAL:
                $name = 'Financeiro de Viagens - Geral - ' . Carbon::now()->toDateTimeLocalString();
                $reportName = $name;
                $report = $this->driverReportService->financialTripDriversLessFilter($filters);
                break;
            case ReportConst::VALUE_HISTORY_ALL_TRIPS:
                $reportName = 'Histórico de Valores Todas as viagens - ' . Carbon::now()->toDateTimeLocalString();
                $report = $this->driverReportService->historyDriverAllTripsValues($filters);
                break;
            case ReportConst::LOGGED_TIME_HISTORY:
                $reportName = 'Histórico de Tempo Logado - ' . Carbon::now()->toDateTimeLocalString();
                $report = $this->driverReportService->driverOnlineTime($filters);
                break;
            case ReportConst::TRAVEL_LISTING_PJ:
                $reportName = 'Listagem de Viagens - PJ - ' . Carbon::now()->toDateTimeLocalString();
                $report = $this->tripReportService->corporateTravelList($filters);
                break;
            case ReportConst::ADMINISTRATIVE_VOUCHER_EXTRACT:
                $reportName = 'Extrato de Voucher Administrativo - ' . Carbon::now()->toDateTimeLocalString();
                $report = $this->tripReportService->financialStatementAdministrativeVoucher($filters);
                break;
            case ReportConst::VOUCHER_SHOPPING_LISTING:
                $reportName = 'Listagem de Compras de Voucher - ' . Carbon::now()->toDateTimeLocalString();
                $report = $this->voucherPurchaseReportService->findAll($filters);
                break;
            case ReportConst::MOVES_IN_VOUCHER:
                $reportName = 'Movimentações em Voucher - ' . Carbon::now()->toDateTimeLocalString();
                $report = $this->voucherReportService->voucherMovements($filters);
                break;
            case ReportConst::MOVES_IN_VOUCHER_BY_CENTRAl:
                $reportName = 'Movimentações em Voucher por Central - ' . Carbon::now()->toDateTimeLocalString();
                $report = $this->voucherReportService->voucherMovementsByCentral($filters);
                break;
            case ReportConst::LISTING_OF_DISCOUNTED_TRIPS:
                $reportName = 'Listagem de Viagens Descontadas - ' . Carbon::now()->toDateTimeLocalString();
                $report = $this->discountCouponReportService->findAllDiscountedTrip($filters);
                break;
            case ReportConst::REFERRALS_BY_USER:
                $reportName = 'Indicações por Usuário - ' . Carbon::now()->toDateTimeLocalString();
                $report = $this->indicationReportService->findByWhoIndicatedId($filters);
                break;
            case ReportConst::PREPAID_SHOPPING:
                $reportName = 'Compras pré-pago - ' . Carbon::now()->toDateTimeLocalString();
                $report = $this->driverReportService->prepaidPurchase($filters);
                break;
            case ReportConst::BILLING_FROM_ESTABLISHMENTS:
                $reportName = 'Cobrança de Estabelecimentos (Sem taxa fixa) - ' . Carbon::now()->toDateTimeLocalString();
                $report = $this->establishmentCollectionManagementReportService->totalChargePerCompany($filters);
                break;
            case ReportConst::FEE_MANAGEMENT:
                $reportName = 'Gerenciamento de taxas - ' . Carbon::now()->toDateTimeLocalString();
                $report = $this->driverReportService->feeManagement($filters);
                break;
            case ReportConst::ORDER_LISTING:
                $reportName = 'Listagem de Pedidos - ' . Carbon::now()->toDateTimeLocalString();
                $report = $this->deliveryReportService->allOrders($filters);
                break;
            case ReportConst::LISTING_OF_SHARED_ROUTES:
                $reportName = 'Listagem de Rotas Compartilhadas - ' . Carbon::now()->toDateTimeLocalString();
                $report = $this->tripReportService->getAllSharedRoutes($filters);
                break;
            case ReportConst::MANUAL_VOUCHER_HANDLING:
                $reportName = 'Movimentação Manual de Voucher - ' . Carbon::now()->toDateTimeLocalString();
                $report = $this->customerReportService->manualVoucherInsertion($filters);
                break;
            case ReportConst::ACCESS_LISTING:
                $reportName = 'Listagem de Acessos - ' . Carbon::now()->toDateTimeLocalString();
                $report = $this->internalAuditReportService->accessLog($filters);
                break;
            case ReportConst::TRAVEL_LISTING_WITH_RATE_OF_RETURN:
                $reportName = 'Listagem de Viagens com taxa de retorno - ' . Carbon::now()->toDateTimeLocalString();
                $report = $this->tripReportService->listAllWithCentralFee($filters);
                break;
            case ReportConst::DRIVERS_BALANCE:
                $reportName = 'Saldo dos Motoristas - ' . Carbon::now()->toDateTimeLocalString();
                $report = $this->driverReportService->balanceDrivers($filters);
                break;
            case ReportConst::BLOCKED_DRIVERS:
                $reportName = 'Motoristas bloqueados - ' . Carbon::now()->toDateTimeLocalString();
                $report = $this->driverReportService->blockedDrivers($filters);
                break;
            case ReportConst::DRIVER_BLOCKED_BY_CUSTOMER:
                $reportName = 'Motoristas bloqueados por clientes - ' . Carbon::now()->toDateTimeLocalString();
                $report = $this->customerReportService->driverBlockedByCustomer($filters);
                break;
            case ReportConst::CUSTOMER_BLOCKED_BY_DRIVER:
                $reportName = 'Clientes bloqueados por motoristas - ' . Carbon::now()->toDateTimeLocalString();
                $report = $this->driverReportService->customerBlockedByDriver($filters);
                break;
            case ReportConst::CALL_PRODUCTION:
                $reportName = 'Produção de Chamados - ' . Carbon::now()->toDateTimeLocalString();
                $report = $this->tripReportService->callProduction($filters);
                break;
            case ReportConst::VEHICLE_DATA:
                $reportName = 'Dados do Veículo - ' . Carbon::now()->toDateTimeLocalString();
                $report = $this->driverReportService->vehicleData($filters);
                break;
            case ReportConst::DELIVERY_FEE_MANAGEMENT:
                $reportName = 'Gerenciamento de Taxas Delivery - ' . Carbon::now()->toDateTimeLocalString();
                $report = $this->deliveryReportService->deliveryFeeManagement($filters);
                break;
            case ReportConst::EXCLUDED_DRIVERS:
                $reportName = 'Relatório de Motoristas Excluídos - ' . Carbon::now()->toDateTimeLocalString();
                $report = $this->driverReportService->excludedDrivers($filters);
                break;
            case ReportConst::DRIVER_BALANCE_MOVEMENTS:
                $reportName = 'Movimentação em Saldo para Motoristas - ' . Carbon::now()->toDateTimeLocalString();
                $report = $this->driverBalanceReportService->driverBalanceMovements($filters);
                break;
            case ReportConst::DRIVER_HOURS_WORKED:
                $reportName = 'Listagem de horas trabalhadas dos Motorista - ' . Carbon::now()->toDateTimeLocalString();
                $report = $this->driverHoursWorkedReportService->handle($filters);
                break;
            case ReportConst::TRIP_HOURS_WAITED:
                $reportName = 'Listagem de horas em espera - ' . Carbon::now()->toDateTimeLocalString();
                $report = $this->tripReportHoursWaiting->handle($filters);
                break;
        }

        return [$reportName, $report];
    }

    public function generateReportAndUploadPdf(ReportRecord $reportRecord, string $reportName, $report)
    {
        $reportName .= '.pdf';

        $data = $report->array();

        $pdf = PDF::loadView('pdf.view', compact('data'));
        $pdf->setPaper('b3', 'landscape');
        $fileDir = Storage::disk('local')->path('') . $reportName;
        $this->info('Gerando PDF');
        $pdf->save($fileDir);

        $this->info("Fazendo o upload para S3!");
        $reportPath = Storage::cloud()->putFileAs('report', $fileDir, $reportName);

        if (!$reportPath) {
            throw new \Exception('Erro ao fazer upload para S3!');
        }

        $this->info("Salvando informações no BD!");
        $reportLink = Storage::cloud()->url($reportPath);
        $reportRecord->update([
            'fileName' => $reportName,
            'link' => $reportLink,
            'status' => 'finished'
        ]);

        $this->info("Excluindo arquivo temporário");
        Storage::disk('local')->delete($reportName);

        $this->info("Relatório {$reportName} gerado com sucesso!");
    }

    public function generateReportAndUploadExcel(
        ReportRecord $reportRecord,
        string $reportName,
        $report
    ) {
        try {

            $reportName .= '.xlsx';
            $reportPath = 'report/' . $reportName;

            $this->info("Gerando excel e fazendo o upload para S3!");

            $resultUpload = Excel::store(
                $report,
                $reportPath,
                's3',
                \Maatwebsite\Excel\Excel::XLSX
            );

            if (!$resultUpload) {
                throw new \Exception('Erro ao gerar relatório e fazer upload para S3!');
            }

            $reportLink = Storage::cloud()->url($reportPath);

            $reportRecord->update([
                'fileName' => $reportName,
                'link'     => $reportLink,
                'status'   => 'finished'
            ]);

            $this->info("Relatório {$reportName} gerado com sucesso!");
        } catch (\Throwable $e) {


            $this->error("Erro ao gerar relatório: " . $e->getMessage());

            throw $e;
        }
    }
}
