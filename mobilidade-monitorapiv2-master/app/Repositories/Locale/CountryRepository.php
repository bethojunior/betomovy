<?php


namespace App\Repositories\Locale;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Locale\Country;

class CountryRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(Country::class);
    }

    public function findAll()
    {
        return $this->getModel()::where('statusId', '<>', 2)->get();
    }
}
