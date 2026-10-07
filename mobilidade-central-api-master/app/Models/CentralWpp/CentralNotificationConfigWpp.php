<?php

namespace App\Models\CentralWpp;

use Illuminate\Database\Eloquent\Model;

class CentralNotificationConfigWpp extends Model
{
  protected $table = 'central_notification_config_wpp';

  protected $fillable = [
    'centralId',
    'send_to_group',
    'send_to_driver',
    'group_reference',
    'message_send_to_driver',
    'message_send_to_group'
  ];

  protected $casts = [
    'send_to_driver' => 'boolean',
    'send_to_group' => 'boolean',
  ];
}
