<?php

namespace App\Imports;

use App\Constants\StatusConst;
use App\Constants\Users\CustomerConst;
use App\Constants\Users\CustomerRegisterStatusConst;
use App\Constants\Users\UserTypeConst;
use App\Exceptions\Import\ImportException;
use App\Models\Balance\Balance;
use App\Models\Config\Config;
use App\Models\Import\Import;
use App\Models\User\Customer;
use App\Models\User\LevelAccess;
use App\Models\User\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Row;

class CustomersImport implements OnEachRow, WithHeadingRow
{
    /** @var Import */
    private $import;

    /** @var int */
    private $cityId;

    /** @var string|null */
    private $passwordDefault;

    public function __construct(Import $import, int $cityId)
    {
        $this->import = $import;
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

            $user = new User();
            $user->name = trim((string) $row['nome']);
            $user->email = trim((string) $row['email']);
            $user->phone = $this->formatPhone($row['telefone'] ?? null);
            $user->password = base64_encode($this->passwordDefault);
            $user->document = $this->formatDocument($row['cpf'] ?? null);
            $user->isImport = true;
            $user->importDate = now();
            $user->statusId = StatusConst::ACTIVE;
            $user->cityId = $this->cityId;
            $user->save();

            $levelAccess = new LevelAccess();
            $levelAccess->userTypeId = UserTypeConst::CUSTOMER;
            $levelAccess->userId = $user->idUser;
            $levelAccess->save();

            $customer = new Customer();
            $customer->userId = $user->idUser;
            $customer->balanceId = $balance->idBalance;
            $customer->customerRegisterStatusId = CustomerRegisterStatusConst::ACTIVE;
            $customer->profileImage = CustomerConst::DEFAULT_PROFILE_IMAGE;
            $customer->save();

            DB::commit();
            $this->import->increment('successRow');
        } catch (\Throwable $e) {
            Log::error('Erro na linha de importacao de cliente: ' . $e->getMessage(), [
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
            ->whereHas('userType', function ($query) {
                $query->where('userTypeId', UserTypeConst::CUSTOMER);
            })
            ->exists();

        if ($userExists) {
            throw new ImportException('Email já está cadastrado: ' . $row['email']);
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
