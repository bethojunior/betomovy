<?php
// Movy API Deploy: 2026-10-28 00:22 UTC - Fix TripRealtimeApiClient baseUrl null and php-fpm clear_env

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

$uriLowerPath = strtolower(parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH));
if (strpos($uriLowerPath, '/customer/profile/') === 0 || strpos($uriLowerPath, '/customer/doc/') === 0) {
    $staticFile = __DIR__ . parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
    if (file_exists($staticFile) && !is_dir($staticFile)) {
        $mime = 'image/jpeg';
        if (substr($staticFile, -4) === '.png') $mime = 'image/png';
        elseif (substr($staticFile, -5) === '.webp') $mime = 'image/webp';
        header("Content-Type: " . $mime);
        header("Cache-Control: public, max-age=86400");
        readfile($staticFile);
        exit(0);
    }
}
if (in_array($uriLowerPath, ['/privacy', '/privacidade', '/privacy-policy', '/politica-de-privacidade', '/privacy.html', '/privacidade.html'])) {
    header("Content-Type: text/html; charset=utf-8");
    $privacyFile = __DIR__ . '/privacy.html';
    if (file_exists($privacyFile)) {
        readfile($privacyFile);
    } else {
        echo "<!DOCTYPE html><html><head><title>Privacy Policy - Movie</title></head><body><h1>Privacy Policy - Movie (br.com.client.rota101)</h1><p>Contact: suporte@movymob.com</p></body></html>";
    }
    exit(0);
}


if (strpos($_SERVER['REQUEST_URI'] ?? '', '/db-mig') === 0) {
    http_response_code(410);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['status' => false, 'error' => 'disabled']);
    exit;
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
            'version' => '1.0.3',
            'timestamp' => date('Y-m-d H:i:s'),
            'database' => $dbStatus,
            'db_error' => $dbError
        ]);
        exit;
    }

    if ($uriPath === '/test-s3') {
        header('Content-Type: application/json; charset=utf-8');
        try {
            $s3 = new \app\utils\S3;
            $testContent = "MOVY S3 Test " . date('Y-m-d H:i:s');
            $testFile = tempnam(sys_get_temp_dir(), 's3test');
            file_put_contents($testFile, $testContent);
            $res = $s3->uploadSingle('test/ping.txt', $testFile);
            @unlink($testFile);
            echo json_encode(['status' => true, 'message' => 'S3 upload successful', 'result' => $res]);
        } catch (\Throwable $e) {
            echo json_encode(['status' => false, 'error' => $e->getMessage()]);
        }
        exit;
    }

    if (strpos($uriPath, '/test-controller') === 0) {
        ini_set('display_errors', 1);
        error_reporting(E_ALL);
        header('Content-Type: application/json; charset=utf-8');
        try {
            $name = $_GET['name'] ?? 'AppConfigController';
            $file = realpath(__DIR__ . '/../app/controllers/' . $name . '.php');
            if (!$file || !file_exists($file)) {
                echo json_encode(['status' => false, 'error' => 'File does not exist: ' . $file]);
                exit;
            }
            require_once $file;
            $fullClass = '\\app\\controllers\\' . $name;
            if (!class_exists($fullClass)) {
                echo json_encode(['status' => false, 'error' => "Class $fullClass not found after require"]);
                exit;
            }
            $ctl = new $fullClass();
            ob_start();
            $ctl->actionIndex();
            $out = ob_get_clean();
            echo json_encode(['status' => true, 'output' => $out]);
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
