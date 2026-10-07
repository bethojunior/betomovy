<?php

namespace App\Models\Delivery;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TypeDeliveryCategoryBySection extends Model
{
    use SoftDeletes;

    protected $table = "typeDeliveryCategoryBySection";

    protected $fillable = [
        "deliverySectionId" ,
        "typeDeliveryCategoryId"
    ];
}
