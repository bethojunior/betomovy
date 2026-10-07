<?php

namespace App\Models\Config\FormStep;

use Illuminate\Database\Eloquent\Model;

class FormStepUserType extends Model
{
    protected $table = 'formStepUserType';

    protected $hidden = ['statusId'];

    protected $fillable = ['userTypeId', 'formStepId'];

    public function formStep()
    {
        return $this->belongsTo(FormStep::class, 'formStepId');
    }
}
