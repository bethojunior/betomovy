<?php


namespace App\Repositories\Report;


use App\Constants\Config\ExternalServiceTypeConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\ExternalService\ExternalService;
use App\Models\ExternalService\ExternalServiceUse;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

class ExternalServiceReportRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(ExternalService::class);
    }

    public function findAllSms(array $request)
    {
        return ExternalServiceUse::query()->join('externalService', 'externalService.id', 'externalServiceUse.externalServiceId')
            ->select(
                'to',
                'message',
                'created_at',
                'externalService.name as externalService'
            )
            ->where('externalService.externalServiceTypeId', ExternalServiceTypeConst::SMS)
            ->when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $query->where('externalServiceUse.created_at', '>=', Carbon::parse($request['dateStart'])->startOfDay());
            })
            ->when(isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query->where('externalServiceUse.created_at', '<=',Carbon::parse($request['dateEnd'])->endOfDay());
            })
            ->get();
    }
}
