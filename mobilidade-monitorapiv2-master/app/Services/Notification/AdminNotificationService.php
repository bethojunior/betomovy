<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 19/11/2019
 * Time: 10:10
 */

namespace App\Services\Notification;

use App\Constants\Notification\AdminNotificationTypeConst;
use App\Models\Config\Config;
use App\Models\Notification\AdminNotification;
use App\Models\Notification\AdminNotificationType;
use App\Models\User\User;
use App\Repositories\Notification\AdminNotificationRepository;
use App\Repositories\Notification\AdminNotificationViewsRepository;
use App\Repositories\Role\UserGroupRepository;

class AdminNotificationService
{
    /**
     * @var UserGroupRepository
     */
    private $userGroupRepository;
    /**
     * @var AdminNotificationRepository
     */
    private $repository;
    /**
     * @var AdminNotificationViewsRepository
     */
    private $viewsRepository;

    public function __construct(UserGroupRepository $userGroupRepository,
                                AdminNotificationRepository $repository,
                                AdminNotificationViewsRepository $viewsRepository)
    {
        $this->userGroupRepository = $userGroupRepository;
        $this->repository = $repository;
        $this->viewsRepository = $viewsRepository;
    }

    public function findAll(User $user, array $request = [])
    {
        $result = $this->repository
            ->findAll($user, $request);

        return $result->isEmpty() ? null : $result;
    }

    public function findLast($cityId)
    {
        $result = $this->userGroupRepository
            ->findWithLastNotificationsNotRead();

        $result = $result->isEmpty() ? null : $result;

        $key = Config::getConf('enable_button_panic_by_city');

        if(!$key || !$cityId) {
            return $result;
        };

        $filter = [];
        $driverNotifications = null;
        foreach ($result as $notification) {
            if($notification->name === 'motorista') {
                $driverNotifications = $notification->adminNotifications;
            }
        }
        if($driverNotifications === null) {
            return $result;
        }
        collect($driverNotifications)->map(function ($item) use (&$filter, $cityId) {
            if (
                $item->adminNotificationTypeId == AdminNotificationTypeConst::PANIC_BUTTON &&
                $item->cityId == $cityId
            ) {
                $filter[] = $item;
            }
            if (
                $item->adminNotificationTypeId != AdminNotificationTypeConst::PANIC_BUTTON
            ) {
                $filter[] = $item;
            }
        });

        foreach ($result as $key => $notification) {
            if($notification->name === 'motorista') {
                unset($result[$key]['adminNotifications']);
                $result[$key]['admin_notifications'] = $filter;
            }
        }

        return $result;
    }

    public function toView($adminNotificationId, User $user)
    {
        $params = [
            'adminNotificationId' => $adminNotificationId,
            'userId' => $user->idUser
        ];

        $view = $this->viewsRepository
            ->firstOrCreate($params);

        return $view;
    }

    public function markRead(AdminNotification $adminNotification, User $user)
    {
        $adminNotification
            ->read = true;
        $adminNotification
            ->readById = $user->idUser;

        $this->repository
            ->save($adminNotification);

        return $adminNotification;
    }

    /**
     * @param User $user
     * @return bool|int
     */
    public function clearingNotification(User $user)
    {
        return $this->repository
                ->clearingNotification($user->idUser);
    }

    /**
     * @param User $user
     * @return bool|int
     */
    public function markAllAsRead(User $user)
    {
        return $this->repository
                ->clearingNotification($user->idUser);
    }
}

