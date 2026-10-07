<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/01/2019
 * Time: 09:49
 */

use app\utils\Command;

include '../bootstrap/autoload.php';

$command = new Command($argv);

$response = $command->exec($argv[1]);

echo is_string($response) ? $response : json_encode($response) . "\n";