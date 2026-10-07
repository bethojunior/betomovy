<?php


namespace App\Repositories\Advertising;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Advertising\Advertising;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class AdvertisingRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(Advertising::class);
    }

    /**
     * @param array $queryRequest
     * @return Builder|\Illuminate\Database\Eloquent\Model|mixed
     */
    public function findAll(array $queryRequest = [])
    {
        return $this->getModel()
            ::where('statusId', '!=', StatusConst::REMOVED)
            ->orderBy('displayOrder')
            ->with([
                'city' => function (BelongsTo $query) {
                    $query
                        ->select('id', 'nome AS cityName');
                },
                'company' => function (BelongsTo $query) {
                    $query
                        ->select(
                            'id',
                            'name',
                            'fantasyName',
                            'document'
                        );
                },
                'gender',
                'advertisingAppSite',
                'app' => function (BelongsTo $query) {
                    $query
                        ->select('idApp', 'name');
                }
            ])
            ->when(isset($queryRequest['cityId']), function (Builder $query) use ($queryRequest){
                $query
                    ->where('cityId', $queryRequest['cityId']);
            })
            ->when(isset($queryRequest['companyId']), function (Builder $query) use ($queryRequest){
                $query
                    ->where('companyId', $queryRequest['companyId']);
            })
            ->when(isset($queryRequest['genderId']), function (Builder $query) use ($queryRequest){
                $query
                    ->where('genderId', $queryRequest['genderId']);
            })
            ->when(isset($queryRequest['advertisingAppSiteId']), function (Builder $query) use ($queryRequest){
                $query
                    ->where('advertisingAppSiteId', $queryRequest['advertisingAppSiteId']);
            })
            ->when(isset($queryRequest['appId']), function (Builder $query) use ($queryRequest){
                $query
                    ->where('appId', $queryRequest['appId']);
            })
            ->when((isset($queryRequest['paginate']) && $queryRequest['paginate'] == 1),
                function (Builder $query){
                    return
                        $query->paginate();
                },
                function (Builder $query) {
                    return $query->get();
                });
    }

    public function show($id)
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->where('id', $id)
            ->with([
                'city' => function (BelongsTo $query) {
                    $query
                        ->select('id', 'nome AS cityName');
                },
                'company' => function (BelongsTo $query) {
                    $query
                        ->select(
                            'id',
                            'name',
                            'fantasyName',
                            'document'
                        );
                },
                'gender',
                'advertisingAppSite',
                'app' => function (BelongsTo $query) {
                    $query
                        ->select('idApp', 'name');
                }
            ])
            ->first();
    }

    public function countByCityAndApp(int $cityId, int $appId): int
    {
        return $this->getModel()
            ::where('cityId', $cityId)
            ->where('appId', $appId)
            ->where('statusId', '!=', StatusConst::REMOVED)
            ->count();
    }

    public function updateOrder(array $orders): bool
    {
        DB::beginTransaction();

        try {
            foreach ($orders as $orderData) {
                $this->getModel()::select(['id', 'displayOrder'])
                    ->where('id', $orderData['id'])
                    ->update(['displayOrder' => $orderData['order']]);
            }

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
