<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/06/2020
 * Time: 14:05
 */

namespace Delivery\Repositories\User;


use App\Contracts\Repository\AbstractRepository;
use Delivery\Models\User\Customer;

class CustomerRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(Customer::class);
    }

    public function findByUser(int $userId)
    {
        return $this->getModel()
            ::where('userId', $userId)
            ->join('user', 'userId', '=', 'idUser')
            ->select(
                'customerRegisterStatusId',
                'user.deviceToken AS device_token',
                'user.document',
                'user.email',
                'idCustomer',
                'idUser',
                'user.name AS nameUser',
                'user.nickname',
                'user.phone',
                'customer.profileImage'
            )
            ->selectRaw('
                CONCAT(
                    (
                        SELECT
                            config.value
                        FROM config
                            WHERE config.`key` = \'link_storage_pictures\'
                    ), \'customer/profile/compressed/\', customer.profileImage
                  ) AS profileImageLink
            ')
            ->first();
    }
}
