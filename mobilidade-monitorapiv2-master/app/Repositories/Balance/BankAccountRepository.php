<?php

namespace App\Repositories\Balance;

use Illuminate\Support\Facades\DB;

// bankAccount não tem created_at/updated_at, por isso a escrita é via query builder
class BankAccountRepository
{
    private const TABLE = 'bankAccount';

    public function create(array $data): int
    {
        return (int) DB::table(self::TABLE)->insertGetId(array_merge($data, ['date' => now()]));
    }

    public function update(int $bankAccountId, array $data): void
    {
        DB::table(self::TABLE)
            ->where('idBankAccount', $bankAccountId)
            ->update($data);
    }
}
