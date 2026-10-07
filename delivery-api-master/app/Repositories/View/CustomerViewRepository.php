<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 23/07/2020
 * Time: 08:39
 */

namespace App\Repositories\View;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Customer\CustomerView;

class CustomerViewRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(CustomerView::class);
    }
}
