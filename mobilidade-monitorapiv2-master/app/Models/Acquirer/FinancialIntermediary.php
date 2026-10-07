<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 28/07/2020
 * Time: 17:08
 */

namespace App\Models\Acquirer;


use Illuminate\Database\Eloquent\Model;

class FinancialIntermediary extends Model
{
    const CREATED_AT = null;
    const UPDATED_AT = null;

    protected $table = 'financialIntermediary';

    protected $primaryKey = 'idFinancialIntermediary';

    protected $hidden = ['statusId'];

    public function acquirerMetaData()
    {
        return $this->hasMany(AcquirerMetaData::class, 'financialIntermediaryId');
    }
}
