<?php

/**
 * Created by PhpStorm.
 * Date: 04/01/2019
 * Time: 09:50
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('session.gc_probality', 0);
date_default_timezone_set('America/Fortaleza');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH");
header("Access-Control-Allow-Headers: Authorization, token, userid, userId, version, platform, Content-Type, accept, cityid, placesSearchRadius, enableCustomRadiusCentral, centralId, Origin, X-Requested-With");
header("Access-Control-Max-Age: 86400");

if (isset($_SERVER['REQUEST_METHOD']) && strtoupper($_SERVER['REQUEST_METHOD']) === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

session_start();

require_once realpath(__DIR__ . '/../vendor/autoload.php');

// Looking for .env at the root directory
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__, '../.env');
$dotenv->safeLoad();

require 'env.php';
// exec('php queue-worker.php > /dev/null 2>&1 &');
