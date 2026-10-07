<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 28/07/2020
 * Time: 15:51
 */

namespace App\Repositories\ExternalService;


use App\Contracts\Repository\AbstractRepository;
use App\Models\ExternalService\ExternalServiceAction;

class ExternalServiceActionRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(ExternalServiceAction::class);
    }
}
