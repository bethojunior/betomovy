<?php

namespace App\Models\WebhookServices;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypeServicesWebhook extends Model
{
    use HasFactory;

    protected $table = 'types_services_webhook';
    protected $fillable = ['name', 'key', 'description'];

    public function webhooks()
    {
        return $this->hasMany(WebhookServices::class, 'type_service_id');
    }
}
