<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 28/07/2020
 * Time: 07:20
 */

namespace Delivery\Repositories\Company;


use App\Contracts\Repository\AbstractRepository;
use Delivery\Models\Company\CompanyDeliveryNeighborhood;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompanyDeliveryNeighborhoodRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(CompanyDeliveryNeighborhood::class);
    }

    /**
     * @param int $deliveryNeighborhoodId
     * @param int $companyId
     * @return \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Eloquent\Model|object|null
     */
    public function findActiveByDeliveryNeighborhoodAndCompany(int $deliveryNeighborhoodId, int $companyId)
    {
        return $this->getModel()
            ::where('deliveryNeighborhoodId', $deliveryNeighborhoodId)
            ->where('companyId', $companyId)
            ->where('active', true)
            ->first();
    }

    /**
     * @param $lat
     * @param $lng
     * @param int $companyId
     * @return \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Eloquent\Model|object|null
     */
    public function findDeliveryNeighborhoodAndCompanyByArea($lat, $lng, int $companyId)
    {
        return $this->getModel()
            ::where('companyId', $companyId)
            ->whereHas('deliveryNeighborhood', function (Builder $query) use ($lat, $lng) {
                $query->whereRaw('ST_CONTAINS(deliveryNeighborhood.area, ST_GeomFromText(ST_AsText(point(?, ?))))', [$lat, $lng]);
            })
            ->select([
                'price as tax'
            ])
            ->where('active', true)
            ->first();
    }
}
