<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 28/07/2020
 * Time: 18:37
 */

namespace App\Models\Acquirer;


use App\Constants\Config\AcquirerMetaDataConst;
use Illuminate\Database\Eloquent\Model;

class AcquirerMetaData extends Model
{
    const CREATED_AT = null;
    const UPDATED_AT = null;

    protected $table = 'acquirerMetaData';

    public function getValueAttribute()
    {
        if (in_array($this->attributes['value'], [
            AcquirerMetaDataConst::DEFAULT_MP_PUBLIC_KEY,
            AcquirerMetaDataConst::DEFAULT_MP_ACCESS_TOKEN
        ]))
            return null;

        return $this->attributes['value'];
    }

    public function acquirerMetaDataCitys()
    {
        return $this->hasMany(AcquirerMetaDataCity::class, 'acquirerMetaData');
    }
}
