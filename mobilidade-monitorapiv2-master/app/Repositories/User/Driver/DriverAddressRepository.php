<?php

namespace App\Repositories\User\Driver;

use App\Contracts\Repository\AbstractRepository;
use App\Models\Driver\DriverAddress;

class DriverAddressRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(DriverAddress::class);
    }

    public function updateOrCreate(array $attributes, array $values): DriverAddress
    {
        /** @var DriverAddress $result */
        $result = $this->getQuery()
            ->updateOrCreate($attributes, $values);

        return $result;
    }
}
