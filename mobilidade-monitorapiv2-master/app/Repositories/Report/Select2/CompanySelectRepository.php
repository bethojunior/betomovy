<?php


namespace App\Repositories\Report\Select2;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Company\Company;

class CompanySelectRepository extends AbstractRepository
{
    /**
     * CompanySelectRepositoy constructor.
     */
    public function __construct()
    {
        $this->setModel(Company::class);
    }

    /**
     * @param array $request
     * @return \Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model[]
     */
    public function listBySelect2(array $request)
    {
        $fantasyName = isset($request['q']) ? "%{$request['q']}%" : '';

        return $this->getModel()
            ::select(
                'id',
                'fantasyName AS text'
            )
            ->where('fantasyName', 'LIKE', $fantasyName)
            ->get();
    }
}
