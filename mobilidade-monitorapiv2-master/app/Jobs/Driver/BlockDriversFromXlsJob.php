<?php

namespace App\Jobs\Driver;

use App\Constants\StatusConst;
use App\Models\Driver\BlockReasons;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Constants\Users\DriverConst;
use App\Constants\Users\DriverRegisterStatusConst;
use App\Models\User\Driver;
use App\Models\User\User;
use App\Models\Notification\AdminNotification;

class BlockDriversFromXlsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $filePath;
    protected $userRepository;
    protected $notificationService;
    protected $userId;

    public function __construct($filePath, $userRepository = null, $notificationService = null, $userId = null)
    {
        $this->filePath = $filePath;
        $this->userRepository = $userRepository;
        $this->notificationService = $notificationService;
        $this->userId = $userId ?? auth()->id();
    }

    public function handle()
    {
        try {
            $fullPath = storage_path('app/' . $this->filePath);

            if (!file_exists($fullPath)) {
                throw new \Exception("Arquivo não encontrado: {$fullPath}");
            }

            $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($fullPath);
            $worksheet = $spreadsheet->getActiveSheet();
            $rows = $worksheet->toArray();

            Log::info("Arquivo carregado com " . count($rows) . " linhas");

            $processedDrivers = [];
            $errors = [];

            if (count($rows) > 0 && !is_numeric($rows[0][0])) {
                Log::info("Removendo cabeçalho da primeira linha");
                array_shift($rows);
                Log::info("Após remoção do cabeçalho: " . count($rows) . " linhas");
            }

            $totalRows = count($rows);
            Log::info("Iniciando processamento de {$totalRows} CPFs para bloqueio");

            Log::info("Primeiras 5 linhas do arquivo:");
            for ($i = 0; $i < min(5, count($rows)); $i++) {
                Log::info("  Linha " . ($i + 1) . ": " . json_encode($rows[$i]));
            }

            $processedCpfs = [];
            $uniqueRows = [];

            foreach ($rows as $index => $row) {
                $cpfOriginal = trim($row[0] ?? '');
                if (!empty($cpfOriginal)) {
                    $cpfLimpo = preg_replace('/\D/', '', $cpfOriginal);
                    if (!in_array($cpfLimpo, $processedCpfs)) {
                        $processedCpfs[] = $cpfLimpo;
                        $uniqueRows[] = $row;
                    } else {
                        Log::info("CPF duplicado no arquivo ignorado: {$cpfOriginal} (linha " . ($index + 1) . ")");
                    }
                }
            }

            $rows = $uniqueRows;
            Log::info("Após remoção de duplicatas: " . count($rows) . " CPFs únicos para processar");

            foreach ($rows as $index => $row) {
                $cpfOriginal = trim($row[0] ?? '');

                Log::info("Processando linha " . ($index + 1) . ": CPF original = '{$cpfOriginal}'");

                if (empty($cpfOriginal)) {
                    Log::info("Linha " . ($index + 1) . ": CPF vazio, pulando...");
                    continue;
                }

                $cpfLimpo = preg_replace('/\D/', '', $cpfOriginal);
                Log::info("Linha " . ($index + 1) . ": CPF limpo = '{$cpfLimpo}'");

                $users = User::whereRaw("REPLACE(REPLACE(REPLACE(document, '.', ''), '-', ''), ' ', '') LIKE ?", ['%' . $cpfLimpo . '%'])->get();
                Log::info("Linha " . ($index + 1) . ": Encontrados {$users->count()} usuários para CPF {$cpfLimpo}");

                if ($users->isEmpty()) {
                    $errors[] = "Linha " . ($index + 1) . ": User não encontrado para CPF - {$cpfOriginal} (limpo: {$cpfLimpo})";
                    Log::info("Linha " . ($index + 1) . ": Nenhum usuário encontrado para CPF {$cpfLimpo}");
                    continue;
                }

                if ($users->count() > 1) {
                    Log::info("Linha " . ($index + 1) . ": CPF duplicado no banco - {$users->count()} registros encontrados, processando todos");
                }

                $processedCount = 0;
                $errorCount = 0;

                foreach ($users as $user) {
                    Log::info("Linha " . ($index + 1) . ": Processando usuário - ID: {$user->idUser}, Nome: {$user->name}");

                    $driver = $user->driver;

                    if (!$driver) {
                        $errorMsg = "Linha " . ($index + 1) . ": Driver não encontrado para User CPF - {$cpfOriginal} (limpo: {$cpfLimpo}) - Usuário ID: {$user->idUser}";
                        $errors[] = $errorMsg;
                        Log::info("Linha " . ($index + 1) . ": Usuário {$user->idUser} não possui driver associado");
                        $errorCount++;
                        continue;
                    }

                    Log::info("Linha " . ($index + 1) . ": Driver encontrado - ID: {$driver->idDriver}, Status: {$driver->status}, RegisterStatus: {$driver->driverRegisterStatusId}");

                    if ($driver->driverRegisterStatusId == DriverRegisterStatusConst::BLOCKED) {
                        Log::info("Linha " . ($index + 1) . ": Driver {$driver->idDriver} já está bloqueado, forçando novo bloqueio");
                    }

                    try {
                        $this->blockDriver($driver);
                        $processedDrivers[] = [
                            'id' => $driver->idDriver,
                            'cpf' => $cpfLimpo,
                            'cpf_original' => $cpfOriginal,
                            'name' => $user->name ?? 'N/A',
                            'user_id' => $user->idUser
                        ];

                        Log::info("Driver bloqueado com sucesso: CPF {$cpfOriginal} (limpo: {$cpfLimpo}) - Driver ID: {$driver->idDriver}");
                        $processedCount++;

                    } catch (\Exception $e) {
                        $error = "Linha " . ($index + 1) . ": Erro ao bloquear driver CPF {$cpfOriginal} (limpo: {$cpfLimpo}) - Driver ID: {$driver->idDriver} - " . $e->getMessage();
                        $errors[] = $error;
                        Log::error($error);
                        $errorCount++;
                    }
                }

                if ($users->count() > 1) {
                    Log::info("Linha " . ($index + 1) . ": Processamento concluído para CPF {$cpfLimpo} - {$processedCount} bloqueados, {$errorCount} erros");
                }
            }

            Log::info("Processamento concluído: " . count($processedDrivers) . " drivers bloqueados, " . count($errors) . " erros");

            if (count($errors) > 0) {
                Log::info("Erros encontrados:");
                foreach ($errors as $error) {
                    Log::info("  - " . $error);
                }
            }

            if (count($processedDrivers) > 0) {
                Log::info("Drivers processados com sucesso:");
                foreach ($processedDrivers as $driver) {
                    Log::info("  - ID: {$driver['id']}, CPF: {$driver['cpf']}, Nome: {$driver['name']}");
                }
            }

            Storage::delete($this->filePath);

            $this->notifyCompletion($processedDrivers, $errors);

        } catch (\Exception $e) {
            Log::error("Erro no job de bloqueio de drivers: " . $e->getMessage());
            Storage::delete($this->filePath);
            throw $e;
        }
    }

    private function blockDriver(Driver $driver, $blockReasonsTypeIds = [])
    {
        Log::info("Iniciando bloqueio do driver ID: {$driver->idDriver}");

        try {
            $existingBlockReason = BlockReasons::where('driverId', $driver->idDriver)
                ->where('blockReasonsTypeId', 2)
                ->where('statusId', StatusConst::ACTIVE)
                ->first();

            if ($existingBlockReason) {
                Log::info("Driver {$driver->idDriver} já possui motivo de bloqueio ativo: ID {$existingBlockReason->idBlockReasons}");
            } else {
                $blockReason = BlockReasons::create([
                    'blockReasonsTypeId' => 2,
                    'driverId'           => $driver->idDriver,
                    'statusId'           => StatusConst::ACTIVE
                ]);

                Log::info("Motivo de bloqueio criado: ID {$blockReason->idBlockReasons} para driver {$driver->idDriver}");
            }

            Log::info("Forçando atualização do status do driver {$driver->idDriver}");

            $oldStatus = $driver->status;
            $oldRegisterStatus = $driver->driverRegisterStatusId;

            $driver->driverRegisterStatusId = DriverRegisterStatusConst::BLOCKED;
            $driver->status = DriverConst::OFF;

            $saved = $driver->save();

            if (!$saved) {
                throw new \Exception("Falha ao salvar alterações do driver");
            }

            $driver->refresh();

            Log::info("Driver {$driver->idDriver} bloqueado com sucesso. Status anterior: {$oldStatus} -> {$driver->status}, RegisterStatus anterior: {$oldRegisterStatus} -> {$driver->driverRegisterStatusId}");

            if ($driver->driverRegisterStatusId != DriverRegisterStatusConst::BLOCKED || $driver->status != DriverConst::OFF) {
                throw new \Exception("Falha na verificação do bloqueio - RegisterStatus: {$driver->driverRegisterStatusId}, Status: {$driver->status}");
            }

            return $driver;

        } catch (\Exception $e) {
            Log::error("Erro ao bloquear driver {$driver->idDriver}: " . $e->getMessage());
            throw $e;
        }
    }


    private function notifyCompletion($processedDrivers, $errors)
    {
        Log::info("Resultado do processamento em lote:", [
            'processed_count' => count($processedDrivers),
            'errors_count' => count($errors),
            'processed_drivers' => $processedDrivers,
            'errors' => $errors
        ]);

        AdminNotification::create([
            'userId' => $this->userId,
            'adminNotificationTypeId' => 1,
            'message' => "IMPORTAÇÃO DE BLOQUEIO DE PARCEIROS FINALIZADA COM SUCESSO",
            'title' => "IMPORTAÇÃO FINALIZADA"
        ]);
    }

    public function failed(\Throwable $exception)
    {
        Log::error("Job de bloqueio de drivers falhou: " . $exception->getMessage());
        Storage::delete($this->filePath);
    }
}
