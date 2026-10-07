<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 24/01/2020
 * Time: 13:22
 */

namespace App\Repositories\User\Doc;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\User\Doc\Doc;

class DocRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(Doc::class);
    }

    public function findAll()
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->get();
    }
}
