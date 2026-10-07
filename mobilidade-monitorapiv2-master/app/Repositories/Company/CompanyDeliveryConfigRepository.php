<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 19/05/2020
 * Time: 08:46
 */

namespace App\Repositories\Company;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Delivery\CompanyDeliveryConfig;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompanyDeliveryConfigRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(CompanyDeliveryConfig::class);
    }

    public function findByCompany(int $companyId)
    {
        return $this->getModel()
            ::where('companyId', $companyId)
            ->first();
    }

    public function findWithCompany($cityId)
    {
        return $this->getModel()
            ::whereHas('company', function ($query) use ($cityId) {
                $query
                    ->where('company.statusId', StatusConst::ACTIVE)
                    ->where('company.cityId', $cityId);
            })
            ->with(['company' => function (BelongsTo $query) {
                $query
                    ->leftJoin('establishmentCollectionManagement', 'company.establishmentCollectionManagementId', 'establishmentCollectionManagement.id')
                    ->select('company.*',
                        'establishmentCollectionManagement.label as establishmentCollectionManagement'
                    );
            }])
            ->get();
    }


    public function findExistCompany(int $companyId)
    {
        return $this->getModel()
            ::where('companyId', $companyId)
            ->where('deleted_at', null)
            ->first();
    }
}
