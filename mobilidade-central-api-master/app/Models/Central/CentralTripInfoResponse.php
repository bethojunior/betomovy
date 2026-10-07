<?php

namespace App\Models\Central;

use Illuminate\Database\Eloquent\Model;

class CentralTripInfoResponse extends Model
{
    protected $table = "centralTripInfoResponse";

    protected $fillable = [
        "centralTripInfoQuestionId",
        "tripReference",
        "response"
    ];
}
