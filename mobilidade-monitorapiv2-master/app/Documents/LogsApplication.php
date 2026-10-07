<?php 
namespace App\Documents;

use Jenssegers\Mongodb\Eloquent\Model as Document;

class LogsApplication extends Document
{
    protected $collection = 'logs-application';
    protected $connection = 'mongodb';

    protected $fillable = ['data', 'userId', 'created_at', 'dir'];
    protected $dates = [
      'created_at',
  ];
}
