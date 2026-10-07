<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/03/2020
 * Time: 10:36
 */

namespace App\Repositories\Report\Select;


use App\Contracts\Repository\AbstractRepository;
use App\Models\User\Driver\DriverRegisterStatus;

class DriverRegisterStatusSelectRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(DriverRegisterStatus::class);
    }

    public function listBySelect()
    {
        return $this->getModel()
            ::select(
                'idDriverRegisterStatus AS id',
                'name AS text'
            )
            ->get();
    }
}
