<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 16/10/2019
 * Time: 14:10
 */

namespace App\Repositories\Enum;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Enum\WeekDay;

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

    public function findAll()
    {
        return $this->getModel()
            ::select('day','slug','description')
            ->get();
    }
}
