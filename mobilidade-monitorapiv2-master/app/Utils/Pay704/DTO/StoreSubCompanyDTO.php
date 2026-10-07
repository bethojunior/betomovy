<?php

namespace App\Utils\Pay704\DTO;

use App\Contracts\DTO\AbstractDTO;

class StoreSubCompanyDTO extends AbstractDTO
{
    public string $commercialName;
    public int $type;
    public string $typeClass = 'SSTO'; // SubLoja
    public string $socialReason;
    public string $documentNumber;
    public int $cnaeId;
    public string $foundationDate;
    public bool $automaticAntecipation = true;
    public int $companyFormationCode;
    public bool $registerAcquirer = true;
    public RepresentativeDTO $representative;
    public AddressDTO $address;
    public ContactDTO $contact;
    public BankAccountDTO $bankAccount;

    public function __construct(
        string $commercialName,
        int $type,
        string $socialReason,
        string $documentNumber,
        int $cnaeId,
        string $foundationDate,
        int $companyFormationCode,
        RepresentativeDTO $representative,
        AddressDTO $address,
        ContactDTO $contact,
        BankAccountDTO $bankAccount
    ) {
        $this->commercialName       = $commercialName;
        $this->type                 = $type;
        $this->socialReason         = $socialReason;
        $this->documentNumber       = $documentNumber;
        $this->cnaeId               = $cnaeId;
        $this->foundationDate       = $foundationDate;
        $this->companyFormationCode = $companyFormationCode;
        $this->representative       = $representative;
        $this->address              = $address;
        $this->contact              = $contact;
        $this->bankAccount          = $bankAccount;
    }
}
