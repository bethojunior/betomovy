<?php

namespace App\Models\User\Doc;

use Illuminate\Database\Eloquent\Model;

class Doc extends Model
{
    protected $table = 'doc';

    protected $fillable = [
        'label',
        'description',
        'image',
        'link',
        'text',
        'pdf'
    ];

    protected $hidden = ['statusId'];
}
