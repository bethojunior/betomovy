<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 29/01/2020
 * Time: 11:07
 */

namespace App\Repositories\Config\FormStep;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Config\FormStep\FormStep;

class FormStepRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(FormStep::class);
    }

    public function findAll()
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->where('showable', true)
            ->get();
    }
}
