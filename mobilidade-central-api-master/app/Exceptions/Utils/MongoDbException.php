<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/10/2019
 * Time: 08:26
 */

namespace App\Exceptions\Utils;


use App\Contracts\Exception\CustomException;

class MongoDbException extends CustomException
{
    protected $message = '[30] Falha de comunicação. Tente novamente';
}
