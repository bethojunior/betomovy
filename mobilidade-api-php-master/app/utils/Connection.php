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
    const DB_MONGO    = 'mongodb';

    const SQL = 'sql';
    const NOSQL = 'nosql';

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
                $host = env('MYSQL_HOST') ?: getenv('MYSQL_HOST') ?: 'movy-mysql-do-user-45837300-0.f.db.ondigitalocean.com';
                $name = env('MYSQL_NAME') ?: getenv('MYSQL_NAME') ?: 'defaultdb';
                $user = env('MYSQL_USER') ?: getenv('MYSQL_USER') ?: 'doadmin';
                $pass = env('MYSQL_PASS') ?: getenv('MYSQL_PASS') ?: 'AVNS_ODYdiYw4rvg6gfvKYOO';
                $port = env('MYSQL_PORT') ?: getenv('MYSQL_PORT') ?: '25060';
                break;
            case self::DB_MYSQL_RO:
                $type = self::DB_MYSQL_RO;
                $host = env('MYSQL_HOST_RO') ?: env('MYSQL_HOST') ?: getenv('MYSQL_HOST') ?: 'movy-mysql-do-user-45837300-0.f.db.ondigitalocean.com';
                $name = env('MYSQL_NAME_RO') ?: env('MYSQL_NAME') ?: getenv('MYSQL_NAME') ?: 'defaultdb';
                $user = env('MYSQL_USER_RO') ?: env('MYSQL_USER') ?: getenv('MYSQL_USER') ?: 'doadmin';
                $pass = env('MYSQL_PASS_RO') ?: env('MYSQL_PASS') ?: getenv('MYSQL_PASS') ?: 'AVNS_ODYdiYw4rvg6gfvKYOO';
                $port = env('MYSQL_PORT_RO') ?: env('MYSQL_PORT') ?: getenv('MYSQL_PORT') ?: '25060';
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
        $db = ($sql == self::SQL || $sql == self::DB_MYSQL) ? (env('MYSQL_NAME') ?: 'defaultdb') : (env('MONGODB_NAME') ?: 'defaultdb');
        return (string)($db ?: 'defaultdb');
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
            if (defined('Pdo\Mysql::ATTR_SSL_VERIFY_SERVER_CERT')) {
                $options[\Pdo\Mysql::ATTR_SSL_VERIFY_SERVER_CERT] = false;
            } elseif (defined('PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT')) {
                $options[PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT] = false;
            }

            $conn = new PDO($dsn, $user, $pass, $options);
            $conn->exec(
                "SET NAMES 'utf8mb4_unicode_ci';
                    SET character_set_connection=utf8mb4_unicode_ci;
                    SET character_set_client=utf8mb4_unicode_ci;
                    SET character_set_results=utf8mb4_unicode_ci;"
            );
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


            return $conn;
        }

        if ($type == self::DB_MYSQL_RO) {
            static $connRO;

            if (isset($connRO) && self::isMysqlAlive($connRO)) {
                return $connRO;
            }

            $connRO = new PDO($dsn, $user, $pass, [
                PDO::MYSQL_ATTR_FOUND_ROWS => true
            ]);
            $connRO->exec(
                "SET NAMES 'utf8mb4_unicode_ci';
                    SET character_set_connection=utf8mb4_unicode_ci;
                    SET character_set_client=utf8mb4_unicode_ci;
                    SET character_set_results=utf8mb4_unicode_ci;"
            );
            $connRO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


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
