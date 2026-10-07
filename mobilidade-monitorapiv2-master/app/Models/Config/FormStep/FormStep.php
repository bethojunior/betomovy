<?php

namespace App\Models\Config\FormStep;

use Illuminate\Database\Eloquent\Model;

class FormStep extends Model
{
    protected $table = 'formStep';

    protected $hidden = ['statusId'];
}
