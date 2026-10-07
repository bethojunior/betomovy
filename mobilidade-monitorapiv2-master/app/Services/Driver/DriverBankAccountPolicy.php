<?php

namespace App\Services\Driver;

use App\Constants\Users\DriverPermissionConst;
use App\Models\User\Driver;
use App\Models\User\User;
use App\Services\Role\RoleUserPermissionService;

// Quem pode ver/editar a conta bancária do motorista (destino dos saques)
class DriverBankAccountPolicy
{
    // Campos bancários devolvidos pelo DriverRepository::findFully
    private const BANK_FIELDS = [
        'holderName',
        'bankAccountDocument',
        'typeAccount',
        'agency',
        'agencyDigit',
        'numberAccount',
        'numberAccountDigit',
        'op',
        'bankId',
        'pix',
        'pixType',
        'bankNumber',
        'bankName',
    ];

    private $permissionService;

    public function __construct(RoleUserPermissionService $permissionService)
    {
        $this->permissionService = $permissionService;
    }

    public function canView(?User $user): bool
    {
        return $this->allows($user, DriverPermissionConst::VIEW_BANK_ACCOUNT);
    }

    public function canEdit(?User $user): bool
    {
        return $this->allows($user, DriverPermissionConst::EDIT_BANK_ACCOUNT);
    }

    // Remove os dados bancários da resposta quando o usuário não pode vê-los
    public function restrict(Driver $driver, ?User $user): Driver
    {
        return $this->canView($user) ? $driver : $driver->makeHidden(self::BANK_FIELDS);
    }

    private function allows(?User $user, string $permission): bool
    {
        return $user !== null
            && $this->permissionService->hasPermission($user, DriverPermissionConst::GROUP, $permission);
    }
}
