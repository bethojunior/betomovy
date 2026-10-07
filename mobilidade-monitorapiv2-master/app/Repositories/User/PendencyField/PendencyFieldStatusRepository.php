<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/12/2019
 * Time: 18:00
 */

namespace App\Repositories\User\PendencyField;


use App\Contracts\Repository\AbstractRepository;
use App\Models\User\PendencyField\PendencyFieldStatus;

class PendencyFieldStatusRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(PendencyFieldStatus::class);
    }
}
