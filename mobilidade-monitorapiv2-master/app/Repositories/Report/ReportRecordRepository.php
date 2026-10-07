<?php

namespace App\Repositories\Report;

use App\Contracts\Repository\AbstractRepository;
use App\Models\Report\ReportRecord;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

class ReportRecordRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(ReportRecord::class);
    }

    public function findAll(array $filters, int $userIdAuth)
    {
        return $this->getModel()::where('userId', $userIdAuth)
            ->join('report', 'reportRecord.reportId', 'report.id')
            ->select(
                'reportRecord.id',
                'reportId',
                'report.name as reportName',
                'fileName',
                'filters',
                'link',
                'status',
                'error',
                'created_at',
                'updated_at'
            )
            ->when(isset($filters['status']), function (Builder $query) use ($filters) {
                $query->where('status', $filters['status']);
            })
            ->when(isset($filters['reportId']), function (Builder $query) use ($filters) {
                $query->where('reportId', $filters['reportId']);
            })
            ->when(isset($filters['dateStart']), function (Builder $query) use ($filters) {
                $query->where('created_at', '>=', Carbon::parse($filters['dateStart'])->startOfDay());
            })
            ->when(isset($filters['dateEnd']), function (Builder $query) use ($filters) {
                $query->where('created_at', '<=', Carbon::parse($filters['dateEnd'])->endOfDay());
            })
            ->orderByDesc('created_at')
            ->paginate();
    }
}
