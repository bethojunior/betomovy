<?php

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 30/09/2019
 * Time: 16:13
 */

namespace App\Services\DataImport;

use App\Constants\Import\ImportTypeConst;
use App\Models\Import\Import;
use App\Models\User\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImportCustomerService
{
    /** @var ImportProcessService */
    private $processService;

    public function __construct(ImportProcessService $processService)
    {
        $this->processService = $processService;
    }

    public function import(UploadedFile $file, User $user, int $cityId)
    {
        $import = Import::create(['importTypeId' => ImportTypeConst::CUSTOMER]);

        $localRelativePath = $this->storeLocal($file);
        $localAbsolutePath = Storage::disk('local')->path($localRelativePath);

        try {
            $this->backupToCloud($file, $localRelativePath);
            $this->processService->process($import, $localAbsolutePath, $user, null, $cityId);
        } finally {
            Storage::disk('local')->delete($localRelativePath);
        }

        return true;
    }

    private function storeLocal(UploadedFile $file): string
    {
        $extension = $file->getClientOriginalExtension() ?: 'xlsx';
        $relativePath = 'imports/' . Str::uuid()->toString() . '.' . $extension;

        Storage::disk('local')->put($relativePath, file_get_contents($file->getRealPath()));

        return $relativePath;
    }

    private function backupToCloud(UploadedFile $file, string $localRelativePath): void
    {
        try {
            Storage::cloud()->putFileAs(
                'import',
                $file,
                basename($localRelativePath)
            );
        } catch (\Throwable $e) {
            Log::warning('Falha ao enviar backup da importação para o cloud storage', [
                'message' => $e->getMessage(),
            ]);
        }
    }
}
