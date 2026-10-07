<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 31/05/2020
 * Time: 16:43
 */

namespace App\Repositories\Company;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Company\CompanyAddress;
use Illuminate\Database\Eloquent\Builder;

class CompanyAddressRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(CompanyAddress::class);
    }

    /**
     * @param int $companyId
     * @return bool|int
     */
    public function disableMarkIsDefault(int $companyId)
    {
        return $this->getModel()
            ::where('companyId', $companyId)
            ->update(['isDefault' => false]);
    }

    public function findAll(?array $request)
    {
        return $this->getModel()
            ::when(isset($request['companyId']), function (Builder $query) use ($request) {
                $query->where('companyId', $request['companyId']);
            })
            ->get();
    }
}
