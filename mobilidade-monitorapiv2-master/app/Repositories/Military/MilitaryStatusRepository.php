<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 05/03/2020
 * Time: 10:57
 */

namespace App\Repositories\Military;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Military\MilitaryStatus;

class MilitaryStatusRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(MilitaryStatus::class);
    }
}
