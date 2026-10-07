<?php

namespace App\Utils\Pay704\DTO;

use App\Contracts\DTO\AbstractDTO;

class RepresentativeDTO extends AbstractDTO
{
    public string $name;
    public string $email;
    public string $mobile;
    public string $cpf;
    public string $birthDate;

    public function __construct(
        string $name,
        string $email,
        string $mobile,
        string $cpf,
        string $birthDate
    ) {
        $this->name = $name;
        $this->email = $email;
        $this->mobile = $mobile;
        $this->cpf = $cpf;
        $this->birthDate = $birthDate;
    }
}
