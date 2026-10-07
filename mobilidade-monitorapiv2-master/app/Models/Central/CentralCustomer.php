<?php

namespace App\Models\Central;

use Illuminate\Database\Eloquent\Model;

class CentralCustomer extends Model
{
    protected $table = 'centralCustomer';

    protected $fillable = [
        'name', 'phone', 'centralId', 'document', 'dateOfBirth'
    ];

    public function setPhoneAttribute($value)
    {
        $this->attributes['phone'] = onlyCharacters($value);
    }

    public function setDocumentAttribute($value)
    {
        $this->attributes['document'] = onlyCharacters($value);
    }

    public function central()
    {
        return $this->belongsTo(Central::class, 'centralId');
    }
}
