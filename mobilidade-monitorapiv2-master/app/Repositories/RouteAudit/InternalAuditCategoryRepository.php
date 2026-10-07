<?php


namespace App\Repositories\RouteAudit;


use App\Contracts\Repository\AbstractRepository;
use App\Models\RouteAudit\InternalAuditCategory;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\DB;

class InternalAuditCategoryRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(InternalAuditCategory::class);
    }

    public function findRequestsByCategory(int $id, array $request)
    {
        return $this->getModel()::query()->join('internalAudit', function (JoinClause $join) {
            $join->on('internalAudit.url_path', 'like', DB::raw("CONCAT('%', internalAuditCategory.path, '%')"))
                ->where('internalAudit.content', 'like', DB::raw("CONCAT('%', internalAuditCategory.content, '%')"));
        })
            ->join('user', 'user.idUser', 'internalAudit.userId')
            ->where('internalAuditCategory.id', $id)
            ->select(
                'internalAudit.url_path',
                'internalAudit.content',
                'internalAudit.created_at',
                'user.name'
            )
            ->where('internalAuditCategory.id', $id)
            ->when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $query->where('internalAudit.created_at', '>=', Carbon::parse($request['dateStart'])->startOfDay());
            })
            ->when(isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query->where('internalAudit.created_at', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
            })
            ->orderByDesc('internalAudit.created_at')
            ->paginate($request['per_page'] ?? null);
    }
}
