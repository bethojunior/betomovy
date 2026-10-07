<?php


namespace App\Repositories\App;


use App\Contracts\Repository\AbstractRepository;
use App\Models\App\MenuAppType;

class MenuAppTypeRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(MenuAppType::class);
    }
}
