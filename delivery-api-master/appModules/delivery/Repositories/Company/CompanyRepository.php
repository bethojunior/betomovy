<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 31/05/2020
 * Time: 18:37
 */

namespace Delivery\Repositories\Company;


use App\Constants\Delivery\CompanyConst;
use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use Delivery\Models\Company\Company;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class CompanyRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(Company::class);
    }

    public function findNear($lat, $lng, $fantasyName = null, $categories = null, $deliverySectionId = null)
    {
        return $this->getModel()
            ::join('companyAddress', 'companyAddress.companyId', '=', 'company.id')
            ->leftJoin('companyDeliveryOrderConfig', 'companyDeliveryOrderConfig.companyId', '=', 'company.id')
            ->whereHas('companyDeliveryConfig')
            ->whereHas('companyDeliveryArea', function (Builder $query) use ($lat, $lng) {
                return $query->where("statusId", StatusConst::ACTIVE)
                    ->whereRaw(' ST_CONTAINS(area, ST_GeomFromText(ST_AsText(point(?, ?))))', [$lat, $lng]);
            })
            ->where('companyRegisterStatusId', 1)
            ->where('statusId', StatusConst::ACTIVE)
            ->where('companyAddress.isDefault', true)
            ->whereNull('companyAddress.deleted_at')
            ->when(isset($fantasyName), function (Builder $query) use ($fantasyName) {
                return $query->where('company.fantasyName', "like", "%{$fantasyName}%");
            })
            ->when(isset($deliverySectionId), function (Builder $query) use ($deliverySectionId) {
                return $query
                    ->whereHas("establishmentCategoryDelivery", function (Builder $query) use ($deliverySectionId) {
                        $query
                            ->join("typeDeliveryCategoryBySection", "establishmentCategoryDelivery.typeDeliveryCategoryId", "typeDeliveryCategoryBySection.typeDeliveryCategoryId")
                            ->where("establishmentCategoryDelivery.statusId", StatusConst::ACTIVE)
                            ->where("typeDeliveryCategoryBySection.deliverySectionId", $deliverySectionId)
                            ->whereNull("typeDeliveryCategoryBySection.deleted_at");
                    });
            })
            ->when(isset($categories), function (Builder $query) use ($categories) {
                return $query
                    ->whereHas("establishmentCategoryDelivery", function (Builder $query) use ($categories) {
                        $query
                            ->join("typeDeliveryCategory", "establishmentCategoryDelivery.typeDeliveryCategoryId", "typeDeliveryCategory.id")
                            ->where("establishmentCategoryDelivery.statusId", StatusConst::ACTIVE)
                            ->where("typeDeliveryCategory.statusId", StatusConst::ACTIVE)
                            ->whereIn("typeDeliveryCategory.id", explode(",", $categories));
                    });
            })
            ->select(
                'company.id',
                'company.fantasyName',
                'company.phone',
                'company.site',
                'companyAddress.latitude',
                'companyAddress.longitude',
                'companyAddress.address'
            )
            ->selectRaw("
                ROUND((6371 * acos(
                     cos( radians(companyAddress.latitude) )
                     * cos( radians( ? ) )
                     * cos( radians( ? ) - radians(companyAddress.longitude) )
                     + sin( radians(companyAddress.latitude) )
                     * sin( radians( ? ) )
                    )
                ), 2) AS proximity
            ", [$lat, $lng, $lat])
            ->with([
                'companyDeliveryOrderConfig',
                'companyDeliveryConfig',
                'companyOpenHours' => function (HasMany $query) {
                    $query
                        ->join(
                            'weekDay', 'companyOpenHour.weekDayId', '=', 'weekDay.id');
                },
                'companyPaymentForms' => function (HasMany $query) {
                    $query
                        ->join(
                            'deliveryPaymentForm', 'deliveryPaymentFormId', '=', 'deliveryPaymentForm.id')
                        ->whereNull('deliveryPaymentForm.deleted_at');
                },
                'companyDeliveryNeighborhoods' => function (HasMany $query) {
                    $query
                        ->join('deliveryNeighborhood', 'deliveryNeighborhoodId', '=', 'deliveryNeighborhood.id')
                        ->where('active', true)
                        ->whereNull('deliveryNeighborhood.deleted_at')
                        ->whereNull('companyDeliveryNeighborhood.deleted_at')
                        ->select(
                            'companyDeliveryNeighborhood.id',
                            'companyDeliveryNeighborhood.companyId',
                            'companyDeliveryNeighborhood.price',
                            'companyDeliveryNeighborhood.active',
                            'deliveryNeighborhood.name'
                        );
                }
            ])
            ->orderBy('isOpen', 'DESC')
            ->orderBy('proximity')
            ->paginate();
    }

    public function findNearByNeighborhood($lat, $lng, $fantasyName = null, $categories = null, $deliverySectionId = null)
    {
        return $this->getModel()
            ::join('companyAddress', 'companyAddress.companyId', '=', 'company.id')
            ->leftJoin('companyDeliveryOrderConfig', 'companyDeliveryOrderConfig.companyId', '=', 'company.id')
            ->whereHas('companyDeliveryConfig')
            ->whereHas('companyDeliveryNeighborhoods', function (Builder $query) use ($lat, $lng) {
                return $query->where("statusId", StatusConst::ACTIVE)
                    ->whereHas('deliveryNeighborhood', function (Builder $query) use ($lat, $lng) {
                        $query->whereRaw('ST_CONTAINS(deliveryNeighborhood.area, ST_GeomFromText(ST_AsText(point(?, ?))))', [$lat, $lng]);
                    });
            })
            ->when(isset($categories), function (Builder $query) use ($categories) {
                return $query
                    ->whereHas("establishmentCategoryDelivery", function (Builder $query) use ($categories) {
                        $query
                            ->join("typeDeliveryCategory", "establishmentCategoryDelivery.typeDeliveryCategoryId", "typeDeliveryCategory.id")
                            ->where("establishmentCategoryDelivery.statusId", StatusConst::ACTIVE)
                            ->where("typeDeliveryCategory.statusId", StatusConst::ACTIVE)
                            ->whereIn("typeDeliveryCategory.id", explode(",", $categories));
                    });
            })
            ->when(isset($deliverySectionId), function (Builder $query) use ($deliverySectionId) {
                return $query
                    ->whereHas("establishmentCategoryDelivery", function (Builder $query) use ($deliverySectionId) {
                        $query
                            ->join("typeDeliveryCategoryBySection", "establishmentCategoryDelivery.typeDeliveryCategoryId", "typeDeliveryCategoryBySection.typeDeliveryCategoryId")
                            ->where("establishmentCategoryDelivery.statusId", StatusConst::ACTIVE)
                            ->where("typeDeliveryCategoryBySection.deliverySectionId", $deliverySectionId)
                            ->whereNull("typeDeliveryCategoryBySection.deleted_at");
                    });
            })
            ->where('companyRegisterStatusId', 1)
            ->where('statusId', StatusConst::ACTIVE)
            ->where('companyAddress.isDefault', true)
            ->whereNull('companyAddress.deleted_at')
            ->when(isset($fantasyName), function (Builder $query) use ($fantasyName) {
                return $query->where('company.fantasyName', "like", "%{$fantasyName}%");
            })
            ->select(
                'company.id',
                'company.fantasyName',
                'company.phone',
                'company.site',
                'companyAddress.latitude',
                'companyAddress.longitude',
                'companyAddress.address'
            )
            ->selectRaw("
                ROUND((6371 * acos(
                     cos( radians(companyAddress.latitude) )
                     * cos( radians( ? ) )
                     * cos( radians( ? ) - radians(companyAddress.longitude) )
                     + sin( radians(companyAddress.latitude) )
                     * sin( radians( ? ) )
                    )
                ), 2) AS proximity
            ", [$lat, $lng, $lat])
            ->with([
                'companyDeliveryOrderConfig',
                'companyDeliveryConfig',
                'companyOpenHours' => function (HasMany $query) {
                    $query
                        ->join(
                            'weekDay', 'companyOpenHour.weekDayId', '=', 'weekDay.id');
                },
                'companyPaymentForms' => function (HasMany $query) {
                    $query
                        ->join(
                            'deliveryPaymentForm', 'deliveryPaymentFormId', '=', 'deliveryPaymentForm.id')
                        ->whereNull('deliveryPaymentForm.deleted_at');
                },
                'companyDeliveryNeighborhoods' => function (HasMany $query) {
                    $query
                        ->join('deliveryNeighborhood', 'deliveryNeighborhoodId', '=', 'deliveryNeighborhood.id')
                        ->where('active', true)
                        ->whereNull('deliveryNeighborhood.deleted_at')
                        ->whereNull('companyDeliveryNeighborhood.deleted_at')
                        ->select(
                            'companyDeliveryNeighborhood.id',
                            'companyDeliveryNeighborhood.companyId',
                            'companyDeliveryNeighborhood.price',
                            'companyDeliveryNeighborhood.active',
                            'deliveryNeighborhood.name'
                        );
                }
            ])
            ->orderBy('isOpen', 'DESC')
            ->orderBy('proximity')
            ->paginate();
    }

    public function findRandom($fantasyName = null)
    {
        return $this->getModel()
            ::join('companyAddress', 'companyAddress.companyId', '=', 'company.id')
            ->leftJoin('companyDeliveryOrderConfig', 'companyDeliveryOrderConfig.companyId', '=', 'company.id')
            ->whereHas('companyDeliveryConfig')
            ->where('companyRegisterStatusId', 1)
            ->where('statusId', StatusConst::ACTIVE)
            ->where('companyAddress.isDefault', true)
            ->whereNull('companyAddress.deleted_at')
            ->when(isset($fantasyName), function (Builder $query) use ($fantasyName) {
                return $query->where('company.fantasyName', "like", "%{$fantasyName}%");
            })
            ->select(
                'company.id',
                'company.fantasyName',
                'company.phone',
                'company.site',
                'companyAddress.latitude',
                'companyAddress.longitude',
                'companyAddress.address'
            )
            ->selectRaw("
                '-' AS proximity
            ", [])
            ->selectRaw("
                rand() as random
            ")
            ->with([
                'companyDeliveryOrderConfig',
                'companyDeliveryConfig',
                'companyOpenHours' => function (HasMany $query) {
                    $query
                        ->join(
                            'weekDay', 'companyOpenHour.weekDayId', '=', 'weekDay.id');
                },
                'companyPaymentForms' => function (HasMany $query) {
                    $query
                        ->join(
                            'deliveryPaymentForm', 'deliveryPaymentFormId', '=', 'deliveryPaymentForm.id')
                        ->whereNull('deliveryPaymentForm.deleted_at');
                },
                'companyDeliveryNeighborhoods' => function (HasMany $query) {
                    $query
                        ->join('deliveryNeighborhood', 'deliveryNeighborhoodId', '=', 'deliveryNeighborhood.id')
                        ->where('active', true)
                        ->whereNull('deliveryNeighborhood.deleted_at')
                        ->whereNull('companyDeliveryNeighborhood.deleted_at')
                        ->select(
                            'companyDeliveryNeighborhood.id',
                            'companyDeliveryNeighborhood.companyId',
                            'companyDeliveryNeighborhood.price',
                            'companyDeliveryNeighborhood.active',
                            'deliveryNeighborhood.name'
                        );
                }
            ])
            ->orderBy('isOpen', 'DESC')
            ->orderBy('random')
            ->paginate();
    }
}
