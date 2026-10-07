<?php


namespace Api\Repositories\Company;


use App\Models\Company\CompanyAddress;
use Common\Contracts\Repository\AbstractRepository;

class CompanyAddressRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(CompanyAddress::class);
    }

    public function findActive($companyId)
    {
        return $this->getModel()
            ::where("companyId", $companyId)
            ->where("isDefault", true)
            ->first();
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
}
