<?php

namespace app\services;

use app\constant\PendencyFieldStatusConst;
use app\dao\PendencyFieldDao;
use app\dao\PendencyFieldTypeDao;
use app\model\PendencyField;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/12/2019
 * Time: 18:47
 */
class PendencyFieldService
{
    private $dao;
    /**
     * @var PendencyFieldTypeDao
     */
    private $pendencyFieldTypeDao;

    public function __construct()
    {
        $this->dao = new PendencyFieldDao;
        $this->pendencyFieldTypeDao = new PendencyFieldTypeDao;
    }

    public function findByUser($userId)
    {
        return $this->dao
            ->findByUser($userId);
    }

    public function createByCustomerRegister($userId)
    {
        $pendencyFields = $this->pendencyFieldTypeDao
            ->findInitPending();

        $userPendencyFields = [];

        foreach ($pendencyFields as $pendencyField) {
            $userPendencyField = new PendencyField;
            $userPendencyField
                ->setUserId($userId)
                ->setPendencyFieldTypeId($pendencyField->id)
                ->setPendencyFieldStatusId(PendencyFieldStatusConst::IN_ANALYSIS);

            $userPendencyFields[] = $userPendencyField;
        }

        if (!empty($userPendencyFields))
            $this->dao
                ->sqlInsertMany($userPendencyFields);

        return true;
    }
}