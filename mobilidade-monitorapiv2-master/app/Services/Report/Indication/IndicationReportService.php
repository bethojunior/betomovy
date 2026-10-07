<?php


namespace App\Services\Report\Indication;


use App\Exports\Report\ReportDefaultExport;
use App\Repositories\Report\BalanceFlowReportRepository;
use App\Repositories\Report\IndicationReportRepository;
use Carbon\Carbon;

class IndicationReportService
{
    private $repository;

    /**
     * IndicationReportService constructor.
     * @param $repository
     */
    public function __construct(IndicationReportRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll(array $request)
    {
        $users = $this->repository->findAll($request);

        return new ReportDefaultExport($users->transform(function ($user) {
            return [
                'ID do Indicador' => $user->referredId,
                'Nome do Indicador' => $user->referredName,
                'Telefone do Indicador' => $user->referredPhone,
                'E-mail do Indicador' => $user->referredEmail,
                'ID do Indicado' => $user->indicatedId,
                'Nome do Indicado' => $user->indicatedName,
                'Telefone do Indicado' => $user->indicatedPhone,
                'E-mail do Indicado' => $user->indicatedEmail
            ];
        })->toArray());
    }

    public function findByWhoIndicatedId(array $request)
    {
        $users = $this->repository->findByWhoIndicatedId($request);

        return new ReportDefaultExport(
            $users->transform(function ($user) {
                return [
                    'ID do Indicador' => $user->whoIndicatedId,
                    'Nome do Indicador' => $user->whoIndicatedName,
                    'Tipo do Indicador' => $user->whoIndicatedType,
                    'ID do Indicado' => $user->indicatedId,
                    'Nome Indicado' => $user->indicatedName,
                    'Telefone Indicado' => $user->indicatedPhone,
                    'Email Indicado' => $user->indicatedEmail,
                    'Tipo Indicado' => $user->indicatedType,
                    'Data' => Carbon::parse($user->created_at)->format('d/m/Y H:i:s')
                ];
            })->toArray());
    }
}
