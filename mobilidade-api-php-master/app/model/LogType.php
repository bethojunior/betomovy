<?php

namespace app\model;
/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 30/07/2018
 * Time: 10:44
 */
class LogType
{
    const PROCESS = 1;
    const INSERT = 2;
    const QUERY = 3;
    const UPDATE = 4;
    const DELETE = 5;
    const ERROR = 6;
    const FATAL_ERROR = 7;
}