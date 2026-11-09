<?php

namespace app\utils;

use DateTime;

class Logger
{
    static function info(string $message): void
    {
        self::write('INFO', $message);
    }

    static function error(string $message): void
    {
        self::write('ERROR', $message);
    }

    static function warning(string $message): void
    {
        self::write('WARNING', $message);
    }

    private static function write(string $level, string $message): void
    {
        try {
            $date = (new DateTime())->format('Y-m-d') ?? 'log';
            $timestamp = (new DateTime())->format('Y-m-d H:i:s');
            $logMessage = "[$timestamp] [{$level}]: {$message}\n";

            $dir = __DIR__ . "/../../storage/logs";
            if (!is_dir($dir)) {
                @mkdir($dir, 0775, true);
            }

            @file_put_contents("{$dir}/{$date}.log", $logMessage, FILE_APPEND);
        } catch (\Throwable $e) {
            // Silently fall back to standard error_log
            @error_log("[{$level}]: {$message}");
        }
    }
}
