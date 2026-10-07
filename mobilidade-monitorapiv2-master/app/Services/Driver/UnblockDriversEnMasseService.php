<?php

namespace App\Services\Driver;

use App\Repositories\User\UserRepository;

class UnblockDriversEnMasseService
{
    private $userRepository;

    public function __construct(
        UserRepository $userRepository
    ){
        $this->userRepository = $userRepository;
    }

    public function handle($file, $blockReasonsTypeIds = [])
    {
        try {
            if (!$file || !$file->isValid()) {
                throw new \Exception("Arquivo inválido ou corrompido");
            }

            $fileName = 'unblock_drivers_' . time() . '_' . uniqid() . '.xlsx';
            $filePath = $file->storeAs('temp', $fileName);

            if (!$filePath) {
                throw new \Exception("Erro ao salvar arquivo temporário");
            }

            \App\Jobs\Driver\UnblockDriversFromXlsJob::dispatchNow(
                $filePath,
                $this->userRepository ?? null,
                $this,
                auth()->id()
            );

            return [
                'success' => true,
                'message' => 'Arquivo processado com sucesso.',
                'job_queued' => false,
                'file_name' => $fileName
            ];

        } catch (\Exception $e) {
            throw new \Exception("Erro ao processar arquivo: " . $e->getMessage());
        }
    }
}
