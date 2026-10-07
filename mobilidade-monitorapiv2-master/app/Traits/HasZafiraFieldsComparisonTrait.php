<?php

declare(strict_types=1);

namespace App\Traits;

use App\Models\User\User;

trait HasZafiraFieldsComparisonTrait
{
    protected function hasZafiraFieldsChanged(User $user, array $request): bool
    {
        $originalName = $user->name ?? '';
        $originalPhone = $user->phone ?? '';
        $originalDocument = $user->document ?? '';
        $originalEmail = $user->email ?? '';

        $newName = $request['name'] ?? $user->name ?? '';
        $newPhone = $request['phone'] ?? $user->phone ?? '';
        $newDocument = $request['document'] ?? $user->document ?? '';
        $newEmail = $request['email'] ?? $user->email ?? '';

        $cleanOriginalPhone = preg_replace('/\D/', '', (string) $originalPhone);
        $cleanNewPhone = preg_replace('/\D/', '', (string) $newPhone);
        $cleanOriginalDocument = preg_replace('/\D/', '', (string) $originalDocument);
        $cleanNewDocument = preg_replace('/\D/', '', (string) $newDocument);

        return trim((string) $originalName) !== trim((string) $newName)
            || $cleanOriginalPhone !== $cleanNewPhone
            || $cleanOriginalDocument !== $cleanNewDocument
            || strtolower(trim((string) $originalEmail)) !== strtolower(trim((string) $newEmail));
    }
}
