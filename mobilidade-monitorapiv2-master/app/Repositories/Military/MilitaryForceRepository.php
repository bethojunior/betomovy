<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 05/03/2020
 * Time: 10:38
 */

namespace App\Repositories\Military;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Military\MilitaryForce;

class MilitaryForceRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(MilitaryForce::class);
    }
}
