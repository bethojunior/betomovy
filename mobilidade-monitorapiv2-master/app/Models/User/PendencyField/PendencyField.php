<?php

namespace App\Models\User\PendencyField;

use Illuminate\Database\Eloquent\Model;

class PendencyField extends Model
{
    protected $table = 'pendencyField';

    protected $fillable = [
        'userId',
        'pendencyFieldTypeId',
        'pendencyFieldStatusId',
    ];

    public function pendencyFieldType()
    {
        return $this->belongsTo(PendencyFieldType::class, 'pendencyFieldTypeId');
    }

    public function pendencyFieldStatus()
    {
        return $this->belongsTo(PendencyFieldStatus::class, 'pendencyFieldStatusId');
    }
}
