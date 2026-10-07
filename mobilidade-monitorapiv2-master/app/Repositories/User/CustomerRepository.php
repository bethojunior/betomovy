<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 03/01/2020
 * Time: 16:07
 */

namespace App\Repositories\User;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\User\Customer;
use App\Models\User\User;
use App\Helpers\PhoneHelper;
use App\Helpers\FullTextSearchHelper;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\DB;

class CustomerRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(Customer::class);
    }

    public function findAll(User $user, array $data, $cityId = null)
    {
        $core = $this->findAllCore($user, $data, $cityId);
        $enriched = $this->enrichCustomers($core->getCollection()->pluck('idCustomer'))->keyBy('idCustomer');

        return $core->setCollection(
            $core->getCollection()->map(fn ($row) => $enriched->get($row->idCustomer))
        );
    }

    // Só o necessário pra decidir quais clientes batem, em que ordem e paginar — sem os JOINs de exibição/GROUP_CONCAT, que forçavam GROUP BY e quebravam o índice do ORDER BY.
    private function findAllCore(User $user, array $data, $cityId = null)
    {
        return $this->getModel()::join('user', 'customer.userId', '=', 'user.idUser')
            ->join('levelAccess', 'user.idUser', '=', 'levelAccess.userId')
            ->leftJoin('militaryUser', 'user.idUser', '=', 'militaryUser.userId')
            ->leftJoin('militaryStatus', 'militaryUser.militaryStatusId', '=', 'militaryStatus.id')
            ->leftJoin('militaryForceGraduation', 'militaryUser.militaryGraduationId', '=', 'militaryForceGraduation.id')
            ->leftJoin('militaryForce', 'militaryUser.militaryForceId', '=', 'militaryForce.id')
            ->where('user.statusId', StatusConst::ACTIVE)
            ->when(!$user->role->support, function (Builder $query) use ($cityId, $user) {
                // whereExists em vez de JOIN — mesma checagem, sem risco de duplicar linha (dispensa DISTINCT).
                $query->whereExists(function (\Illuminate\Database\Query\Builder $query) use ($cityId, $user) {
                    $query->select(DB::raw(1))
                        ->from('cityArea')
                        ->where('cityArea.statusId', StatusConst::ACTIVE)
                        ->when(isset($cityId), function (\Illuminate\Database\Query\Builder $query) use ($cityId) {
                            $query->where('cityArea.cityId', $cityId);
                        })
                        ->whereIn('cityArea.cityId', function (\Illuminate\Database\Query\Builder $query) use ($user) {
                            $query->select('cityId')
                                ->from('roleCity')
                                ->where('roleCity.roleId', $user->roleId);
                        })
                        ->where(function (\Illuminate\Database\Query\Builder $query) {
                            $query->whereColumn('user.cityId', 'cityArea.cityId')
                                ->orWhereRaw('(ST_CONTAINS(cityArea.polygon, POINT(user.last_lat, user.last_lon)))');
                        });
                });
            })
            ->when(isset($data['email']), function (Builder $query) use ($data) {
                $term = FullTextSearchHelper::prepareBooleanQuery($data['email']);
                $query->when($term !== '', function (Builder $query) use ($term) {
                    $query->whereRaw('MATCH(user.email) AGAINST(? IN BOOLEAN MODE)', [$term]);
                });
            })
            ->when(isset($data['militaryForceId']), function (Builder $query) use ($data) {
                $query->where('militaryForce.id', 'like', $data['militaryForceId']);
            })
            ->when(isset($data['militaryStatusId']), function (Builder $query) use ($data) {
                $query->where('militaryStatus.id', 'like', $data['militaryStatusId']);
            })
            ->when(isset($data['militaryGraduationId']), function (Builder $query) use ($data) {
                $query->where('militaryForceGraduation.id', 'like', $data['militaryGraduationId']);
            })
            ->when(isset($data['customerRegisterStatusId']), function (Builder $query) use ($data) {
                $query->where('customer.customerRegisterStatusId', '=', $data['customerRegisterStatusId']);
            })
            ->when(isset($data['name']), function (Builder $query) use ($data) {
                $term = FullTextSearchHelper::prepareBooleanQuery($data['name']);
                $query->when($term !== '', function (Builder $query) use ($term) {
                    $query->whereRaw('MATCH(user.name) AGAINST(? IN BOOLEAN MODE)', [$term]);
                });
            })
            ->when(isset($data['document']), function (Builder $query) use ($data) {
                // UNION em vez de OR entre tabelas — OR misturando tabela indexada com LEFT JOIN impede índice.
                $digitsOnly = preg_replace('/\D/', '', $data['document']);
                $searchTerm = $data['document'];

                $matchingUserIds = DB::table('user')->select('idUser')
                    ->where('document_digits', 'like', $digitsOnly . '%')
                    ->union(DB::table('user')->select('idUser')->where('rg', 'like', $searchTerm . '%'))
                    ->union(DB::table('docUser')->select('userId')->where('text', 'like', $searchTerm . '%'))
                    ->union(DB::table('militaryUser')->select('userId')->where('om', 'like', $searchTerm . '%'));

                $query->whereIn('user.idUser', $matchingUserIds);
            })
            ->when(isset($data['phone']), function (Builder $query) use ($data) {
                $validatedPhone = PhoneHelper::normalizePhone($data['phone']);
                $query->where('user.phone_digits', 'like', $validatedPhone . '%');
            })
            ->select('customer.idCustomer')
            ->orderByDesc('user.created_at')
            ->simplePaginate($data['per_page'] ?? 20);
    }

    // Traz os campos de exibição só pros IDs já decididos pelo findAllCore — join+GROUP_CONCAT pesado, mas em cima de poucas linhas (a página atual).
    private function enrichCustomers($customerIds)
    {
        return $this->getModel()::join('user', 'customer.userId', '=', 'user.idUser')
            // leftJoin: findAllCore() não exige balance, inner join aqui sumia com o cliente no map().
            ->leftJoin('balance', 'customer.balanceId', '=', 'balance.idBalance')
            ->join('config', 'config.key', DB::raw("'link_storage_pictures'"))
            ->leftJoin('city', 'user.cityId', 'city.id')
            ->leftJoin('customerRegisterStatus', 'customer.customerRegisterStatusId', '=', 'customerRegisterStatus.idCustomerRegisterStatus')
            ->leftJoin('militaryUser', 'user.idUser', '=', 'militaryUser.userId')
            ->leftJoin('militaryStatus', 'militaryUser.militaryStatusId', '=', 'militaryStatus.id')
            ->leftJoin('militaryForceGraduation', 'militaryUser.militaryGraduationId', '=', 'militaryForceGraduation.id')
            ->leftJoin('militaryForce', 'militaryUser.militaryForceId', '=', 'militaryForce.id')
            ->leftJoin('docUser', 'user.idUser', '=', 'docUser.userId')
            ->leftJoin('doc', 'docUser.docId', '=', 'doc.id')
            ->leftJoin('docStatus', 'docUser.docStatusId', '=', 'docStatus.id')
            ->whereIn('customer.idCustomer', $customerIds)
            ->select(
                'customer.idCustomer',
                'user.idUser',
                'user.name',
                'user.nickname',
                'user.phone',
                'user.email',
                'user.document',
                'user.dateOfBirth',
                'user.gender',
                'user.rg',
                DB::raw('IF(user.rgFrontPicture = NULL, null, (CONCAT(config.value,\'customer/doc/\', user.rgFrontPicture))) AS rgFrontPicture'),
                DB::raw('IF(user.rgBackPicture = NULL, null, (CONCAT(config.value,\'customer/doc/\', user.rgBackPicture))) AS rgBackPicture'),
                'customerRegisterStatus.name as status',
                'user.cityId',
                'city.nome as city',
                'customer.balanceId',
                'balance.balance as comission',
                'balance.tripBalance as voucherBalance',
                'customer.profileImage',
                'customer.appVersion',
                'user.platform',
                'user.quantityTrips as quantityTripsFinished',
                'user.created_at',
                'user.observation',
                'user.last_lat as latitude',
                'user.last_lon as longitude',
                'militaryUser.om',
                'militaryStatus.name as militaryStatus',
                'militaryForce.name as militaryForce',
                'militaryForceGraduation.patent as patent',
                'militaryForceGraduation.picture as patentPicture',
                DB::raw("GROUP_CONCAT(DISTINCT doc.label ORDER BY doc.label SEPARATOR ', ') as docLabels"),
                DB::raw("GROUP_CONCAT(DISTINCT docUser.text ORDER BY docUser.text SEPARATOR ', ') as docTexts"),
                DB::raw("GROUP_CONCAT(DISTINCT docStatus.name ORDER BY docStatus.name SEPARATOR ', ') as docStatuses"),
                'user.zafiraValidated'
            )
            ->groupBy(
                'customer.idCustomer',
                'user.idUser',
                'user.name',
                'user.zafiraValidated',
                'user.nickname',
                'user.phone',
                'user.email',
                'user.document',
                'user.dateOfBirth',
                'user.gender',
                'user.rg',
                'customerRegisterStatus.name',
                'user.cityId',
                'city.nome',
                'customer.balanceId',
                'balance.balance',
                'balance.tripBalance',
                'customer.profileImage',
                'customer.appVersion',
                'user.platform',
                'user.quantityTrips',
                'user.created_at',
                'user.observation',
                'user.last_lat',
                'user.last_lon',
                'militaryUser.om',
                'militaryStatus.name',
                'militaryForce.name',
                'militaryForceGraduation.patent',
                'militaryForceGraduation.picture',
                'user.zafiraValidated'
            )
            ->get();
    }

    public function show(int $id)
    {
        return $this->getModel()::query()->join('user', 'customer.userId', 'user.idUser')
            ->join('balance', 'customer.balanceId', '=', 'balance.idBalance')
            ->leftJoin('levelAccess', 'user.idUser', '=', 'levelAccess.userId')
            ->leftJoin('userType', 'levelAccess.userTypeId', 'userType.idUserType')
            ->join('config', 'config.key', DB::raw("'link_storage_pictures'"))
            ->leftJoin('city', 'user.cityId', 'city.id')
            ->leftJoin('customerRegisterStatus', 'customer.customerRegisterStatusId', '=', 'customerRegisterStatus.idCustomerRegisterStatus')
            ->select(
                'customer.idCustomer',
                'user.idUser',
                'user.name',
                'user.nickname',
                'user.phone',
                'user.email',
                'user.document',
                'user.dateOfBirth',
                'user.gender',
                'user.rg',
                DB::raw('IF(user.rgFrontPicture = NULL, null, (CONCAT(config.value,\'customer/doc/\', user.rgFrontPicture))) AS rgFrontPicture'),
                DB::raw('IF(user.rgBackPicture = NULL, null, (CONCAT(config.value,\'customer/doc/\', user.rgBackPicture))) AS rgBackPicture'),
                'customerRegisterStatus.name as status',
                'user.cityId',
                'city.nome as city',
                'customer.balanceId',
                'balance.balance as comission',
                'balance.tripBalance as voucherBalance',
                'customer.profileImage',
                'customer.appVersion',
                'user.platform',
                'user.quantityTrips as quantityTripsFinished',
                'user.created_at',
                'user.observation',
                'userType.name as userType',
                'user.zafiraValidated'
            )
            ->where('customer.idCustomer', $id)
            ->first();
    }

    /**
     * @param $userId
     * @return \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Eloquent\Model|object|Customer
     */
    public function findByUser($userId)
    {
        return $this->getModel()
            ::where('userId', $userId)
            ->first();
    }

    public function findAllLocation($cityId)
    {
        return $this->getModel()
            ::join('user', 'customer.userId', '=', 'user.idUser')
            ->join('cityArea', 'cityArea.cityId', DB::raw($cityId))
            ->select(
                'user.last_lat',
                'user.last_lon'
            )
            ->groupBy('customer.idCustomer')
            ->whereRaw('ST_CONTAINS(cityArea.polygon, ST_GeomFromText(ST_AsText(point(user.last_lat, user.last_lon))))')
            ->whereNotNull(['user.last_lat', 'user.last_lon'])
            ->get();
    }

    public function quantityCustomersWithEmail(string $email, ?int $idToIgnore): int
    {
        return ($this->getModel()::query()->select(DB::raw('count(idCustomer) as quantity'))
            ->join('user', 'customer.userId', 'user.idUser')
            ->where('user.email', $email)
            ->where('statusId', StatusConst::ACTIVE)
            ->when(isset($idToIgnore), function (Builder $query) use ($idToIgnore) {
                $query->where('idCustomer', '!=', $idToIgnore);
            })
            ->first())->quantity;
    }

    public function quantityCustomersWithPhone(string $phone, ?int $idToIgnore): int
    {
        return ($this->getModel()::query()->select(DB::raw('count(idCustomer) as quantity'))
            ->join('user', 'customer.userId', 'user.idUser')
            ->where('user.phone', $phone)
            ->where('statusId', StatusConst::ACTIVE)
            ->when(isset($idToIgnore), function (Builder $query) use ($idToIgnore) {
                $query->where('idCustomer', '!=', $idToIgnore);
            })
            ->first())->quantity;
    }

    public function quantityCustomersWithDocument(string $document, ?int $idToIgnore): int
    {
        return ($this->getModel()::query()->select(DB::raw('count(idCustomer) as quantity'))
            ->join('user', 'customer.userId', 'user.idUser')
            ->where('user.document', $document)
            ->where('statusId', StatusConst::ACTIVE)
            ->when(isset($idToIgnore), function (Builder $query) use ($idToIgnore) {
                $query->where('idCustomer', '!=', $idToIgnore);
            })
            ->first())->quantity;
    }

    public function findAllCentralCustomers(array $request = [])
    {
        return $this->getModel()
            ::join('user', 'customer.userId', '=', 'user.idUser')
            ->join('centralUser', function (JoinClause $join) {
                $join->on('centralUser.userId', '=', 'customer.userId')
                    ->where('centralUser.statusId', '=', StatusConst::ACTIVE);
            })
            ->join('central', function (JoinClause $join) {
                $join->on('centralUser.centralId', '=', 'central.id')
                    ->where('central.statusId', '=', StatusConst::ACTIVE);
            })
            ->where('user.statusId', StatusConst::ACTIVE)
            ->when(isset($request['name']), function (Builder $query) use ($request) {
                $query->where('user.name', 'like', '%' . $request['name'] . '%');
            })
            ->select(
                'user.name',
                'user.email',
                'user.idUser',
                'central.name as centralName'
            )
            ->paginate(10);
    }

    public function activeCustomersByCityRegister($cityId) {
        return Customer::selectRaw('count(idCustomer) as customerActives')
        ->join('user', 'user.idUser', '=', 'customer.userId')
        ->where('user.cityId', $cityId)
        ->where('customer.customerRegisterStatusId', 1)
        ->where('user.statusId', 1)
        ->first();
    }
}
