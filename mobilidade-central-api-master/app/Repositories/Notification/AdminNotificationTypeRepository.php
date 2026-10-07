<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 01/07/2020
 * Time: 19:02
 */

namespace App\Repositories\Notification;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Notification\AdminNotificationType;

class AdminNotificationTypeRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(AdminNotificationType::class);
    }
}
