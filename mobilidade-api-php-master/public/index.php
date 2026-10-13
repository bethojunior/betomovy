<?php

use app\controllers\ApiController;
use app\dao\LogDao;
use app\utils\RouteListener;

error_reporting(E_ALL);
ini_set('display_errors', 0);
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

if (($_SERVER['REQUEST_URI'] ?? '') === '/test-diag') {
    header("Content-Type: application/json; charset=utf-8");
    echo json_encode(["status" => true, "msg" => "Top of index.php reached"]);
    exit(0);
}

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

    if ($uriPath === '/test-city') {
        ini_set('display_errors', 1);
        error_reporting(E_ALL);
        header('Content-Type: application/json; charset=utf-8');
        try {
            $file = realpath(__DIR__ . '/../app/controllers/CityController.php');
            if (!$file || !file_exists($file)) {
                echo json_encode(['status' => false, 'error' => 'File does not exist: ' . $file]);
                exit;
            }
            require_once $file;
            $classExists = class_exists('\app\controllers\CityController');
            if (!$classExists) {
                echo json_encode(['status' => false, 'error' => 'Class CityController not found after require']);
                exit;
            }
            $ctl = new \app\controllers\CityController();
            echo json_encode(['status' => true, 'loaded' => get_class($ctl)]);
        } catch (\Throwable $err) {
            echo json_encode([
                'status' => false,
                'class' => get_class($err),
                'message' => $err->getMessage(),
                'file' => $err->getFile(),
                'line' => $err->getLine(),
                'trace' => $err->getTraceAsString()
            ]);
        }
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
