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
    $uriPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
    if ($uriPath === '/' || $uriPath === '/health' || $uriPath === '/test-db') {
        header('Content-Type: application/json; charset=utf-8');
        $dbStatus = 'not_tested';
        $dbError = null;
        if ($uriPath === '/test-db' || $uriPath === '/health') {
            try {
                $conn = \app\utils\Connection::open();
                $stmt = $conn->query("SELECT 1 as alive");
                $dbStatus = 'connected (' . $stmt->fetchColumn() . ')';
            } catch (\Throwable $e) {
                $dbStatus = 'failed';
                $dbError = [
                    'message' => $e->getMessage(),
                    'code' => $e->getCode(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ];
            }
        }

        echo json_encode([
            'status' => true,
            'message' => 'MOVY API Online',
            'version' => '1.0.2',
            'timestamp' => date('Y-m-d H:i:s'),
            'database' => $dbStatus,
            'db_error' => $dbError
        ]);
        exit;
    }

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
