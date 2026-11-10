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
if (strpos($uriLowerPath, '/customer/profile/') === 0 || strpos($uriLowerPath, '/customer/doc/') === 0 || strpos($uriLowerPath, '/driver/profile/') === 0 || strpos($uriLowerPath, '/driver/docs/') === 0 || strpos($uriLowerPath, '/driver/doc/') === 0) {
    $reqPath = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
    $staticFile = __DIR__ . $reqPath;
    if (file_exists($staticFile) && !is_dir($staticFile)) {
        $mime = 'image/jpeg';
        if (substr($staticFile, -4) === '.png') $mime = 'image/png';
        elseif (substr($staticFile, -5) === '.webp') $mime = 'image/webp';
        header("Content-Type: " . $mime);
        header("Cache-Control: public, max-age=86400");
        readfile($staticFile);
        exit(0);
    }
    // Retorna avatar padrão embutido em PNG com status 200 OK para garantir exibição sem quebra
    $defaultAvatarPng = base64_decode('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');
    header("Content-Type: image/png");
    header("Cache-Control: public, max-age=86400");
    echo $defaultAvatarPng;
    exit(0);
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

        $redisStatus = 'not_tested';
        $redisError = null;
        if ($uriPath === '/health') {
            try {
                // Preferir getenv (vars do App Platform). Ignorar localhost do .env bakeado.
                $redisHost = trim((string)(getenv('REDIS_HOST') ?: ''));
                $isLocalFallback = $redisHost === '' || in_array(strtolower($redisHost), ['127.0.0.1', 'localhost'], true);
                $redisTlsEnv = getenv('REDIS_TLS');
                $hasDoBinding = $redisTlsEnv !== false || (getenv('REDIS_PASSWORD') !== false && getenv('REDIS_PASSWORD') !== '');
                if ($isLocalFallback && !$hasDoBinding) {
                    $redisStatus = 'not_configured';
                } elseif ($isLocalFallback) {
                    $redisStatus = 'waiting_binding';
                    $redisError = 'REDIS_HOST ainda não resolvido pelo App Platform (localhost)';
                } else {
                    $useTls = filter_var($redisTlsEnv !== false ? $redisTlsEnv : false, FILTER_VALIDATE_BOOLEAN);
                    $redisOpts = [
                        'scheme' => $useTls ? 'tls' : 'tcp',
                        'host' => $redisHost,
                        'port' => (int)(getenv('REDIS_PORT') ?: 6379),
                        'password' => getenv('REDIS_PASSWORD') ?: null,
                        'timeout' => 2,
                        'read_write_timeout' => 2,
                    ];
                    if ($useTls) {
                        $redisOpts['ssl'] = ['verify_peer' => false, 'verify_peer_name' => false];
                    }
                    $redis = new \Predis\Client($redisOpts);
                    $pong = $redis->ping();
                    $redisStatus = ($pong === true || $pong === 'PONG' || (string)$pong === 'PONG') ? 'connected' : ('unexpected:' . (string)$pong);
                }
            } catch (\Throwable $e) {
                $redisStatus = 'failed';
                $redisError = $e->getMessage();
            }
        }

        echo json_encode([
            'status' => true,
            'message' => 'MOVY API Online',
            'version' => '1.0.3',
            'timestamp' => date('Y-m-d H:i:s'),
            'database' => $dbStatus,
            'db_error' => $dbError,
            'redis' => $redisStatus,
            'redis_error' => $redisError,
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
