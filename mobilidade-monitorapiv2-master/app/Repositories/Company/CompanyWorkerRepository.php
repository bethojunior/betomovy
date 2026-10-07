<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 25/10/2019
 * Time: 17:24
 */

namespace App\Repositories\Company;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Company\CompanyWorker;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompanyWorkerRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(CompanyWorker::class);
    }

    public function findByCompany($companyId, $onlyManager = false)
    {
        $query = $this->getModel()
            ::whereHas('company', function (Builder $query) use ($companyId) {
                $query
                    ->where('statusId', StatusConst::ACTIVE)
                    ->where('id', $companyId);
            })
            ->where('statusId', StatusConst::ACTIVE)
            ->with([
                'user' => function (BelongsTo $query) {
                    $query
                        ->select(
                            'idUser',
                            'name',
                            'email',
                            'phone',
                            'document');
                }
            ])
            ->when($onlyManager == true, function (Builder $query) {
                $query
                    ->where('isManager', 1);
            });

        return $onlyManager ? $query->first() : $query->get();
    }

    /**
     * @param $userId
     * @param bool $withTrash
     * @return Builder|\Illuminate\Database\Eloquent\Model|mixed|object|null|CompanyWorker
     */
    public function findByUser($userId, $withTrash = true)
    {
        return $this->getModel()
            ::where('userId', $userId)
            ->when(!$withTrash, function (Builder $query) {
                $query->where('statusId', StatusConst::ACTIVE);
            })
            ->first();
    }
}
