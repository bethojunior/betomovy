<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 22/04/2020
 * Time: 17:10
 */

namespace App\Repositories\User;


use Common\Contracts\Repository\AbstractRepository;
use App\Models\User;

class UserRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(User::class);
    }

    public function findForAuth($email)
    {
        return $this->getModel()
            ::where('email', $email)
            ->where('statusId', 1)
            ->whereHas('companyWorker', function ($query) {
                $query
                    ->join("companyDeliveryConfig as cDC", "companyWorker.companyId", 'cDC.companyId')
                    ->join("company", "company.id", "companyWorker.companyId")
                    ->where('companyWorker.statusId', 1)
                    ->where("company.statusId", 1);
            })
            ->with(['companyWorker' => function ($query) {
                return $query
                    ->with(['company' => function ($query) {
                        $query->with('companyDeliveryConfig');
                    }])
                    ->where('statusId', 1);
            }])
            ->first();
    }

    public function findByIdForAuth(int $id)
    {
        return $this->getModel()
            ::where('idUser', $id)
            ->where('statusId', 1)
            ->whereHas('companyWorker', function ($query) {
                $query->where('statusId', 1);
            })
            ->first();
    }

    public function findByEmail($email)
    {
        return $this->getModel()
            ::where('email', $email)
            ->where('statusId',1)
            ->exists();
    }
}
