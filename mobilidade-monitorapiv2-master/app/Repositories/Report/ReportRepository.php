<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 19/02/2020
 * Time: 15:53
 */

namespace App\Repositories\Report;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Report\Report;
use Illuminate\Database\Eloquent\Builder;

class ReportRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(Report::class);
    }

    public function findAll(array $filters = [])
    {
        return $this->getModel()::where('statusId', StatusConst::ACTIVE)
            ->select(
                'id',
                'name',
                'description',
                'reportTypeId',
                'statusId',
                'enablePdf'
            )
            ->when(isset($filters['withFilters']) && $filters['withFilters'], function (Builder $query) {
                $query->with('reportFilters');
            })
            ->get();
    }
}
