<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 28/07/2020
 * Time: 17:47
 */

namespace App\Repositories\FinancialIntermediary;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Acquirer\FinancialIntermediary;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\DB;

class FinancialIntermediaryRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(FinancialIntermediary::class);
    }

    public function findAll(array $request = [])
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->with([
                'acquirerMetaData' => function (HasMany $query) use ($request) {
                    $query
                        ->where('showable', true)
                        ->select(
                            'acquirerMetaData.key',
                            'acquirerMetaData.description',
                            'acquirerMetaData.financialIntermediaryId',
                            'acquirerMetaData.isRoot'
                        )
                        ->when(isset($request['cityId']), function ($query) use ($request) {
                            $query->leftJoin('acquirerMetaDataCity', function (JoinClause $join) use ($request) {
                                $join->on('acquirerMetaData.id', 'acquirerMetaDataCity.acquirerMetaDataId')
                                    ->where('active', 1)
                                    ->where('acquirerMetaDataCity.cityId', $request['cityId']);
                            })
                                ->addSelect(DB::raw('IF(acquirerMetaDataCity.value is not null, acquirerMetaDataCity.value, acquirerMetaData.value) as value'));
                        }, function ($query) {
                            $query->addSelect('value');
                        });
                }
            ])
            ->get();
    }

    public function findByActive()
    {
        return $this->getModel()::where('active','=','1')->first();
    }

    public function findAllByCity(int $cityId, array $request = [])
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->select(
                'idFinancialIntermediary',
                'name',
                DB::raw('if(acquirerMetaDataCity.active is not null, acquirerMetaDataCity.active, 0) as active')
            )
            ->join('acquirerMetaData', 'financialIntermediary.idFinancialIntermediary', 'acquirerMetaData.financialIntermediaryId')
            ->leftJoin('acquirerMetaDataCity', function (JoinClause $join) use ($cityId) {
                $join->on('acquirerMetaData.id', 'acquirerMetaDataCity.acquirerMetaDataId')
                    ->where('acquirerMetaDataCity.cityId', $cityId)
                    ->whereNull('deleted_at');
            })
            ->groupBy('idFinancialIntermediary')
            ->orderBy('idFinancialIntermediary')
            ->with([
                'acquirerMetaData' => function (HasMany $query) use ($cityId) {
                    $query
                        ->where('showable', true)
                        ->select(
                            'acquirerMetaData.key',
                            'acquirerMetaData.description',
                            'acquirerMetaData.financialIntermediaryId',
                            'acquirerMetaDataCity.value',
                            'acquirerMetaData.isRoot'
                        )
                        ->leftJoin('acquirerMetaDataCity', function (JoinClause $join) use ($cityId) {
                            $join->on('acquirerMetaData.id', 'acquirerMetaDataCity.acquirerMetaDataId')
                                ->where('acquirerMetaDataCity.cityId', $cityId)
                                ->whereNull('deleted_at');
                        });
                }
            ])
            ->get();
    }

    public function disableAll()
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->update(['active' => 0]);
    }

}
