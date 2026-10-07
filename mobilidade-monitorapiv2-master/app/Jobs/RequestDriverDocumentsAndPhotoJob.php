<?php

namespace App\Jobs;

use App\Services\Pulse\PulseService;
use App\Services\User\DriverService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class RequestDriverDocumentsAndPhotoJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 120;
    public int $tries = 3;
    
    protected array $request;

    public function __construct(array $request)
    {
        $this->request = $request;
    }
    public function handle(DriverService $service): void
    {
        $service->requestDocumentAndPhoto($this->request);
    }

    public function failed(\Throwable $e): void
    {
        $pulse = new PulseService(
            'monitor-api-voutehomologar',
            '08be92d4-b2b5-4962-b414-120bd63a54a0'
        );

        $context = json_encode([
            'message' => $e->getMessage(),
            'file'    => $e->getFile(),
            'line'    => $e->getLine(),
            'code'    => $e->getCode(),
            'trace'   => array_slice($e->getTrace(), 0, 5),
            'job'     => static::class,
            'payload' => $this->payload ?? null,
        ], JSON_THROW_ON_ERROR);

        $pulse->handle(
            'Erro ao processar requestDocumentAndPhoto',
            $context,
            'error'
        );
    }
}
