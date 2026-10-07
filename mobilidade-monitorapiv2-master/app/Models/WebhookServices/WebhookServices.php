<?php

namespace App\Models\WebhookServices;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\WebhookServices\TypeServicesWebhook;

class WebhookServices extends Model
{
    use HasFactory;

    protected $table = 'service_webhook';
    protected $fillable = ['url', 'active', 'method', 'type_service_id'];

    public function typeService()
    {
        return $this->belongsTo(TypeServicesWebhook::class, 'type_service_id');
    }
}
