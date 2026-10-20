<?php

namespace app\dao;

use app\utils\Connection;
use PDO;

class GenericDao
{
    public static function query(string $sql, array $params = []): array
    {
        $pdo = Connection::open();
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return is_array($res) ? $res : [];
    }

    public static function first(string $sql, array $params = []): ?array
    {
        $pdo = Connection::open();
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $res = $stmt->fetch(PDO::FETCH_ASSOC);
        return $res ?: null;
    }

    public static function execute(string $sql, array $params = []): bool
    {
        $pdo = Connection::open();
        $stmt = $pdo->prepare($sql);
        return $stmt->execute($params);
    }
}
