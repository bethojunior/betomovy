<?php


namespace App\Services\Report\ExternalService;


use App\Exports\Report\ReportDefaultExport;
use App\Repositories\Report\ExternalServiceReportRepository;

class ExternalServiceReportService
{
    private $repository;

    public function __construct(ExternalServiceReportRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAllSms(array $request)
    {
        $smss = $this->repository->findAllSms($request);

        return new ReportDefaultExport($smss->transform(function ($sms) {
            return [
                'Enviado a' => $sms->to,
                'Mensagem' => $sms->message,
                'Data' => $sms->created_at,
                'Serviço' => $sms->externalService,
            ];
        })->toArray());
    }
}
