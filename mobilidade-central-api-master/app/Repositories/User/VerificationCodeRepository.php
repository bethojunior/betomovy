<?php


namespace App\Repositories\User;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\User\VerificationCode;
use Illuminate\Database\Eloquent\Model;

class VerificationCodeRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(VerificationCode::class);
    }

    public function findByCodeAndUserId(string $code, int $userId): ?Model
    {
        return $this->getModel()::where('code', $code)
            ->where('userId', $userId)
            ->whereNull('used_at')
            ->where('statusId', StatusConst::ACTIVE)
            ->first();
    }

    public function deleteByUser(int $userId)
    {
        return $this->getModel()::query()->where('userId', $userId)
            ->update(['statusId' => StatusConst::REMOVED]);
    }
}
