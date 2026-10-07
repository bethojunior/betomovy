<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/08/2020
 * Time: 17:23
 */

namespace Delivery\Repositories\Order;


use App\Contracts\Repository\AbstractRepository;
use Delivery\Models\Order\DeliveryOrderMessage;
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

    public function findByDeliveryOrder(int $deliveryOrderId, $type)
    {
        return $this->getModel()
            ::where('deliveryOrderId', $deliveryOrderId)
            ->orderByDesc('created_at')
            ->with([
                'company' => function (BelongsTo $query) {
                    $query
                        ->select(
                            'id',
                            'fantasyName',
                            'phone'
                        );
                }
            ])
            ->where('type',$type)
            ->get();
    }
}
