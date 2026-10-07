<?php

namespace App\Jobs;

use App\Models\Import\Import;
use App\Models\User\User;
use App\Services\DataImport\ImportProcessService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

/**
 * Mantido para drenar jobs antigos ainda na fila Redis.
 * Novas importações NÃO enfileiram — rodam sync via ImportProcessService.
 */
class ProcessImport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 600;
    public int $tries = 1;

    /** @var Import */
    private $import;

    /** @var string */
    private $fileName;

    /** @var User */
    private $user;

    /** @var int|null */
    private $userTypeId;

    /** @var int|null */
    private $cityId;

    public function __construct(Import $import, string $fileName, User $user, int $userTypeId = null, int $cityId = null)
    {
        $this->import = $import;
        $this->fileName = $fileName;
        $this->user = $user;
        $this->userTypeId = $userTypeId;
        $this->cityId = $cityId;
    }

    public function handle(ImportProcessService $processService)
    {
        $localRelativePath = null;

        try {
            if (Storage::disk('local')->exists($this->fileName)) {
                $localAbsolutePath = Storage::disk('local')->path($this->fileName);
            } elseif (Storage::cloud()->exists($this->fileName)) {
                $contents = Storage::cloud()->get($this->fileName);
                $localRelativePath = 'imports/' . ltrim($this->fileName, '/');
                Storage::disk('local')->put($localRelativePath, $contents);
                $localAbsolutePath = Storage::disk('local')->path($localRelativePath);
            } else {
                throw new \RuntimeException("Arquivo de importação não encontrado: {$this->fileName}");
            }

            $processService->process(
                $this->import,
                $localAbsolutePath,
                $this->user,
                $this->userTypeId,
                $this->cityId
            );
        } finally {
            if ($localRelativePath) {
                Storage::disk('local')->delete($localRelativePath);
            }
        }
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('ProcessImport falhou', [
            'importId' => $this->import->id ?? null,
            'fileName' => $this->fileName ?? null,
            'message' => $exception->getMessage(),
        ]);
    }
}
