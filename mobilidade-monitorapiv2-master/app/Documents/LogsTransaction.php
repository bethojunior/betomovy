<?php 
namespace App\Documents;

use Jenssegers\Mongodb\Eloquent\Model as Document;

class LogsTransaction extends Document
{
    protected $collection = 'transactions_logs';
    protected $connection = 'mongodb';

    protected $fillable = ['data', 'userId', 'created_at', 'dir'];
    protected $dates = [
      'created_at',
  ];
}
