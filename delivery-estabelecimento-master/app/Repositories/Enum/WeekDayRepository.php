<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/06/2020
 * Time: 14:48
 */

namespace App\Repositories\Enum;


use Common\Contracts\Repository\AbstractRepository;
use App\Models\Enum\WeekDay;
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

    public function all()
    {
        return $this->getModel()
            ::orderBy('day')
            ->get();
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
