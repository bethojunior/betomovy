<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 26/09/2019
 * Time: 17:38
 */

namespace App\Repositories\User;


use App\Constants\Users\UserTypeConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\User\RequiredField;

class RequiredFieldRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(RequiredField::class);
    }

    public function findByUserType($userTypeId)
    {
        return $this->getModel()
            ::where('userTypeId', $userTypeId)
            ->get();
    }

    public function getTypeConfirmationCodeCustomer()
    {
        return $this->getModel()
            ::where('userTypeId', UserTypeConst::CUSTOMER)
            ->whereRaw('(field = ? OR field = ?) ',['validateEmail','validateSms'])
            ->get();
    }
}
