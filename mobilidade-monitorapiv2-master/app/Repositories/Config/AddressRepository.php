<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 10/03/2020
 * Time: 13:51
 */

namespace App\Repositories\Config;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Config\Address;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class AddressRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(Address::class);
    }

    public function findAll(array $request)
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->where('manual', true)
            ->orderByDesc('created_at')
            ->when(isset($request['q']), function (Builder $query) use ($request) {
                return $query->where("address", "like", "%{$request['q']}%");
            })
            ->when(isset($request['page']), function (Builder $query) {
                return $query->paginate();
            }, function (Builder $query) {
                return $query->get();
            });
    }

    public function getCacheAddress(string $query)
    {
        return DB::select(
            "SELECT idOrigin as originId,
               idDestination as destinationId,
               latitude,
               longitude,
               address,
               neighborhood,
               cityId,
               DATE_FORMAT(created_at, '%Y-%m-%d') as created_at
        FROM (SELECT o.idOrigin,
                     null AS idDestination,
                     o.address,
                     o.neighborhood,
                     o.cityId,
                     o.latitude,
                     o.longitude,
                     o.created_at
              FROM origin o
              WHERE MATCH(address) AGAINST(? IN BOOLEAN MODE)
                AND o.address NOT IN (
                  SELECT address.address
                  FROM address
                  WHERE address.statusId = ?
              )
                AND o.address NOT IN (
                  SELECT addressBlacklist.address
                  FROM addressBlacklist
                  WHERE addressBlacklist.approved = 1
                    AND addressBlacklist.deleted_at IS NULL
              )
              UNION
              SELECT null AS idOrigin,
                     d.idDestination,
                     d.address,
                     d.neighborhood,
                     d.cityId,
                     d.latitude,
                     d.longitude,
                     d.created_at
              FROM destination d
              WHERE MATCH(address) AGAINST(? IN BOOLEAN MODE)
                AND d.address NOT IN (
                  SELECT address.address
                  FROM address
                  WHERE address.statusId = ?
              )
                AND d.address NOT IN (
                  SELECT addressBlacklist.address
                  FROM addressBlacklist
                  WHERE addressBlacklist.approved = 1
                    AND addressBlacklist.deleted_at IS NULL
              )) as query
        GROUP BY address
        LIMIT 20", [
            $query,
            StatusConst::REMOVED,
            $query,
            StatusConst::REMOVED,
        ]);
    }

    public function changeStatusAddressBlocked($address, $blocked)
    {
        $this->getModel()
            ::where("address", $address)
            ->update([
                "blocked" => $blocked
            ]);
    }
}
