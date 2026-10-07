<?php


namespace App\Services\Report\Audit;


use App\Exports\Report\ReportDefaultExport;
use App\Repositories\Report\InternalAuditReportRepository;
use App\Utils\FormatString;
use Carbon\Carbon;

class InternalAuditReportService
{
    private $repository;


    public function __construct(InternalAuditReportRepository $repository)
    {
        $this->repository = $repository;
    }

    public function accessLog(array $request = []): ReportDefaultExport
    {
        $logs = $this->repository->accessLog($request);

        return new ReportDefaultExport($logs->transform(function ($log) {
            return [
                'Nome' => FormatString::removeEmoji($log->name),
                'Email' => $log->email,
                'IP' => $log->ip,
                'Rota' => $log->url_path,
                'Localização' => $log->localizationLog,
                'Messagem' => $log->message,
                'Navegador' => $log->browser,
                'Método HTTP' => $log->method,
                'Data do acesso' => Carbon::parse($log->created_at)->format('d/m/Y H:i:s')
            ];
        })->toArray()
        );
    }
}
