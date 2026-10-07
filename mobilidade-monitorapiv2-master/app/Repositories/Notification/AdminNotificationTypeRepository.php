<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 30/04/2020
 * Time: 17:28
 */

namespace App\Repositories\Notification;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Notification\AdminNotificationType;

class AdminNotificationTypeRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(AdminNotificationType::class);
    }
}
