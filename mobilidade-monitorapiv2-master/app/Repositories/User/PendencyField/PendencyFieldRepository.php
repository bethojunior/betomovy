<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/12/2019
 * Time: 17:39
 */

namespace App\Repositories\User\PendencyField;


use App\Constants\StatusConst;
use App\Constants\Users\PendencyFieldStatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\User\PendencyField\PendencyField;

class PendencyFieldRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(PendencyField::class);
    }

    public function findByUser($userId)
    {
        return $this->getModel()
            ::where('userId', $userId)
            ->where('statusId', StatusConst::ACTIVE)
            ->with(['pendencyFieldType', 'pendencyFieldStatus'])
            ->get();
    }

    public function findNotApprovedByUser($userId)
    {
        return $this->getModel()
            ::where('userId', $userId)
            ->where('statusId', StatusConst::ACTIVE)
            ->where('pendencyFieldStatusId', '<>', PendencyFieldStatusConst::APPROVED)
            ->with(['pendencyFieldType', 'pendencyFieldStatus'])
            ->get();
    }

    public function findByUserAndPendencyFieldType($userId, $pendencyFieldTypeId)
    {
        return $this->getModel()
            ::where('userId', $userId)
            ->where('statusId', StatusConst::ACTIVE)
            ->where('pendencyFieldTypeId', $pendencyFieldTypeId)
            ->with(['pendencyFieldType', 'pendencyFieldStatus'])
            ->first();
    }

    public function disableAllByUser($userId)
    {
        return $this->getModel()
            ::where('userId', $userId)
            ->where('statusId', StatusConst::ACTIVE)
            ->update(['statusId' => StatusConst::REMOVED]);
    }
}
