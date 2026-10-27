<?php
// Movy API Deploy: 2026-10-27 12:55 UTC

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

if (strpos($_SERVER['REQUEST_URI'] ?? '', '/test-diag') === 0) {
    header("Content-Type: application/json; charset=utf-8");
    $daoFile = __DIR__ . '/../app/dao/TripDao.php';
    $lines = file_exists($daoFile) ? file($daoFile) : [];
    echo json_encode([
        "status" => true,
        "msg" => "Top of index.php reached",
        "trip_dao_mtime" => file_exists($daoFile) ? date('Y-m-d H:i:s', filemtime($daoFile)) : null,
        "trip_dao_line89" => trim($lines[88] ?? ''),
        "trip_dao_line90" => trim($lines[89] ?? ''),
        "trip_dao_line215" => trim($lines[214] ?? ''),
        "php_version" => PHP_VERSION,
        "time" => date('Y-m-d H:i:s')
    ]);
    exit(0);
}

// ===== DB MIGRATION ENDPOINT (REMOVE AFTER MIGRATION) =====
if (strpos($_SERVER['REQUEST_URI'] ?? '', '/db-mig') === 0) {
    set_time_limit(600);
    ini_set('memory_limit', '512M');
    $secret = $_GET['secret'] ?? '';
    if ($secret !== 'movy-migrate-2026') { http_response_code(403); echo json_encode(['error'=>'Forbidden']); exit; }
    header('Content-Type: application/json; charset=utf-8');
    $action = $_GET['action'] ?? 'status';
    $dbHost = getenv('MYSQL_HOST') ?: 'movy-mysql-do-user-45837300-0.f.db.ondigitalocean.com';
    $dbPort = getenv('MYSQL_PORT') ?: '25060';
    $dbUser = getenv('MYSQL_USER') ?: 'doadmin';
    $dbPass = getenv('MYSQL_PASS') ?: 'AVNS_ODYdiYw4rvg6gfvKYOO';
    $dbName = getenv('MYSQL_NAME') ?: 'defaultdb';
    try {
        $pdo = new PDO("mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4", $dbUser, $dbPass,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::MYSQL_ATTR_SSL_CA => true, PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false]);
        if ($action === 'status') {
            $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
            echo json_encode(['status'=>true,'database'=>$dbName,'tables_count'=>count($tables),'tables'=>$tables]);
        } elseif ($action === 'run_sql') {
            $sql = file_get_contents('php://input');
            if (empty($sql)) { echo json_encode(['error'=>'No SQL']); exit; }
            $pdo->exec("SET FOREIGN_KEY_CHECKS=0");
            $pdo->exec("SET SQL_MODE='NO_AUTO_VALUE_ON_ZERO'");
            $pdo->exec("SET NAMES utf8mb4");
            try { $pdo->exec("SET SESSION sql_require_primary_key = 0"); } catch (\Throwable $t) {}
            $queries = preg_split('/;\s*[\r\n]+/', $sql);
            $ok = 0; $errs = [];
            foreach ($queries as $q) {
                $q = trim($q);
                if (empty($q) || $q[0]==='-' || substr($q,0,2)==='/*') continue;
                try { $pdo->exec($q); $ok++; } catch(\PDOException $e) { $errs[] = ['q'=>substr($q,0,80),'e'=>$e->getMessage()]; }
            }
            $pdo->exec("SET FOREIGN_KEY_CHECKS=1");
            echo json_encode(['status'=>true,'executed'=>$ok,'errors_count'=>count($errs),'errors'=>array_slice($errs,0,10)]);
        } elseif ($action === 'query') {
            $sql = file_get_contents('php://input');
            if (empty($sql)) { echo json_encode(['error'=>'No SQL']); exit; }
            $stmt = $pdo->query($sql);
            echo json_encode(['status'=>true, 'data'=>$stmt->fetchAll(PDO::FETCH_ASSOC)]);
            exit;
        } elseif ($action === 'count_rows') {
            $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
            $counts = [];
            foreach ($tables as $t) { try { $counts[$t]=(int)$pdo->query("SELECT COUNT(*) FROM `$t`")->fetchColumn(); } catch(\Exception $e){ $counts[$t]='err'; } }
            echo json_encode(['status'=>true,'table_rows'=>$counts]);
        }
    } catch(\PDOException $e) { echo json_encode(['status'=>false,'error'=>$e->getMessage()]); }
    exit;
}
// ===== END DB MIGRATION ENDPOINT =====

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
