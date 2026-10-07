<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 09/04/2020
 * Time: 17:00
 */

namespace App\Repositories\Enum;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Enum\CustomerRegisterStatus;

class CustomerRegisterStatusRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(CustomerRegisterStatus::class);
    }
}
