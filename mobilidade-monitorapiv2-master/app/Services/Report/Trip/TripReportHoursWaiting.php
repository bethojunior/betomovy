<?php
/**
 * Created by PhpStorm.
 * User: Betho Junior
 * Date: 12/09/2025
 * Time: 10:27
 */

namespace App\Services\Report\Trip;

use App\Constants\Pulse\GroupPulseConst;
use App\Services\Pulse\PulseService;
use App\Exports\Report\ReportDefaultExport;
use App\Repositories\Trip\HoursWaitedRepository;

class TripReportHoursWaiting
{

    private $repository;

    public function __construct(HoursWaitedRepository $repository)
    {
        $this->repository = $repository;
    }

    public function handle($filters)
    {
        $pulse = new PulseService('monitor-api-' . env('APP_NAME'), GroupPulseConst::REPORT);
        $pulse->handle('[RELATÓRIO::HORAS EM ESPERA POR VIAGEM]', 'Iniciando relatório de viagens com tempo de espera', 'info');

        $execute = $this->repository->handle($filters);

        return new ReportDefaultExport(
            $execute->transform(function ($item) {

                $formatTime = function ($seconds) {
                    $hours = floor($seconds / 3600);
                    $minutes = floor(($seconds % 3600) / 60);
                    $secs = $seconds % 60;
                    return sprintf('%02d:%02d:%02d', $hours, $minutes, $secs);
                };

                return [
                    'Motorista' => $item->name,
                    'Apelido'   => $item->nickname,
                    'Telefone'  => $item->phone,
                    'Email'     => $item->email,
                    'Documento' => $item->document,
                    'Cidade'    => $item->city_name,
                    'Tempo'     => $formatTime($item->timeInSeconds),
                ];
            })->toArray()
        );
    }
}
