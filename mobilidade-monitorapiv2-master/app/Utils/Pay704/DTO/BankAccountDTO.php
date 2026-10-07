<?php

namespace App\Utils\Pay704\DTO;

use App\Contracts\DTO\AbstractDTO;

class BankAccountDTO extends AbstractDTO
{
    public int $bankAccountTypeId;
    public string $bankCode;
    public string $agency;
    public string $account;
    public string $digitAccount;
    public int $holderTypeId;

    public function __construct(
        int $bankAccountTypeId,
        string $bankCode,
        string $agency,
        string $account,
        string $digitAccount,
        int $holderTypeId
    ) {
        $this->bankAccountTypeId = $bankAccountTypeId;
        $this->bankCode = $bankCode;
        $this->agency = $agency;
        $this->account = $account;
        $this->digitAccount = $digitAccount;
        $this->holderTypeId = $holderTypeId;
    }
}
