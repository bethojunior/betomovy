<?php
/**
 * Created by PhpStorm.
 * User: BJR
 * Date: 02/09/2025
 * Time: 14:37
 */

namespace App\Services\Report\Driver;

use App\Constants\Pulse\GroupPulseConst;
use App\Exports\Report\ReportDefaultExport;
use App\Repositories\Report\Driver\HoursWorkedReportRepository;
use Illuminate\Support\Facades\Auth;
use App\Services\Pulse\PulseService;

class DriverHoursWorkedReportService
{

    private $repository;

    public function __construct(HoursWorkedReportRepository $repository)
    {
        $this->repository = $repository;
    }

    public function handle(array $request = [])
    {
        $pulse = new PulseService('monitor-api-' . env('APP_NAME'), GroupPulseConst::REPORT);
        $pulse->handle('[REPORT:: HORAS TRABALHADAS POR MOTORISTA]', 'Start Driver Hours Worked Report', 'info');
        $execute = $this->repository
            ->handle($request, (Auth::user())->role);

        return new ReportDefaultExport($execute->transform(function ($item) {
            return [
                'Motorista' => $item->driver_name,
                'Telefone' => $item->driver_phone,
                'Email' => $item->driver_email,
                'Documento' => $item->driver_document,
                'Data' => $item->date->format('d/m/Y H:i:s'),
                'Tempo máximo' => $item->max_hours ?? '-',
                'Tempo trabalhado' => $item->hours_worked,
            ];
        })
            ->toArray()
        );
    }
}
