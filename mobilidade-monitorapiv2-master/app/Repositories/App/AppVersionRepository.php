<?php

namespace App\Repositories\App;

use App\Contracts\Repository\AbstractRepository;
use App\Models\App\AppVersion;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AppVersionRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(AppVersion::class);
    }

    public function getAll(): LengthAwarePaginator
    {
        return $this->getQuery()
            ->selectRaw("
                appVersion.id,
                appVersion.appId,
                appVersion.version,
                appVersion.statusId,
                appVersion.platform,
                appVersion.link,
                appVersion.created_at,
                appVersion.updated_at,
                app.name AS appName
            ")
            ->join('app', 'appVersion.appId', '=', 'app.idApp')
            ->orderByRaw('appVersion.statusId ASC, appVersion.created_at DESC')
            ->paginate();
    }
}
