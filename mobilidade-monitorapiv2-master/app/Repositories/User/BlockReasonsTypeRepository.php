<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 09/06/2020
 * Time: 09:23
 */

namespace App\Repositories\User;


use App\Contracts\Repository\AbstractRepository;
use App\Models\User\Driver\BlockReasonsType;

class BlockReasonsTypeRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(BlockReasonsType::class);
    }
}
