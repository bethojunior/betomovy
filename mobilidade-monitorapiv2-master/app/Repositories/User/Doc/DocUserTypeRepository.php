<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 24/01/2020
 * Time: 15:52
 */

namespace App\Repositories\User\Doc;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\User\Doc\DocUserType;

class DocUserTypeRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(DocUserType::class);
    }

    public function findByUserType($userTypeId)
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->where('userTypeId', $userTypeId)
            ->whereHas('doc', function ($query) {
                $query
                    ->where('statusId', StatusConst::ACTIVE);
            })
            ->with(['doc', 'userType'])
            ->get();
    }

    public function deleteManyByUserType($userTypeId)
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->where('userTypeId', $userTypeId)
            ->update(['statusId' => StatusConst::REMOVED]);
    }
}
