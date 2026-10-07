<?php


namespace Delivery\Repositories\Driver;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Driver\Driver;
use Illuminate\Database\Eloquent\Model;

class DriverRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(Driver::class);
    }

    public function findByUser(int $idUser)
    {
        return $this->getModel()::where('userId', $idUser)
            ->first();
    }
}
