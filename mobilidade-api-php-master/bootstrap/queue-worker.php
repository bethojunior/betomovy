<?php

set_time_limit(0);
error_reporting(E_ALL);
ini_set('display_errors', 1);

require __DIR__ . '/autoload.php';

use app\queue\JobInterface;
use app\queue\Queue;
use Predis\Client;

function logMessage(string $level, string $message): void
{
    echo '[' . strtoupper($level) . '] '
        . date('Y-m-d H:i:s')
        . " | {$message}"
        . PHP_EOL;
}

register_shutdown_function(function () {
    $error = error_get_last();

    if ($error !== null) {
        echo '[FATAL] ' . date('Y-m-d H:i:s') . ' | ';
        print_r($error);
        echo PHP_EOL;
    }
});

function connectRedis(): Client
{
    while (true) {
        try {
            $redis = Queue::workerConnection();
            $redis->ping();

            return $redis;
        } catch (Throwable $e) {
            logMessage('redis-error', 'Erro ao conectar Redis: ' . $e->getMessage());
            sleep(2);
        }
    }
}

$redis = connectRedis();

logMessage('worker', 'Worker iniciado (fila: ' . Queue::QUEUE_DEFAULT . ')');

$processedJobs = 0;
$jobsSinceStart = 0;
$lastIdleLogAt = 0;

while (true) {
    try {
        try {
            $now = time();
            $jobs = $redis->zrangebyscore(Queue::QUEUE_DELAYED, 0, $now);

            foreach ($jobs as $jobJson) {
                $redis->multi();
                $redis->rpush(Queue::QUEUE_DEFAULT, $jobJson);
                $redis->zrem(Queue::QUEUE_DELAYED, $jobJson);
                $redis->exec();

                logMessage('queue', 'Job movido da fila delayed para default.');
            }
        } catch (Throwable $e) {
            logMessage('delayed-error', $e->getMessage());
        }

        try {
            $jobData = $redis->blpop([Queue::QUEUE_DEFAULT], 5);
        } catch (Throwable $e) {
            logMessage('redis-error', 'Erro no BLPOP: ' . $e->getMessage());
            $redis = connectRedis();
            continue;
        }

        if (!$jobData) {
            $now = time();
            if ($now - $lastIdleLogAt >= 60) {
                logMessage('idle', 'Aguardando jobs...');
                $lastIdleLogAt = $now;
                gc_collect_cycles();
            }

            continue;
        }

        $job = json_decode($jobData[1], true);

        if (!is_array($job)) {
            logMessage('error', 'Job invalido (JSON mal formatado).');
            continue;
        }

        $jobId = $job['id'] ?? uniqid();
        $attempts = $job['attempts'] ?? 0;
        $maxAttempts = $job['maxAttempts'] ?? 10;
        $startTime = microtime(true);

        try {
            if (empty($job['class'])) {
                throw new Exception("Campo 'class' nao informado.");
            }

            $class = $job['class'];

            if (!class_exists($class)) {
                throw new Exception("Classe {$class} nao encontrada.");
            }

            $instance = new $class();

            if (!$instance instanceof JobInterface) {
                throw new Exception("Classe {$class} nao implementa JobInterface.");
            }

            logMessage(
                'processing',
                "Executando Job ID: {$jobId} | Classe: {$class} | Tentativa: " . ($attempts + 1)
            );

            $instance->handle($job['payload'] ?? []);

            $executionTime = round(microtime(true) - $startTime, 4);
            $memoryUsage = round(memory_get_usage(true) / 1024 / 1024, 2);

            logMessage(
                'success',
                "Job ID: {$jobId} executado | Tempo: {$executionTime}s | Memoria: {$memoryUsage}MB"
            );
        } catch (Throwable $e) {
            $job['attempts'] = $attempts + 1;

            if ($job['attempts'] >= $maxAttempts) {
                $redis->rpush(Queue::QUEUE_FAILED, json_encode($job));

                logMessage(
                    'failed',
                    "Job ID: {$jobId} falhou apos {$job['attempts']} tentativas | {$e->getMessage()}"
                );
            } else {
                $delay = 5;

                $redis->zadd(
                    Queue::QUEUE_DELAYED,
                    time() + $delay,
                    json_encode($job)
                );

                logMessage(
                    'retry',
                    "Job ID: {$jobId} reagendado | Tentativa: {$job['attempts']} | {$e->getMessage()}"
                );
            }
        }

        unset($job, $jobData, $instance);

        $processedJobs++;
        $jobsSinceStart++;

        if ($processedJobs >= 50) {
            gc_collect_cycles();
            $processedJobs = 0;
        }

        if ($jobsSinceStart >= 1000) {
            logMessage('worker', 'Reiniciando worker por ciclo de jobs');
            exit(0);
        }

        if (memory_get_usage(true) > 300 * 1024 * 1024) {
            logMessage('worker', 'Reiniciando por uso de memoria alto');
            exit(0);
        }
    } catch (Throwable $e) {
        logMessage('worker-error', 'Erro critico: ' . $e->getMessage());
        sleep(2);
        logMessage('worker', 'Reconectando Redis...');
        $redis = connectRedis();
    }
}
