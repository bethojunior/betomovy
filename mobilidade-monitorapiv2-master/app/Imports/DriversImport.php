<?php

namespace App\Imports;

use App\Constants\StatusConst;
use App\Exceptions\Import\ImportException;
use App\Models\Balance\Balance;
use App\Models\Config\Config;
use App\Models\Import\Import;
use App\Models\User\Doc\DocUser;
use App\Models\User\Doc\DocUserType;
use App\Models\User\Driver;
use App\Models\User\Driver\Car;
use App\Models\User\LevelAccess;
use App\Models\User\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Row;

class DriversImport implements OnEachRow, WithHeadingRow
{
    /** @var Import */
    private $import;

    /** @var int */
    private $userTypeId;

    /** @var int */
    private $cityId;

    /** @var string|null */
    private $passwordDefault;

    public function __construct(Import $import, int $userTypeId, int $cityId)
    {
        $this->import = $import;
        $this->userTypeId = $userTypeId;
        $this->cityId = $cityId;
        $this->passwordDefault = Config::where('key', 'default_import_password')
            ->pluck('value')
            ->first();
    }

    public function onRow(Row $row)
    {
        $row = $this->normalizeRow($row->toArray());

        try {
            if (empty($this->passwordDefault)) {
                throw new ImportException('Configuração default_import_password não encontrada');
            }

            $this->validateRow($row);

            DB::beginTransaction();

            $balance = Balance::create();

            $name = trim((string) $row['nome']);
            $user = new User();
            $user->name = $name;
            $user->nickname = explode(' ', $name)[0];
            $user->email = trim((string) $row['email']);
            $user->phone = $this->formatPhone($row['telefone'] ?? null);
            $user->document = $this->formatDocument($row['cpf'] ?? null);
            $user->password = base64_encode($this->passwordDefault);
            $user->isImport = true;
            $user->importDate = now();
            $user->statusId = StatusConst::ACTIVE;
            $user->save();

            $levelAccess = new LevelAccess();
            $levelAccess->userId = $user->idUser;
            $levelAccess->userTypeId = $this->userTypeId;
            $levelAccess->save();

            $driver = new Driver();
            $driver->userId = $user->idUser;
            $driver->balanceId = $balance->idBalance;
            $driver->cityId = $this->cityId;
            $driver->cnh = $row['numerocnh'] ?? null;
            $driver->crlv = $row['numerodocveiculo'] ?? null;
            $driver->save();

            $car = new Car();
            $car->driverId = $driver->idDriver;
            $car->renavam = $row['numerorenavam'] ?? null;
            $car->brand = $row['marcaveiculo'] ?? null;
            $car->model = $row['modeloveiculo'] ?? null;
            $car->color = $row['corveiculo'] ?? null;
            $car->plate = $row['placa'] ?? null;
            $car->seatsNumber = $row['numeroassentos'] ?? null;
            $car->year = $row['anofabricacao'] ?? null;
            $car->save();

            $docUserTypes = DocUserType::where('userTypeId', $this->userTypeId)
                ->where('statusId', StatusConst::ACTIVE)
                ->get();

            foreach ($docUserTypes as $docUserType) {
                $docUser = new DocUser();
                $docUser->docId = $docUserType->docId;
                $docUser->userId = $user->idUser;
                $docUser->docStatusId = 3;
                $docUser->statusId = StatusConst::ACTIVE;
                $docUser->save();
            }

            DB::commit();
            $this->import->increment('successRow');
        } catch (\Throwable $e) {
            Log::error('Erro na linha de importacao de motorista: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'row' => $row,
            ]);

            DB::rollBack();
            $this->import->increment('failedRow');
        }
    }

    private function normalizeRow(array $row): array
    {
        $normalized = [];

        foreach ($row as $key => $value) {
            $normalizedKey = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', (string) $key));
            $normalized[$normalizedKey] = $value;
        }

        return $normalized;
    }

    /**
     * @throws ImportException
     */
    private function validateRow(array $row): void
    {
        if (empty($row['nome']) && empty($row['email'])) {
            throw new ImportException('Dados incompletos');
        }

        if (empty($row['email']) || !filter_var($row['email'], FILTER_VALIDATE_EMAIL)) {
            throw new ImportException('Email está inválido');
        }

        if (empty($row['nome'])) {
            throw new ImportException('Nome está inválido');
        }

        $userExists = User::where('email', $row['email'])
            ->where('statusId', StatusConst::ACTIVE)
            ->whereHas('driver')
            ->exists();

        if ($userExists) {
            throw new ImportException('Usuário existe com esse email ' . $row['email']);
        }
    }

    private function formatPhone($phone): ?string
    {
        if ($phone === null || $phone === '') {
            return null;
        }

        return preg_replace('/\D+/', '', (string) $phone);
    }

    private function formatDocument($document): ?string
    {
        if ($document === null || $document === '') {
            return null;
        }

        return preg_replace('/\D+/', '', (string) $document);
    }
}
