<?php

namespace App\Models\Report;

use App\Traits\UuidTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReportRecord extends Model
{
    use UuidTrait;

    protected $table = 'reportRecord';

    protected $guarded = ['id'];

    public function report(): BelongsTo
    {
        return $this->belongsTo(Report::class, 'reportId');
    }

    public function getFiltersAttribute($value)
    {
        return (array)json_decode($value);
    }
}
