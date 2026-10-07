<?php

namespace App\Services\Report\Customer;

use App\Constants\Pulse\GroupPulseConst;
use App\Constants\StatusConst;
use App\Constants\Trip\TripConst;
use App\Exports\Report\ReportDefaultExport;
use App\Repositories\Report\Customer\CustomerReportRepository;
use App\Utils\FormatString;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use App\Services\Pulse\PulseService;

class CustomerReportService
{
    /**
     * @var CustomerReportRepository
     */
    private $repository;
    public $pulse;

    /**
     * CustomerReportService constructor.
     * @param CustomerReportRepository $repository
     */
    public function __construct(CustomerReportRepository $repository)
    {
        $this->repository = $repository;
        $this->pulse = new PulseService('monitor-api-' . env('APP_NAME'), GroupPulseConst::REPORT);
    }

    /**
     * @param array $request
     * @return ReportDefaultExport
     */
    public function findAll(array $request)
    {
        try{
            $request['hasDocument'] = $request['hasDocument'] ?? '0';
            $customers = $this->repository->findAll($request, Auth::user());

            if ($request['hasDocument'] == '1') {
                $customers = $this->repository->findAllHasDocument($request, Auth::user())->groupBy('userId');
            }

            return new ReportDefaultExport(
                $customers->map(function ($group) {

                    if ($group instanceof \Illuminate\Support\Collection) {
                        $customer  = $group->first();
                        $documents = $group->mapWithKeys(function ($doc) {
                            return [
                                'Documento - ' . ($doc->docLabel ?? '') => $doc->docText ?? ''
                            ];
                        })->toArray();
                    } else {
                        $customer  = $group;
                        $documents = [];
                    }

                    $dateOfBirth = $customer->dateOfBirth
                        ? Carbon::parse($customer->dateOfBirth)->format('d/m/Y')
                        : null;

                    $created_at = Carbon::parse($customer->created_at)->format('d/m/Y H:i:s');

                    return array_merge([
                        'Nome' => FormatString::removeEmoji($customer->name),
                        'CPF' => $customer->document,
                        'Telefone' => $customer->phone,
                        'Email' => $customer->email,
                        'Cidade' => $customer->cityName,
                        'Data de Nascimento' => $dateOfBirth,
                        'Valor Voucher' => $customer->voucher,
                        'Viagens Finalizadas' => $customer->tripsFinished,
                        'Criado em' => $created_at,
                        'Status do Cliente' => $customer->statusCustomer,
                        'Registrado em' => $customer->registered_in,
                    ], $documents);

                })->values()->toArray()
            );


        }catch(\Exception $e){
            $this->pulse->handle('[CustomerReportService::findAll]', $e->getMessage(), 'error');
        }
    }

    public function manualVoucherInsertion(array $request, int $cityId = null)
    {
        $vouchers = $this->repository->manualVoucherInsertion($request, (bool)(Auth::user())->role->support, $cityId);

        return new ReportDefaultExport(
            $vouchers->transform(function ($voucher) {
                return [
                    'Nome' => FormatString::removeEmoji($voucher->name),
                    'CPF' => $voucher->document,
                    'Telefone' => $voucher->phone,
                    'Email' => $voucher->email,
                    'Cidade' => $voucher->cityName,
                    'Valor Voucher R$' => brazilianCash($voucher->value),
                    'Tipo de Movimentação' => $voucher->balanceFlowType,
                    'Data' => Carbon::parse($voucher->date)->format('d/m/Y H:i:s'),
                    'Saldo de Voucher Atual R$' => brazilianCash($voucher->voucher),
                    'Usuário responsável' => $voucher->updated_by
                ];
            })
            ->toArray()
        );
    }

    public function findFavoriteDriver(array $filters): ReportDefaultExport
    {
        $data = $this->repository->findFavoriteDriver($filters, Auth::user());

        return new ReportDefaultExport(
            $data->transform(function ($data) {
                return [
                    'Nome do cliente' => $data->customerName,
                    'Nome do motorista' => $data->driverName,
                    'Data de favoritismo' => Carbon::parse($data->favoriteDateByCustomer)->format('d/m/Y H:i:s'),
                    'Quantidade de viagens' => $data->tripQuantity
                ];
            })
            ->toArray()
        );
    }

    public function driverBlockedByCustomer(array $filters): ReportDefaultExport
    {
        $data = $this->repository->driverBlockedByCustomer($filters, Auth::user());

        return new ReportDefaultExport(
            $data->transform(function ($data) {
                return [
                    'Nome do cliente' => $data->customerName,
                    'Nome do motorista' => $data->driverName,
                    'Data de bloqueio' => Carbon::parse($data->blockedDateByCustomer)->format('d/m/Y H:i:s')
                ];
            })
            ->toArray()
        );
    }
}
