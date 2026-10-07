<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 29/01/2020
 * Time: 12:01
 */

namespace App\Repositories\Config\FormStep;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Config\FormStep\FormStepUserType;

class FormStepUserTypeRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(FormStepUserType::class);
    }

    public function findByUserType($userTypeId)
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->where('userTypeId', $userTypeId)
            ->with('formStep')
            ->get();
    }
}
