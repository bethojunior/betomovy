<?php

namespace app\utils;

use DateTime;

class Logger
{
    static function info(string $message): void
    {
        $date = (new DateTime())->format('Y-m-d') ?? 'log';
        $timestamp = (new DateTime())->format('Y-m-d H:i:s');
        $logMessage = "[$timestamp] " . "INFO" . ": $message\n";

        $dir = __DIR__ . "/../../storage/logs";
        if (!is_dir($dir)) {
            mkdir($dir, 0775, true);
        }

        file_put_contents("{$dir}/{$date}.log", $logMessage, FILE_APPEND);
    }
}
