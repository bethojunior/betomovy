<?php


namespace App\Repositories\Contact;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Contact\ContactUs;
use Illuminate\Database\Eloquent\Builder;

class ContactUsRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(ContactUs::class);
    }

    public function findAll(array $request, int $cityId = null)
    {
        return $this->getModel()::query()->join('user', 'contactUs.userId', 'user.idUser')
            ->join('userType', 'contactUs.userTypeId', 'userType.idUserType')
            ->select(
                'idContactUs',
                'contactUs.message',
                'contactUs.userTypeId',
                'userType.name as userType',
                'contactUs.userId',
                'user.name',
                'user.email',
                'user.phone',
                'contactUs.created_at',
                'contactUs.updated_at'
            )
            ->where('contactUs.statusId', StatusConst::ACTIVE)
            ->when(isset($cityId), function (Builder $query) use ($cityId) {
                $query->whereRaw('
                    (ST_CONTAINS((SELECT polygon
                        FROM cityArea
                        WHERE cityArea.cityId = ?
                        AND cityArea.statusId = 1),
                    POINT(user.last_lat, user.last_lon)) = 1)
                ', [$cityId]);
            })
            ->when(isset($request['userId']), function (Builder $query) use ($request) {
                $query->where('');
            })
            ->orderByDesc('contactUs.created_at')
            ->paginate($request['per_page'] ?? 10);
    }
}
