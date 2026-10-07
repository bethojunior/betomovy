<?php

namespace app\queue;

use app\dao\LogDao;
use Predis\Client;
use Throwable;

class Queue
{
    public const QUEUE_DEFAULT = 'queue:default';
    public const QUEUE_DELAYED = 'queue:default:delayed';
    public const QUEUE_FAILED = 'queue:default:failed';

    public static function dispatch(string $jobClass, array $payload, int $maxAttempts = 10): void
    {
        $job = [
            'id' => uniqid(),
            'class' => $jobClass,
            'attempts' => 0,
            'maxAttempts' => $maxAttempts,
            'payload' => $payload,
        ];

        try {
            self::connection()->rpush(self::QUEUE_DEFAULT, json_encode($job));
        } catch (Throwable $e) {
            (new LogDao)->logException($e);
            self::dispatchViaCli($jobClass, $payload);
        }
    }

    public static function connection(): Client
    {
        return new Client([
            'scheme' => 'tcp',
            'host' => env('REDIS_HOST', '127.0.0.1'),
            'port' => (int) env('REDIS_PORT', 6379),
            'password' => env('REDIS_PASSWORD') ?: null,
            'timeout' => 2,
            'read_write_timeout' => 2,
        ]);
    }

    public static function workerConnection(): Client
    {
        return new Client([
            'scheme' => 'tcp',
            'host' => env('REDIS_HOST', '127.0.0.1'),
            'port' => (int) env('REDIS_PORT', 6379),
            'password' => env('REDIS_PASSWORD') ?: null,
            'timeout' => 5,
            'read_write_timeout' => 15,
        ]);
    }

    private static function dispatchViaCli(string $jobClass, array $payload): void
    {
        $console = dirname(__DIR__, 2) . '/console/command.php';
        $encodedPayload = base64_encode(json_encode($payload));

        $command = sprintf(
            'nohup php %s run-queue-job %s %s > /dev/null 2>&1 &',
            escapeshellarg($console),
            escapeshellarg($jobClass),
            escapeshellarg($encodedPayload)
        );

        exec($command);
    }
}
