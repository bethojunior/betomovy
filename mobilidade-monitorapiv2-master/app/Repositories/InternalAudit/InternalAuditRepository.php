<?php

namespace App\Repositories\InternalAudit;

use App\Audit\InternalAudit;
use App\Contracts\Repository\AbstractRepository;

class InternalAuditRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(InternalAudit::class);
    }

    public function createRegisterLog(array $data, $userId)
    {
        $request = request();

        $this->getModel()::create([
            'userId' => $userId,
            'localizationLog' => $data['localization'] ?? null,
            'message' => 'Usuário realizou login',
            'browser' => $_SERVER['HTTP_USER_AGENT'] ?? 'N/A',
            'url_path' => $request->path(),
            'method' => $request->method(),
            'ip' => $request->ip(),
            'content' => null,
        ]);
    }
}
