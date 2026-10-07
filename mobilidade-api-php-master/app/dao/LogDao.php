<?php

namespace app\dao;

use app\model\Log;
use app\queue\Jobs\PulseJob;
use app\queue\Queue;

class LogDao
{

    public function insert(Log $log)
    {
        // Queue::dispatch(
        //     PulseJob::class,
        //     [
        //         'message' => $log->getMessage(),
        //         'context' => $log->getTrace(),
        //         'type' => 'info'
        //     ]
        // );
        return true;
    }

    public function insertMany($logs)
    {
        // $logs = array_map(function ($logRequest) {
        //     $queue = Queue::dispatch(
        //         PulseJob::class,
        //         [
        //             'message' => $logRequest->message,
        //             'context' => $logRequest->data,
        //             'type' => 'info'
        //         ]
        //     );
        // }, array: $logs);

        return true;
    }


    public function logException($exception, $message = "ERROR", $data = null)
    {
        // Queue::dispatch(
        //     PulseJob::class,
        //     [
        //         'message' => $message,
        //         'context' => $exception,
        //         'type' => 'error'
        //     ]
        // );
        return true;
    }

    public function logApplication($message = "ERROR", $data = null)
    {
        // Queue::dispatch(
        //     PulseJob::class,
        //     [
        //         'message' => $message,
        //         'context' => $data,
        //         'type' => 'warn'
        //     ]
        // );
        return true;
    }

    public function logError($message, $dir = null, $data = null)
    {
        // Queue::dispatch(
        //     PulseJob::class,
        //     [
        //         'message' => $message,
        //         'context' => $data,
        //         'type' => 'error'
        //     ]
        // );
        return true;
    }
}
