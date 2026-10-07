<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/12/2019
 * Time: 17:58
 */

namespace App\Repositories\User\PendencyField;


use App\Contracts\Repository\AbstractRepository;
use App\Models\User\PendencyField\PendencyFieldType;

class PendencyFieldTypeRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(PendencyFieldType::class);
    }
}
