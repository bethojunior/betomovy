<?php

namespace App\Models\Report;

use Illuminate\Database\Eloquent\Model;

class ReportType extends Model
{
    protected $table = 'reportType';

    public function reports()
    {
        return $this->hasMany(Report::class, 'reportTypeId');
    }
}
