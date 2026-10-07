<?php

namespace App\Models\Central;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CentralTripInfoQuestion extends Model
{
    use SoftDeletes;

    protected $table = "centralTripInfoQuestion";

    protected $fillable = [
        "title",
        "required",
        "centralId"
    ];
}
