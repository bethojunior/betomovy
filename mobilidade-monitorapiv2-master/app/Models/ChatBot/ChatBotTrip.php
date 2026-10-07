<?php

namespace App\Models\ChatBot;

use Illuminate\Database\Eloquent\Model;

class ChatBotTrip extends Model

{
    public const UPDATED_AT = null;
    public const CREATED_AT = null;

    protected $table = 'chatBotTrip';

    protected $primaryKey = 'idChatBotTrip';

    protected $hidden = ["statusId"];

    protected $fillable = [ "message", "chatBotTripTypeId" ];

    public function chatBotTripType()
    {
        return $this->belongsTo(ChatBotTripType::class, 'chatBotTripTypeId');
    }

}
