<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 07/10/2019
 * Time: 14:48
 */

namespace App\Repositories\CityConfig;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Config\CityConfig;
use App\Models\Config\CityConfigView;
use Illuminate\Support\Facades\DB;

class CityConfigViewRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(CityConfigView::class);
    }

    public function findByCity($cityId)
    {
        return $this->getModel()
            ::where('cityId', $cityId)
            ->get();
    }
}
