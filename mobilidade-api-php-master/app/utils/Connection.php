<?php

namespace app\utils;

// use MongoDB\Driver\Manager;
use PDO;

/**
 * Class Connection
 * @package utils
 */
final class Connection
{

    const DB_MYSQL    = 'mysql';
    const DB_MYSQL_RO = 'mysql_ro';
    const DB_MYSQL_RW = 'mysql';
    const DB_MONGO    = 'mongodb';

    const SQL = 'sql';
    const NOSQL = 'nosql';

    /**
     * Alias for open()
     * @param string $dbType
     * @return PDO
     */
    public static function getConnection(string $dbType = self::DB_MYSQL)
    {
        return self::open($dbType);
    }

    /**
     * Compatibility alias for getConnection / open
     */
    public function get(string $dbType = self::DB_MYSQL)
    {
        return self::open($dbType);
    }

    /**
     * Static compatibility alias
     */
    public static function getPdo(string $dbType = self::DB_MYSQL)
    {
        return self::open($dbType);
    }

    /**
     * @param string $dbType
     * @return Manager|PDO
     */
    public static function &open(string $dbType = self::DB_MYSQL)
    {
        $tls          = false;
        $replicaSet   = null;
        $isDocumentDB = false;
        $retryWrites  = false;

        switch ($dbType) {
            case self::DB_MYSQL:
                $type = self::DB_MYSQL;
                $host = env('MYSQL_HOST') ?: getenv('MYSQL_HOST') ?: '';
                $name = env('MYSQL_NAME') ?: getenv('MYSQL_NAME') ?: '';
                $user = env('MYSQL_USER') ?: getenv('MYSQL_USER') ?: '';
                $pass = env('MYSQL_PASS') ?: getenv('MYSQL_PASS') ?: '';
                $port = env('MYSQL_PORT') ?: getenv('MYSQL_PORT') ?: '25060';
                if ($host === '' || $name === '' || $user === '' || $pass === '') {
                    throw new \RuntimeException('MySQL: defina MYSQL_HOST, MYSQL_NAME, MYSQL_USER e MYSQL_PASS');
                }
                break;
            case self::DB_MYSQL_RO:
                $type = self::DB_MYSQL_RO;
                $host = env('MYSQL_HOST_RO') ?: env('MYSQL_HOST') ?: getenv('MYSQL_HOST') ?: '';
                $name = env('MYSQL_NAME_RO') ?: env('MYSQL_NAME') ?: getenv('MYSQL_NAME') ?: '';
                $user = env('MYSQL_USER_RO') ?: env('MYSQL_USER') ?: getenv('MYSQL_USER') ?: '';
                $pass = env('MYSQL_PASS_RO') ?: env('MYSQL_PASS') ?: getenv('MYSQL_PASS') ?: '';
                $port = env('MYSQL_PORT_RO') ?: env('MYSQL_PORT') ?: getenv('MYSQL_PORT') ?: '25060';
                if ($host === '' || $name === '' || $user === '' || $pass === '') {
                    throw new \RuntimeException('MySQL RO: defina as variáveis MYSQL_*');
                }
                break;
            default:
                return null;
        }

        $dsn = '';

        switch ($type) {
            case self::DB_MYSQL_RO:
            case self::DB_MYSQL:
                $port = $port ?: '3306';
                $dsn = "mysql:dbname={$name};host={$host};port={$port}";
                break;
        }

        return self::getConn($type, $dsn, $user, $pass);
    }

    public static function getDatabaseName($sql = self::SQL)
    {
        $db = ($sql == self::SQL || $sql == self::DB_MYSQL) ? (env('MYSQL_NAME') ?: 'movy_db') : (env('MONGODB_NAME') ?: 'defaultdb');
        return (string)($db ?: 'movy_db');
    }

    /**
     * @param $type
     * @param $dsn
     * @param string|null $user
     * @param string|null $pass
     * @return Manager|PDO
     */
    private static function &getConn($type, $dsn, ?string $user = '', ?string $pass = '')
    {
        $user = (string)($user ?? '');
        $pass = (string)($pass ?? '');
        if ($type == self::DB_MYSQL) {
            static $conn;

            if (isset($conn) && self::isMysqlAlive($conn)) {
                return $conn;
            }

            $options = [
                PDO::MYSQL_ATTR_FOUND_ROWS => true
            ];
            $caPath = '/etc/pki/tls/certs/ca-bundle.crt';
            if (defined('PDO::MYSQL_ATTR_SSL_CA')) {
                $options[PDO::MYSQL_ATTR_SSL_CA] = file_exists($caPath) ? $caPath : true;
            }
            if (defined('Pdo\Mysql::ATTR_SSL_VERIFY_SERVER_CERT')) {
                $options[\Pdo\Mysql::ATTR_SSL_VERIFY_SERVER_CERT] = false;
            } elseif (defined('PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT')) {
                $options[PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT] = false;
            }

            $conn = new PDO($dsn, $user, $pass, $options);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            try {
                $conn->exec("SET NAMES utf8mb4");
            } catch (\Throwable $t) {}
            try {
                $conn->exec("SET SESSION sql_mode='NO_AUTO_VALUE_ON_ZERO,STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION'");
            } catch (\Throwable $t) {}

            return $conn;
        }

        if ($type == self::DB_MYSQL_RO) {
            static $connRO;

            if (isset($connRO) && self::isMysqlAlive($connRO)) {
                return $connRO;
            }

            $optionsRO = [
                PDO::MYSQL_ATTR_FOUND_ROWS => true
            ];
            $caPath = '/etc/pki/tls/certs/ca-bundle.crt';
            if (defined('PDO::MYSQL_ATTR_SSL_CA')) {
                $optionsRO[PDO::MYSQL_ATTR_SSL_CA] = file_exists($caPath) ? $caPath : true;
            }
            if (defined('Pdo\Mysql::ATTR_SSL_VERIFY_SERVER_CERT')) {
                $optionsRO[\Pdo\Mysql::ATTR_SSL_VERIFY_SERVER_CERT] = false;
            } elseif (defined('PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT')) {
                $optionsRO[PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT] = false;
            }

            $connRO = new PDO($dsn, $user, $pass, $optionsRO);
            $connRO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            try {
                $connRO->exec("SET NAMES utf8mb4");
            } catch (\Throwable $t) {}
            try {
                $connRO->exec("SET SESSION sql_mode='NO_AUTO_VALUE_ON_ZERO,STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION'");
            } catch (\Throwable $t) {}

            return $connRO;
        }


        static $mongoConn;
    }

    private static function isMysqlAlive(PDO $pdo): bool
    {
        try {
            $pdo->query('SELECT 1');
            return true;
        } catch (\PDOException $e) {
            return false;
        }
    }
}
