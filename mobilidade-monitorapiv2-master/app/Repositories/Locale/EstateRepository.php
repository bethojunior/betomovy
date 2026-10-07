<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/06/2019
 * Time: 18:28
 */

namespace App\Repositories\Locale;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Locale\Estate;

class EstateRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(Estate::class);
    }
}
