<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 30/10/2019
 * Time: 17:24
 */

namespace App\Repositories\Enum;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Enum\Gender;

class GenderRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(Gender::class);
    }
}
