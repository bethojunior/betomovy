<?php

namespace app\queue\Jobs;

use app\dao\DriverDao;
use app\dao\LogDao;
use app\queue\JobInterface;
use Exception;

class DriverRegisterJob implements JobInterface
{
    public function handle(array $payload): void
    {
        $data = json_decode(json_encode($payload['data'] ?? new \stdClass()));

        if (!$data || !isset($data->driver)) {
            throw new Exception('Payload de cadastro inválido');
        }

        try {
            (new DriverDao())->register(
                $data,
                $payload['photos'] ?? [],
                (bool) ($payload['registerByManager'] ?? false),
                $payload['userLoggedManagerId'] ?? null
            );
        } catch (Exception $e) {
            (new LogDao())->logException($e);
            throw $e;
        } finally {
            $this->cleanupPhotos($payload['photos'] ?? []);
        }
    }

    private function cleanupPhotos(array $photos): void
    {
        foreach ($photos as $file) {
            if (!empty($file['tmp_name']) && is_file($file['tmp_name'])) {
                @unlink($file['tmp_name']);
            }
        }
    }
}
