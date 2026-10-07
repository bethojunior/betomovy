<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 19/02/2020
 * Time: 16:26
 */

namespace App\Repositories\Report;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Report\ReportType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ReportTypeRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(ReportType::class);
    }

    public function findAllWithReport(array $filters = [])
    {
        return $this->getModel()
            ::whereHas('reports', function (Builder $query) {
                $query
                    ->where('statusId', StatusConst::ACTIVE);
            })
            ->with([
                'reports' => function (HasMany $query) use ($filters) {
                    $query->when(!isset($filters['withFilters']) || $filters['withFilters'], function (Builder $query) {
                        $query->with('reportFilters');
                    });
                }
            ])
            ->get();
    }
}
