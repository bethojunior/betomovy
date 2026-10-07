<?php

namespace App\Models\Config;

use Illuminate\Database\Eloquent\Model;

class SmtpServer extends Model
{
    protected $table = "smtpServer";

    protected $fillable = [
      "mailer",
      "fromMailer",
      "fromName",
      "username",
      "password",
      "host",
      "port",
      "encryption",
      "statusId"
    ];
}
