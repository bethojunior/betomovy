<?php


namespace App\Models\Acquirer;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AcquirerMetaDataCity extends Model
{
    use SoftDeletes;

    protected $table = 'acquirerMetaDataCity';
    protected $fillable = [
        'acquirerMetaDataId',
        'value',
        'active',
        'cityId',
    ];
    public const UPDATED_AT = null;

    public function acquirerMetaData()
    {
        return $this->belongsTo(AcquirerMetaData::class, 'acquirerMetaDataId');
    }
}
