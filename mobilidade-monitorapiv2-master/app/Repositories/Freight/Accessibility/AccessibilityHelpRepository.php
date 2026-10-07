<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 27/09/2019
 * Time: 10:33
 */

namespace App\Repositories\Freight\Accessibility;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Freight\AccessibilityHelp;

class AccessibilityHelpRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(AccessibilityHelp::class);
    }

    public function findAll()
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->get();
    }
}
