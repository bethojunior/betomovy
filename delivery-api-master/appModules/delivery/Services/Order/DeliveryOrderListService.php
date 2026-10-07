<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/07/2020
 * Time: 18:10
 */

namespace Delivery\Services\Order;


use App\Models\User;
use Delivery\Repositories\Order\DeliveryOrderListRepository;

class DeliveryOrderListService
{
    /**
     * @var DeliveryOrderListRepository
     */
    private $repository;

    public function __construct(DeliveryOrderListRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findByDriver(User $user, array $request = [])
    {
        return $this->repository
            ->findByUser($user->driver->idDriver ?? $user->idUser, $request, false);
    }

    public function findByCustomer(User $user, array $request = [])
    {
        return $this->repository
            ->findByUser($user->idUser, $request);
    }
}
