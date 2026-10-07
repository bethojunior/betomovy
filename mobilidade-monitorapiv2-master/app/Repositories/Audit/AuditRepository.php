<?php


namespace App\Repositories\Audit;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Audit\Audit;
use Illuminate\Database\Eloquent\Builder;

class AuditRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(Audit::class);
    }

    public function findAll(array $request = [])
    {
        return $this->getModel()::when(isset($request['email']), function (Builder $query) use ($request) {
            $query->where('email', 'like', '%' . $request['email'] . '%');
        })
            ->when(isset($request['name']), function (Builder $query) use ($request) {
                $query->where('name', 'like', '%' . $request['name'] . '%');
            })
            ->when(isset($request['phone']), function (Builder $query) use ($request) {
                $query->where('phone', 'like', '%' . $request['phone'] . '%');
            })
            ->where('statusId', '=', StatusConst::ACTIVE)
            ->orderByDesc("created_at")
            ->get();
    }


}
