<?php

namespace App\Models\Report;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $table = 'report';

    public function reportType()
    {
        return $this->belongsTo(ReportType::class, 'reportTypeId');
    }

    public function reportFilters()
    {
        return $this->hasMany(ReportFilter::class, 'reportId');
    }
}
