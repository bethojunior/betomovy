<?php

namespace App\Utils\Pay704\DTO;

use App\Contracts\DTO\AbstractDTO;

class AddressDTO extends AbstractDTO
{
    public string $zipcode;
    public string $street;
    public string $number;
    public ?string $complement;
    public string $district;
    public string $city;
    public string $state;

    public function __construct(
        string $zipcode,
        string $street,
        string $number,
        string $district,
        string $city,
        string $state,
        ?string $complement = null
    ) {
        $this->zipcode = $zipcode;
        $this->street = $street;
        $this->number = $number;
        $this->district = $district;
        $this->city = $city;
        $this->state = $state;
        $this->complement = $complement;
    }
}
