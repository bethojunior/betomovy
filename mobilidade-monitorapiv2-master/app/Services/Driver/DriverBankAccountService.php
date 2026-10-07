<?php

namespace App\Services\Driver;

use App\Exceptions\Driver\DriverNotFoundException;
use App\Models\User\Driver;
use App\Repositories\Balance\BankAccountRepository;
use Illuminate\Support\Facades\DB;

class DriverBankAccountService
{
    private const FIELDS = [
        'holderName',
        'document',
        'bankId',
        'typeAccount',
        'agency',
        'agencyDigit',
        'numberAccount',
        'numberAccountDigit',
        'op',
        'pix',
        'pixType',
    ];

    private $repository;

    public function __construct(BankAccountRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Atualiza a conta do motorista; cria e vincula ao usuário se ele ainda não tiver
     * @throws DriverNotFoundException
     */
    public function update(int $driverId, array $data): int
    {
        $driver = Driver::with('user')->find($driverId);
        if (!$driver || !$driver->user) {
            throw new DriverNotFoundException();
        }

        $values = array_intersect_key($data, array_flip(self::FIELDS));

        return DB::transaction(function () use ($driver, $values) {
            $user = $driver->user;

            if ($user->bankAccountId) {
                $this->repository->update((int) $user->bankAccountId, $values);
                return (int) $user->bankAccountId;
            }

            $bankAccountId = $this->repository->create($values);
            $user->bankAccountId = $bankAccountId;
            $user->save();

            return $bankAccountId;
        });
    }
}
