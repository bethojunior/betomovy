<?php

namespace App\Services\Report;

use App\Jobs\Report\ProcessReportJob;
use App\Models\Report\ReportRecord;
use App\Repositories\Report\ReportRecordRepository;
use Illuminate\Support\Facades\Auth;

class ReportRecordService
{
    private ReportRecordRepository $repository;

    public function __construct(ReportRecordRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll(array $filters)
    {
        $results = $this->repository->findAll($filters, Auth::id());

        $results->getCollection()->transform(function ($item) {
            $timeToExpire = $item->created_at->addHours(2);
            if (
                ($item->status === 'in_process' || $item->status === 'pending') &&
                $timeToExpire->isPast()
            ) {
                $item->update([
                    'status' => 'error',
                    'error' => json_encode(['message' => 'Report expired'])
                ]);
            }
            return $item;
        });

        return $results;
    }

    public function store(array $data)
    {
        $reportRecord = ReportRecord::create([
            'reportId' => $data['reportId'],
            'filters' => json_encode($data['filters']),
            'userId' => Auth::id()
        ]);

        dispatch(new ProcessReportJob($reportRecord));

        return $reportRecord;
    }
}
