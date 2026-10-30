<?php

namespace app\commands;

use app\dao\DriverDao;
use app\utils\Command;

class CleanupFinishedTripRealtimeCommand extends Command
{
    public function handle(): void
    {
        $tripReference = $this->params[2] ?? null;
        if (!$tripReference) {
            $this->response = 'tripReference obrigatorio';
            return;
        }

        (new DriverDao())->cleanupFinishedTripRealtime($tripReference);
        $this->response = "Realtime limpo para {$tripReference}";
    }
}
