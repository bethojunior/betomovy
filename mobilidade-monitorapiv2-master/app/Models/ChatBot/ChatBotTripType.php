<?php

namespace App\Models\ChatBot;

use Illuminate\Database\Eloquent\Model;

class ChatBotTripType extends Model
{
    const CREATED_AT = null;
    const UPDATED_AT = null;

    protected $table = 'chatBotTripType';

    protected $primaryKey = 'id';

    protected $fillable = [ "name" ];

}
