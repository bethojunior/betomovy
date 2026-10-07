<?php

namespace App\Services\DataImport;

use App\Constants\Import\ImportTypeConst;
use App\Constants\Notification\AdminNotificationTypeConst;
use App\Imports\CustomersImport;
use App\Imports\DriversImport;
use App\Models\Import\Import;
use App\Models\Notification\AdminNotification;
use App\Models\User\User;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;

class ImportProcessService
{
    public function process(
        Import $import,
        string $localAbsolutePath,
        User $user,
        ?int $userTypeId = null,
        ?int $cityId = null
    ): void {
        set_time_limit(0);
        ini_set('memory_limit', '512M');

        if (!is_file($localAbsolutePath)) {
            throw new \RuntimeException("Arquivo de importação não encontrado: {$localAbsolutePath}");
        }

        switch ((int) $import->importTypeId) {
            case ImportTypeConst::CUSTOMER:
                if (!$cityId) {
                    throw new \RuntimeException('cityId é obrigatório para importação de clientes');
                }
                Excel::import(new CustomersImport($import, $cityId), $localAbsolutePath);
                break;
            case ImportTypeConst::DRIVER:
                if (!$userTypeId || !$cityId) {
                    throw new \RuntimeException('userTypeId e cityId são obrigatórios para importação de motoristas');
                }
                Excel::import(new DriversImport($import, $userTypeId, $cityId), $localAbsolutePath);
                break;
            default:
                throw new \RuntimeException("Tipo de importação não suportado: {$import->importTypeId}");
        }

        $import->refresh();
        $import->status = 'finished';
        $import->save();

        AdminNotification::create([
            'userId' => $user->idUser,
            'adminNotificationTypeId' => AdminNotificationTypeConst::IMPORT_COMPLETED,
            'message' => sprintf(
                '%d linhas com sucesso e %d linhas com falha',
                (int) $import->successRow,
                (int) $import->failedRow
            ),
            'title' => 'IMPORTAÇÃO FINALIZADA',
        ]);

        Log::info('ImportProcessService finalizado', [
            'importId' => $import->id,
            'successRow' => $import->successRow,
            'failedRow' => $import->failedRow,
        ]);
    }
}
