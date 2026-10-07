<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 19/11/2019
 * Time: 12:07
 */

namespace App\Repositories\Notification;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Notification\AdminNotificationViews;

class AdminNotificationViewsRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(AdminNotificationViews::class);
    }
}
