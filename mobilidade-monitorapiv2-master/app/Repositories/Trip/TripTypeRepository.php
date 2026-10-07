<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/06/2019
 * Time: 22:01
 */

namespace App\Repositories\Trip;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Trip\TripType;
use Google\Rpc\Status;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TripTypeRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(TripType::class);
    }

    public function findAll()
    {
        return $this->getModel()
            ::with('gender')
            ->with(['callGroupsTripTypeLinked' => function ($query) {
                $query->with('callGroups');
            }])
            ->with(['tripTypePartnerLinked' => function ($query) {
                $query->with('configAppPartners');
            }])
            ->where('statusId', StatusConst::ACTIVE)
            ->get();
    }

    public function findWithDriversType()
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->with(['tripTypeDrivers' => function (HasMany $query) {
                $query
                    ->with(['userType' => function (BelongsTo $query) {
                        $query
                            ->where('isDriver', true)
                            ->where('statusId', StatusConst::ACTIVE)
                            ->select(
                                'idUserType',
                                'name',
                                'isDriver',
                                'description',
                                'isActive',
                                'picture');
                    }]);
            }])
            ->get();
    }
}
