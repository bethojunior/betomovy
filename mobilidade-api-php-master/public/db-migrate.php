<?php
/**
 * Script de migração do banco de dados rota101 → DigitalOcean MySQL
 * USO: Chamar via HTTP com autenticação de segurança
 * DELETAR após migração concluída
 */

// Segurança básica
$secret = $_GET['secret'] ?? '';
if ($secret !== 'movy-migrate-2026') {
    http_response_code(403);
    echo json_encode(['error' => 'Forbidden']);
    exit;
}

header('Content-Type: application/json; charset=utf-8');
set_time_limit(600); // 10 minutos
ini_set('memory_limit', '512M');

$action = $_GET['action'] ?? 'status';

if (file_exists(__DIR__ . '/../vendor/autoload.php')) {
    require_once __DIR__ . '/../vendor/autoload.php';
}

if ($action === 'test_controller') {
    $c = $_GET['c'] ?? 'AppConfigController';
    $fullClass = "app\\controllers\\" . $c;
    try {
        if (!class_exists($fullClass)) {
            echo json_encode(['status' => false, 'error' => "Classe não existe: $fullClass"]);
            exit;
        }
        $obj = new $fullClass();
        ob_start();
        $obj->actionIndex();
        $out = ob_get_clean();
        echo json_encode(['status' => true, 'output' => $out]);
    } catch (\Throwable $e) {
        echo json_encode([
            'status' => false,
            'error' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]);
    }
    exit;
}

// Config banco DigitalOcean
$host = getenv('MYSQL_HOST') ?: 'movy-mysql-do-user-45837300-0.f.db.ondigitalocean.com';
$port = getenv('MYSQL_PORT') ?: '25060';
$user = getenv('MYSQL_USER') ?: 'doadmin';
$pass = getenv('MYSQL_PASS') ?: 'AVNS_ODYdiYw4rvg6gfvKYOO';
$dbname = getenv('MYSQL_NAME') ?: 'movy_db';

try {
    $pdo = new PDO(
        "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4",
        $user,
        $pass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::MYSQL_ATTR_SSL_CA => true,
            PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false,
        ]
    );

    if ($action === 'status') {
        // Lista tabelas existentes
        $stmt = $pdo->query("SHOW TABLES");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        echo json_encode([
            'status' => true,
            'database' => $dbname,
            'tables_count' => count($tables),
            'tables' => $tables
        ], JSON_PRETTY_PRINT);
        exit;
    }

    if ($action === 'query') {
        $sql = file_get_contents('php://input');
        if (empty($sql)) {
            $sql = $_GET['q'] ?? '';
        }
        $stmt = $pdo->query($sql);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            'status' => true,
            'count' => count($rows),
            'rows' => $rows
        ], JSON_PRETTY_PRINT);
        exit;
    }

    if ($action === 'check_missing') {
        // Lista tabelas existentes
        $stmt = $pdo->query("SHOW TABLES");
        $existing = $stmt->fetchAll(PDO::FETCH_COLUMN);

        // Tabelas esperadas (lista das mais críticas)
        $expected = [
            'user', 'userType', 'city', 'cityArea', 'estate', 'country',
            'driver', 'customer', 'trip', 'tripType', 'price', 'priceDynamic',
            'priceDynamicScheduled', 'config', 'centralUser', 'role',
            'permission', 'rolePermission', 'userRole', 'payment', 'paymentType',
            'paymentMethod', 'car', 'carType', 'balance', 'bank', 'bankAccount',
            'withdrawal', 'notification', 'adminNotification', 'address',
            'appConfig', 'appVersion', 'audit', 'cancellationReasons',
            'route', 'routeDriver', 'schedule', 'zone',
            'serviceOption', 'serviceType', 'tripServiceOption',
        ];

        $missing = array_diff($expected, $existing);
        $found = array_intersect($expected, $existing);

        echo json_encode([
            'status' => true,
            'existing_total' => count($existing),
            'expected' => count($expected),
            'found' => array_values($found),
            'missing' => array_values($missing),
            'all_existing' => $existing
        ], JSON_PRETTY_PRINT);
        exit;
    }

    if ($action === 'run_sql') {
        // Recebe SQL via POST body
        $sql = file_get_contents('php://input');
        if (empty($sql)) {
            echo json_encode(['error' => 'No SQL provided']);
            exit;
        }

        // Executa SQL em chunks (divididos por ;)
        $pdo->exec("SET FOREIGN_KEY_CHECKS=0");
        $pdo->exec("SET SQL_MODE='NO_AUTO_VALUE_ON_ZERO'");
        $pdo->exec("SET NAMES utf8mb4");

        $results = [];
        $queries = explode(";\n", $sql);
        $success = 0;
        $errors = [];

        foreach ($queries as $q) {
            $q = trim($q);
            if (empty($q) || substr($q, 0, 2) === '--' || substr($q, 0, 2) === '/*') continue;
            try {
                $pdo->exec($q);
                $success++;
            } catch (PDOException $e) {
                $errors[] = ['query' => substr($q, 0, 100), 'error' => $e->getMessage()];
            }
        }

        $pdo->exec("SET FOREIGN_KEY_CHECKS=1");

        echo json_encode([
            'status' => true,
            'executed' => $success,
            'errors_count' => count($errors),
            'errors' => array_slice($errors, 0, 20)
        ], JSON_PRETTY_PRINT);
        exit;
    }

    if ($action === 'count_rows') {
        // Conta registros por tabela
        $stmt = $pdo->query("SHOW TABLES");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        $counts = [];
        foreach ($tables as $t) {
            try {
                $r = $pdo->query("SELECT COUNT(*) FROM `$t`")->fetchColumn();
                $counts[$t] = (int)$r;
            } catch (Exception $e) {
                $counts[$t] = 'error';
            }
        }
        echo json_encode(['status' => true, 'table_rows' => $counts], JSON_PRETTY_PRINT);
        exit;
    }

} catch (PDOException $e) {
    echo json_encode([
        'status' => false,
        'error' => $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
