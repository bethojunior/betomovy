<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 19/11/2019
 * Time: 09:57
 */

namespace App\Repositories\Notification;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Notification\AdminNotification;
use App\Models\User\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AdminNotificationRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(AdminNotification::class);
    }

    public function findAll(User $user, array $queryRequest = [])
    {
        $query = AdminNotification::query()
            ->orderByDesc('created_at')
            // Join trip para pegar cityId da viagem
            ->leftJoin('trip', 'adminNotification.tripReference', '=', 'trip.tripReference')
            // Join city da viagem
            ->leftJoin('city as trip_city', 'trip.cityId', '=', 'trip_city.id')
            // Join city da notificação
            ->leftJoin('city as notification_city', 'adminNotification.cityId', '=', 'notification_city.id')
            ->selectRaw('adminNotification.*, COALESCE(trip_city.nome, notification_city.nome) as notificationCityName');

        if ($user->role->support) {
            $query->where(function (Builder $query) {
                $query->whereNotNull('adminNotification.cityId')
                    ->orWhere('adminNotification.cityId', null);
            });
        } else {
            $query->where(function (Builder $query) use ($user) {
                $query->whereIn('adminNotification.cityId', function ($query) use ($user) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleCity.roleId', $user->roleId);
                });
            });
        }

        $query->when(isset($queryRequest['adminNotificationTypeId']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where('adminNotificationTypeId', '=', $queryRequest['adminNotificationTypeId']);
            })
            ->when(isset($queryRequest['userGroupId']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where('userGroupId', '=', $queryRequest['userGroupId']);
            })
            ->when(isset($queryRequest['userId']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where('userId', '=', $queryRequest['userId']);
            })
            ->when(isset($queryRequest['dateStart']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where(
                        'created_at', '>=', Carbon::parse($queryRequest['dateStart'])->startOfDay());
            })
            ->when(isset($queryRequest['dateEnd']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where('created_at', '<=', Carbon::parse($queryRequest['dateEnd'])->endOfDay());
            })
            ->when((isset($queryRequest['read'])), function (Builder $query) use ($queryRequest) {
                $query
                    ->where('read', '=', $queryRequest['read']);
            });

        return $query
            ->with([
                'user' => function (BelongsTo $query) {
                    $query
                        ->select('idUser', 'user.name', 'user.phone', 'email')
                        ->leftJoin('customer', 'customer.userId', '=', 'idUser')
                        ->leftJoin('driver', 'driver.userId', '=', 'idUser')
                        ->selectRaw(
                            'IFNULL(driver.profileImage, customer.profileImage) AS profileImage');
                },
                'driver' => function (BelongsTo $query) {
                    $query
                        ->select('idDriver', 'userId', 'last_lat', 'last_lon', 'status');
                },
                'views' => function (HasMany $query) use ($user) {
                    $query
                        ->select('id', 'viewed_at', 'adminNotificationId')
                        ->where('userId', $user->idUser)
                        ->first();
                },
                'userGroup',
                'emergencyMonitoringType'
            ])
            ->when(
                isset($queryRequest['page']),
                function (Builder $query) {
                    return $query
                        ->paginate();
                },
                function (Builder $query) {
                    return $query
                        ->get();
                }
            );
    }

    /**
     * @param $idUser
     * @param array $request
     * @return bool|int
     */
    public function clearingNotification($idUser)
    {
        return $this->getModel()
            ::where('read', 0)
            ->update(['read' => 1,
                'readById' => $idUser]);
    }
}
