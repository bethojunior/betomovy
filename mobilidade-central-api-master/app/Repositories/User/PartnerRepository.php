<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 03/07/2019
 * Time: 11:29
 */

namespace App\Repositories\User;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\User\Partner;

class PartnerRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(Partner::class);
    }

    public function findByUser($userId)
    {
        return $this->getModel()
            ::where('userId', $userId)
            ->where('statusId', StatusConst::ACTIVE)
            ->first();
    }
}
