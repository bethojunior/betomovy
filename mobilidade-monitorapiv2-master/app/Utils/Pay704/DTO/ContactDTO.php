<?php

namespace App\Utils\Pay704\DTO;

use App\Contracts\DTO\AbstractDTO;

class ContactDTO extends AbstractDTO
{
    public string $name;
    public string $email;
    public string $mobile;

    public function __construct(string $name, string $email, string $mobile)
    {
        $this->name = $name;
        $this->email = $email;
        $this->mobile = $mobile;
    }
}
