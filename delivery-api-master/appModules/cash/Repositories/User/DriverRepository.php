<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/07/2020
 * Time: 17:36
 */

namespace Cash\Repositories\User;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Driver\Driver;

class DriverRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(Driver::class);
    }

    public function findByUser(int $userId)
    {
        return $this->getModel()
            ::where('userId', $userId)
            ->first();
    }
}
