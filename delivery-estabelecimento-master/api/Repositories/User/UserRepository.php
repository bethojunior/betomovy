<?php


namespace Api\Repositories\User;


use Common\Contracts\Repository\AbstractRepository;
use Common\Models\User;

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
                $query->where('statusId', 1);
            })
            ->with([
                'companyWorker' => function ($query) {
                    $query
                        ->where('statusId', 1)
                        ->with('company');
                }
            ])

            ->first();
    }
}
