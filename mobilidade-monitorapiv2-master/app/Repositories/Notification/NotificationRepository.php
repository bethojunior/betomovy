<?php


namespace App\Repositories\Notification;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Notification\Notification;
use App\Models\Role\Role;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Query\Builder;

class NotificationRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(Notification::class);
    }

    public function findAll(array $data = [], Role $authRole = null)
    {

        return $this->getModel()
            ::with([
                'notificationUserTypes' => function (HasMany $query) {
                    $query
                        ->join('userType', 'userTypeId', '=', 'idUserType')
                        ->select([
                            'notificationUserType.id',
                            'notificationId',
                            'idUserType',
                            'userType.name AS userType'
                        ]);
                },
                'city'
            ])
            ->whereNull("userIdAdministrator")
            ->where('statusId', 1)
            ->where('title',  '!=', 'Viagem agendada')
            ->where('message',  '!=', 'Você tem uma viagem agendada para daqui a pouco')
            ->when(isset($authRole) && !$authRole->support, function (\Illuminate\Database\Eloquent\Builder $query) use ($authRole) {
                $query->whereIn('cityId', function (Builder $query) use ($authRole) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleId', $authRole->id);
                });
            })
            ->orderByDesc("idNotification")
            ->paginate($data['per_page'] ?? 20);
    }
}
