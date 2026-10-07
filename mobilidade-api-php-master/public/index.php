<?php

use app\controllers\ApiController;
use app\dao\LogDao;
use app\utils\RouteListener;

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('session.gc_probality', 0);
date_default_timezone_set('America/Fortaleza');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: token, userid, version, platform, Content-Type, accept, cityid, placesSearchRadius, enableCustomRadiusCentral, centralId");

session_start();

require_once realpath(__DIR__ . '/../vendor/autoload.php');

// Looking for .env at the root directory
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__, '../.env');
$dotenv->safeLoad();

require 'env.php';

try {
    $route = new RouteListener;

    if (!isset($_SERVER['REQUEST_URI'])) {
        throw new Exception("Rota não existe");
    }

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS')
        die();

    $route->get($_SERVER['REQUEST_URI']);
} catch (Exception | Throwable $e) {
    if ($e->getMessage() !== "Token não enviado") {
        (new LogDao)->logException($e);
    }
    echo (new ApiController)->returnError($e);
}
