<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 05/06/2020
 * Time: 09:51
 */

namespace Delivery\Repositories\Enum;


use App\Contracts\Repository\AbstractRepository;
use Delivery\Models\Enum\WeekDay;
use Illuminate\Database\Query\JoinClause;

class WeekDayRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(WeekDay::class);
    }

    public function findWithCompanyOpenHour(int $companyId)
    {
        return $this->getModel()
            ::leftJoin('companyOpenHour', function (JoinClause $join) use ($companyId) {
                $join->on('weekDay.id', '=', 'companyOpenHour.weekDayId');
                $join->where('companyOpenHour.companyId', $companyId);
                $join->whereNull('companyOpenHour.deleted_at');
            })
            ->select(
                'weekDay.id',
                'weekDay.day',
                'weekDay.slug',
                'weekDay.description',
                'companyOpenHour.id AS companyOpenHourId',
                'companyOpenHour.companyId',
                'companyOpenHour.hourStart',
                'companyOpenHour.hourStop',
                'companyOpenHour.created_at',
                'companyOpenHour.updated_at'
            )
            ->get();
    }
}
