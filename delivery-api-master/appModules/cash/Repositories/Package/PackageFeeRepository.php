<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 06/03/2020
 * Time: 11:02
 */

namespace Cash\Repositories\Package;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Package\PackageFee;

class PackageFeeRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(PackageFee::class);
    }

    public function findActiveByPackage(int $packageId)
    {
        return $this->getModel()
            ::where('packageId', $packageId)
            ->where('statusId', StatusConst::ACTIVE)
            ->first();
    }
}
