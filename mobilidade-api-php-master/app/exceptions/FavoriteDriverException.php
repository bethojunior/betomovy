<?php

namespace app\exceptions;

use app\utils\BaseException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 12/12/2018
 * Time: 18:32
 */
class FavoriteDriverException extends BaseException
{
    protected $keyCode = 'favorite-driver';
}