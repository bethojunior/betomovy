<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 25/01/2020
 * Time: 13:48
 */

namespace App\Repositories\User\Doc;


use App\Contracts\Repository\AbstractRepository;
use App\Models\User\Doc\DocStatus;

class DocStatusRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(DocStatus::class);
    }
}
