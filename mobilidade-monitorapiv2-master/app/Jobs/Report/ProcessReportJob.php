<?php

namespace App\Jobs\Report;

use App\Models\Report\ReportRecord;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessReportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private ReportRecord $reportRecord;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(ReportRecord $reportRecord)
    {
        $this->reportRecord = $reportRecord;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        exec("php ../artisan report:generate {$this->reportRecord->id}", $output, $return_var);

        if ($return_var !== 0) {
            $this->reportRecord->update([
                'status' => 'error',
                'error' => json_encode($output),
            ]);
        }
    }
}
