<?php


namespace App\Repositories\Report;


use App\Audit\InternalAudit;
use App\Contracts\Repository\AbstractRepository;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

class InternalAuditReportRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(InternalAudit::class);
    }

    public function accessLog(array $request = [])
    {
        return $this->getModel()::query()->leftJoin('user', 'internalAudit.userId', '=', 'user.idUser')
            ->select(
                'user.name',
                'user.email',
                'ip',
                'url_path',
                'browser',
                'localizationLog',
                'message',
                'internalAudit.method',
                'internalAudit.created_at'
            )
            ->orderByDesc('internalAudit.created_at')
            ->when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $query->where('internalAudit.created_at', '>=', Carbon::parse($request['dateStart'])->startOfDay());
            })
            ->when(isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query->where('internalAudit.created_at', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
            })
            ->when(isset($request['email']), function (Builder $query) use ($request) {
                $query->where('user.email', 'like', '%' . $request['email'] . '%');
            })
            ->when(isset($request['url_path']), function (Builder $query) use ($request) {
                $query->where('internalAudit.url_path', 'like', '%' . $request['url_path'] . '%');
            })
            ->when(isset($request['ip']), function (Builder $query) use ($request) {
                $query->where('internalAudit.ip', 'like', '%' . $request['ip'] . '%');
            })
            ->get();
    }
}
