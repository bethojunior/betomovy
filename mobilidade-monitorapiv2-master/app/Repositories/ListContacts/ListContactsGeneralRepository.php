<?php


namespace App\Repositories\ListContacts;

use App\Contracts\Repository\AbstractRepository;
use App\Models\ListContacts\ListContactsGeneral;
use Illuminate\Database\Eloquent\Builder;

class ListContactsGeneralRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(ListContactsGeneral::class);
    }

    public function findListContactsWithPagination(array $request = [])
    {
        $perPage = $request['per_page'] ?? 15;

        return $this->getModel()::when(!empty($request['nameContact']), function (Builder $query) use ($request) {
            $query->where('name_person', 'like', '%' . $request['nameContact'] . '%');
        })->when(!empty($request['phone']), function (Builder $query) use ($request) {
            $query->where('phone_person', 'like', '%' . $request['phone'] . '%');
        })
            ->orderByDesc("created_at")
            ->paginate($perPage);
    }

    public function findContactById(int $id)
    {
        $response = $this->getModel()::where('id', $id)->first();

        if ($response) {
            return $response;
        } else {
            return null;
        }
    }
}
