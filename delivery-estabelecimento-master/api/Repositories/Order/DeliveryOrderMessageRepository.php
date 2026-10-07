<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 03/08/2020
 * Time: 15:48
 */

namespace Api\Repositories\Order;


use Common\Contracts\Repository\AbstractRepository;
use Common\Models\Order\DeliveryOrderMessage;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeliveryOrderMessageRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(DeliveryOrderMessage::class);
    }

    public function findByDeliveryOrder(int $deliveryOrderId)
    {
        return $this->getModel()
            ::where('deliveryOrderId', $deliveryOrderId)
            ->orderByDesc('created_at')
            ->with([
                'customer' => function (BelongsTo $query) {
                    $query
                        ->select(
                            'idUser',
                            'name',
                            'phone'
                        );
                }
            ])
            ->where("type", "company")
            ->get();
    }
}
