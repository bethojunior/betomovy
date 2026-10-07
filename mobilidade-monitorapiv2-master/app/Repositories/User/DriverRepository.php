<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/06/2019
 * Time: 10:15
 */

namespace App\Repositories\User;


use App\Constants\PaginationConst;
use App\Constants\StatusConst;
use App\Constants\Trip\TripConst;
use App\Constants\Users\DriverRegisterStatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\User\Driver;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Helpers\PhoneHelper;
use App\Helpers\PlateHelper;
use App\Helpers\FullTextSearchHelper;
use App\Helpers\CityAuthorizationHelper;

class DriverRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(Driver::class);
    }

    public function findAll($user, array $data, $cityId = null)
    {
        $core = $this->findAllCore($user, $data, $cityId);
        $enriched = $this->enrichDrivers($core->getCollection()->pluck('idDriver'))->keyBy('idDriver');

        return $core->setCollection(
            $core->getCollection()->map(fn ($row) => $enriched->get($row->idDriver))
        );
    }

    // Só o necessário pra decidir quais motoristas batem, em que ordem e paginar — sem os JOINs de exibição, que forçavam hash join e quebravam o índice do ORDER BY.
    private function findAllCore($user, array $data, $cityId = null)
    {
        return $this->getModel()::join('user', 'driver.userId', '=', 'user.idUser')
            ->join('levelAccess', 'user.idUser', '=', 'levelAccess.userId')
            ->leftJoin('car', function (JoinClause $join) {
                $join->on('driver.idDriver', '=', 'car.driverId')
                    ->where(function ($query) {
                        $query->whereNull('car.pending')
                            ->orWhere('car.pending', 0);
                    })
                    ->whereNull('car.deleted_at');
            })
            ->where('user.statusId', StatusConst::ACTIVE)
            ->when(isset($data['email']), function (Builder $query) use ($data) {
                $term = FullTextSearchHelper::prepareBooleanQuery($data['email']);
                $query->when($term !== '', function (Builder $query) use ($term) {
                    $query->whereRaw('MATCH(user.email) AGAINST(? IN BOOLEAN MODE)', [$term]);
                });
            })
            ->when(isset($data['name']), function (Builder $query) use ($data) {
                $term = FullTextSearchHelper::prepareBooleanQuery($data['name']);
                $query->when($term !== '', function (Builder $query) use ($term) {
                    $query->whereRaw('MATCH(user.name) AGAINST(? IN BOOLEAN MODE)', [$term]);
                });
            })
            ->when(isset($data['document']), function (Builder $query) use ($data) {
                $digits = preg_replace('/\D/', '', $data['document']);
                $query->where('user.document_digits', 'like', $digits . '%');
            })
            ->when(isset($data['phone']), function (Builder $query) use ($data) {
                $normalizedPhone = PhoneHelper::normalizePhone($data['phone']);
                $query->where('user.phone_digits', 'like', $normalizedPhone . '%');
            })
            ->when(isset($data['driverType']), function (Builder $query) use ($data) {
                $query->where('levelAccess.userTypeId', $data['driverType']);
            })
            ->when(isset($data['carPlate']), function (Builder $query) use ($data) {
                $normalizedPlate = PlateHelper::normalizePlate($data['carPlate']);
                $query->where('car.plate_normalized', 'like', $normalizedPlate . '%');
            })
            ->when(isset($data['driverRegisterStatusId']), function (Builder $query) use ($data) {
                $query->where('driver.driverRegisterStatusId', $data['driverRegisterStatusId']);
            })
            ->when(!$user->role->support, function (Builder $query) use ($cityId) {
                CityAuthorizationHelper::restrictToCity($query, $cityId, 'driver.cityId');
            })
            ->select('driver.idDriver')
            ->orderByDesc('driver.idDriver')
            ->paginate($data['per_page'] ?? 10);
    }

    // Traz os campos de exibição só pros IDs já decididos pelo findAllCore — join pesado, mas em cima de poucas linhas (a página atual).
    private function enrichDrivers($driverIds)
    {
        // leftJoin: findAllCore() não exige essas FKs, inner join aqui sumia com o motorista no map().
        return $this->getModel()::join('user', 'driver.userId', '=', 'user.idUser')
            ->leftJoin('driverRegisterStatus', 'driver.driverRegisterStatusId', '=', 'driverRegisterStatus.idDriverRegisterStatus')
            ->leftJoin('balance', 'driver.balanceId', '=', 'balance.idBalance')
            ->join('levelAccess', 'user.idUser', '=', 'levelAccess.userId')
            ->leftJoin('userType', 'levelAccess.userTypeId', '=', 'userType.idUserType')
            ->leftJoin('car', function (JoinClause $join) {
                $join->on('driver.idDriver', '=', 'car.driverId')
                    ->where(function ($query) {
                        $query->whereNull('car.pending')
                            ->orWhere('car.pending', 0);
                    })
                    ->whereNull('car.deleted_at');
            })
            ->leftJoin('city', 'driver.cityId', '=', 'city.id')
            ->leftJoin('estate', 'city.estado', '=', 'estate.id')
            ->leftJoin('station', 'driver.stationId', '=', 'station.idStation')
            ->leftJoin('militaryUser', 'user.idUser', '=', 'militaryUser.userId')
            ->leftJoin('militaryStatus', 'militaryUser.militaryStatusId', '=', 'militaryStatus.id')
            ->leftJoin('militaryForceGraduation', 'militaryUser.militaryGraduationId', '=', 'militaryForceGraduation.id')
            ->leftJoin('hours_worked_driver as hwd', function (JoinClause $join) {
                $join->on('driver.idDriver', '=', 'hwd.driverId')
                    ->whereDate('hwd.date', '=', DB::raw('CURDATE()'));
            })
            ->leftJoin('limit_hours_worked as lhw', 'lhw.driverId', '=', 'driver.idDriver')
            ->leftJoin('militaryForce', 'militaryUser.militaryForceId', '=', 'militaryForce.id')
            ->leftJoin('cityConfig', 'cityConfig.cityId', '=', 'driver.cityId')
            ->leftJoin('config as negativeBalanceConfig', 'negativeBalanceConfig.key', DB::raw("'max_amount_for_receipt_in_vehicle'"))
            ->whereIn('driver.idDriver', $driverIds)
            ->select(
                'driver.idDriver',
                'user.name',
                'user.nickname',
                'user.phone',
                'user.document',
                'driverRegisterStatus.name as registerStatus',
                'driver.driverRegisterStatusId',
                'user.email',
                'city.nome as city',
                'estate.sigla as state',
                'user.idUser',
                'balance.balance',
                'balance.blockedBalance',
                'levelAccess.userTypeId',
                'userType.name as userType',
                'user.rating',
                'user.gender',
                'user.created_at',
                'user.observation',
                'station.name as station',
                'driver.profileImage',
                'driver.proofOfResidence',
                'driver.alvara',
                'user.rg',
                'user.rgFrontPicture',
                'user.rgBackPicture',
                'car.plate as carPlate',
                'car.brand as carBrand',
                'car.model as carModel',
                'car.year as carYear',
                'car.color as carColor',
                'driver.cityId',
                'driver.prepaid',
                'driver.appVersion',
                'user.platform',
                'militaryUser.om',
                'militaryStatus.name as militaryStatus',
                'militaryForce.name as militaryForce',
                'militaryForceGraduation.patent as militaryPatent',
                'militaryForceGraduation.picture as militaryPatentPicture',
                'hwd.hours as hours_worked',
                'lhw.hours as hours_open',
                DB::raw('CAST(COALESCE(cityConfig.maximumAmountNegativeBalanceDriver, negativeBalanceConfig.value) AS DOUBLE) as maximumAmountNegativeBalanceDriver'),
                'user.zafiraValidated'
            )
            ->get();
    }

    public function findAllDelivery(array $request, $user, int $cityId = null): Collection
    {
        return $this->getModel()::query()->join('user', 'driver.userId', 'user.idUser')
            ->join('driverRegisterStatus', 'driver.driverRegisterStatusId', 'driverRegisterStatus.idDriverRegisterStatus')
            ->join('levelAccess', 'user.idUser', 'levelAccess.userId')
            ->join('userType', 'levelAccess.userTypeId', 'userType.idUserType')
            ->leftJoin('iconMapDriver', 'userType.iconMapDriverId', 'iconMapDriver.id')
            ->leftJoin('city', 'driver.cityId', 'city.id')
            ->where('userType.isDeliveryMan', true)
            ->when(isset($cityId), function (Builder $query) use ($cityId) {
                $query->where('city.id', $cityId);
            })
            ->select(
                'idDriver',
                'driver.userId',
                'user.name',
                'user.nickname',
                'user.document',
                'user.phone',
                'user.email',
                'driver.last_lat as latitude',
                'driver.last_lon as longitude',
                'driver.status',
                'driverRegisterStatus.name as driverRegisterStatus',
                'levelAccess.userTypeId',
                'userType.name as userType',
                'iconMapDriver.link as iconMapDriver',
                'driver.cityId',
                'city.nome as city'
            )
            ->get();
    }

    public function getStationsByDriver($driverId)
    {
        return DB::table('driverStation as ds')
            ->join('station as s', 'ds.stationId', '=', 's.idStation')
            ->where('ds.driverId', $driverId)
            ->select(
                'ds.idDriverStation',
                'ds.driverId',
                'ds.stationId',
                'ds.statusId',
                's.idStation',
                's.name',
                's.stationTypeId',
                's.cityId',
                's.latitude',
                's.longitude',
                's.address',
                's.official',
                's.created_at'
            )
            ->get();
    }

    public function findFully($id): ?Driver
    {
        /** @var Driver $driver */
        $driver = $this->getQuery()
            ->where('idDriver', $id)
            ->join('user', 'driver.userId', '=', 'idUser')
            ->join('driverRegisterStatus', 'driverRegisterStatusId', '=', 'idDriverRegisterStatus')
            ->join('balance', 'driver.balanceId', '=', 'idBalance')
            ->join('levelAccess', 'levelAccess.userId', '=', 'idUser')
            ->join('userType', 'levelAccess.userTypeId', '=', 'idUserType')
            ->leftJoin('bankAccount', 'bankAccountId', '=', 'idBankAccount')
            ->leftJoin('bank', 'bankId', '=', 'idBank')
            ->leftJoin('car', function (JoinClause $join) {
                $join->on('driver.idDriver', '=', 'car.driverId')
                    ->where(function ($query) {
                        $query->whereNull('car.pending')
                            ->orWhere('car.pending', 0);
                    })
                    ->whereNull('car.deleted_at');
            })
            ->leftJoin('militaryUser', 'militaryUser.userId', '=', 'idUser')
            ->leftJoin('militaryForce', 'militaryForceId', '=', 'militaryForce.id')
            ->leftJoin('militaryForceGraduation', 'militaryGraduationId', '=', 'militaryForceGraduation.id')
            ->leftJoin('militaryStatus', 'militaryStatusId', '=', 'militaryStatus.id')
            ->leftJoin('docStatus', 'driver.profileImageStatusId', '=', 'docStatus.id')
            ->with([
                'docsUser' => function (HasManyThrough $query) {
                    $query
                        ->join('docStatus', 'docStatusId', '=', 'docStatus.id')
                        ->join('doc', 'docId', '=', 'doc.id')
                        ->select(
                            'docUser.id',
                            'docUser.docId',
                            'docUser.text',
                            'userId',
                            'docUser.image',
                            'docUser.pdf',
                            'docStatus.name AS docStatus',
                            'doc.label',
                            'doc.description',
                            'doc.text AS isText',
                            'doc.image AS isImage'
                        );
                },
                'driverSplitConfig' => function (HasOne $query) {
                    $query
                        ->select(
                            'id',
                            'driverId',
                            'financialIntermediaryId',
                            'externalId',
                            'status'
                        );
                },
                'driverAddress' => function (HasOne $query) {
                    $query
                        ->select(
                            'id',
                            'driverId',
                            'zipCode',
                            'street',
                            'number',
                            'neighborhood',
                            'complement',
                            'city',
                            'state'
                        );
                },
            ])
            ->selectRaw("
                idDriver,
                user.idUser,
                driver.cityId,
                user.name,
                user.nickname,
                user.document,
                user.phone,
                user.email,
                user.gender,
                user.bankAccountId,
                user.dateOfBirth,
                driver.stationId,
                driver.userId,
                levelAccess.userTypeId,
                userType.name AS userType,
                balance.balance,
                balance.blockedBalance,
                driver.cnhPicture,
                driver.crlvPicture,
                driver.alvaraPicture,
                driver.profileImage,
                driver.profileImageTemp,
                driver.profileImageStatusId,
                docStatus.name AS profileImageStatus,
                driver.criminalRecordPicture,
                driver.criminalRecord,
                driver.proofOfResidence,
                driver.status,
                driverRegisterStatus.name AS registerStatus,
                driver.driverRegisterStatusId,
                driver.last_lat AS latitude,
                driver.last_lon AS longitude,
                driver.cnh,
                driver.crlv,
                driver.alvara,
                driver.preAvailable,
                driver.prepaid,
                bankAccount.holderName,
                bankAccount.document AS bankAccountDocument,
                bankAccount.typeAccount,
                bankAccount.agency,
                bankAccount.agencyDigit,
                bankAccount.numberAccount,
                bankAccount.numberAccountDigit,
                bankAccount.op,
                bankAccount.bankId,
                bankAccount.pix,
                bankAccount.pixType,
                bank.bankNumber,
                bank.bankName,
                user.created_at,
                user.observation,
                car.idCar,
                car.year AS year,
                car.plate AS plate,
                car.model AS model,
                car.color AS color,
                car.brand AS brand,
                car.renavam AS renavam,
                car.seatsNumber AS seatsNumber,
                car.rentalCar,
                car.rentalCompanyDocument,
                militaryUser.om,
                militaryForce.name AS militaryForce,
                militaryForceGraduation.patent,
                militaryForceGraduation.picture AS patentPicture,
                militaryStatus.name AS militaryStatus,
                user.zafiraValidated
            ")
            ->first();

        return $driver;
    }

    public function findOneActive(int $driverId, array $with = []): ?Driver
    {
        /** @var Driver $result */
        $result = $this->getQuery()
            ->where('idDriver', $driverId)
            ->whereHas('user', function (Builder $query) {
                $query
                    ->where('statusId', StatusConst::ACTIVE);
            })
            ->with($with)
            ->first();

        return $result;
    }

    public function findDriver(int $driverId): ?Driver
    {
        /** @var Driver $result */
        $result = $this->getQuery()->where('idDriver', $driverId)->first();

        return $result;
    }

    public function linkedDriver(int $driverId, int $callGroupId)
    {
        return $this->getModel()
            ::where('idDriver', $driverId)->update(['call_group_id' => $callGroupId]);
    }

    public function findPosition($id)
    {
        return $this->find($id, [
            'idDriver',
            'status',
            'last_lat AS latitude',
            'last_lon AS longitude'
        ]);
    }

    public function findByCentral($centralId)
    {
        return $this->getModel()
            ::whereHas('central', function (Builder $query) use ($centralId) {
                $query
                    ->where('statusId', StatusConst::ACTIVE)
                    ->where('centralId', $centralId);
            })
            ->select([
                'idDriver',
                'profileImage',
                'last_lat AS latitude',
                'last_lon AS longitude',
                'driverRegisterStatusId',
                'status',
                'userId'
            ])
            ->with(['user' => function (BelongsTo $query) {
                $query
                    ->select([
                        'idUser',
                        'name',
                        'nickname',
                        'email',
                        'phone'
                    ]);
            }])
            ->paginate(PaginationConst::LIMIT_PER_PAGE);
    }

    public function findWithActiveTrips($driverId)
    {
        return $this->getModel()
            ::where('idDriver', $driverId)
            ->select([
                'driver.*'
            ])
            ->with(['trips' => function (HasMany $query) {
                $query
                    ->join('tripPaymentForm', 'tripPaymentFormId', '=', 'idTripPaymentForm')
                    ->join('tripType', 'tripTypeId', '=', 'idTripType')
                    ->join('tripAudit', 'tripAuditId', '=', 'id')
                    ->join('city', 'cityId', '=', 'city.id')
                    ->join('user', 'userId', '=', 'idUser')
                    ->select([
                        'idTrip',
                        'tripReference',
                        'date',
                        'endDate',
                        'price',
                        'driverId',
                        'userId',
                        'tripTypeId',
                        'status',
                        'canceledBy',
                        'tripPaymentForm.name AS tripPaymentForm',
                        'tripType.type AS tripType',
                        'situation',
                        'originId',
                        'destinationId',
                        'centralCustomerId',
                        'trip.cityId',
                        'nome AS cityName',
                        'nickname AS customerName',
                    ])
                    ->with([
                        'origin' => function (BelongsTo $query) {
                            $query
                                ->select([
                                    'idOrigin',
                                    'address',
                                    'neighborhood',
                                    'latitude',
                                    'longitude',
                                ]);
                        },
                        'destination' => function (BelongsTo $query) {
                            $query
                                ->select([
                                    'idDestination',
                                    'address',
                                    'neighborhood',
                                    'latitude',
                                    'longitude',
                                ]);
                        },
                        'tripWayPoints' => function (HasMany $query) {
                            $query
                                ->select([
                                    'tripReference',
                                    'latitude',
                                    'longitude',
                                    'address',
                                ]);
                        },
                        'customer' => function (BelongsTo $query) {
                            $query
                                ->join('central', 'centralId', '=', 'id')
                                ->select([
                                    'centralCustomer.id',
                                    'centralCustomer.name AS name',
                                    'centralCustomer.name AS nickname',
                                    'phone',
                                    'logo AS profileImage',
                                ]);
                        }
                    ])
                    ->whereNotIn('status', [
                        TripConst::FINISHED, TripConst::CANCELED
                    ])
                    ->orderBy('idTrip');
            }])
            ->get();
    }

    public function findByUserTypeId($userTypeId)
    {
        return $this->getModel()
            ::whereHas('user', function (Builder $query) use ($userTypeId) {
                $query
                    ->whereHas('userType', function (Builder $query) use ($userTypeId) {
                        $query
                            ->where('idUserType', $userTypeId);
                    });
            })
            ->with('balance')
            ->get();
    }

    public function findByUser($userId)
    {
        return $this->getModel()
            ::where('userId', $userId)
            ->first();
    }

    public function updateDriversPrepaid(bool $prepaid)
    {
        return $this->getModel()
            ::whereHas('user', function (Builder $query) {
                $query->where('statusId', StatusConst::ACTIVE);
            })
            ->update(['prepaid' => $prepaid]);
    }

    public function quantityDriversWithEmail(string $email, int $idToIgnore = null)
    {
        return (Driver::select(DB::raw('count(idDriver) as quantity'))
            ->join('user', 'user.idUser', 'driver.userId')
            ->where('user.email', $email)
            ->where('user.statusId', StatusConst::ACTIVE)
            ->when(isset($idToIgnore), function (Builder $query) use ($idToIgnore) {
                $query->where('idDriver', '!=', $idToIgnore);
            })
            ->first())->quantity;
    }

    public function findAllWithBalanceByCity(int $cityId)
    {
        return $this->getModel()::join('balance', 'driver.balanceId', 'balance.idBalance')
            ->join('user', 'driver.userId', 'user.idUser')
            ->where('driver.cityId', $cityId)
            ->where('user.statusId', StatusConst::ACTIVE)
            ->where(function (Builder $query) {
                $query->where('balance.balance', '<>', 0)
                    ->orWhere('balance.blockedBalance', '<>', 0)
                    ->orWhere('balance.blockedBalanceToPay', '<>', 0);
            })
            ->get();
    }

    public function resetRating(int $id = null, int $cityId = null): bool
    {
        return (bool)$this->getModel()::join('user', 'driver.userId', 'user.idUser')
            ->when(isset($id), function (Builder $query) use ($id) {
                $query->where('driver.idDriver', $id);
            })
            ->when(isset($cityId), function (Builder $query) use ($cityId) {
                $query->where('driver.cityId', $cityId);
            })
            ->update(['user.rating' => 5]);
    }

    public function changeStatus($id, $status)
    {
        return $this->getModel()::where('idDriver', $id)
            ->update(['driverRegisterStatusId' => $status]);
    }

    public function getAll($user, array $data, $cityId = null)
    {
        return $this->getModel()::join('user as uadm', 'uadm.idUser', '=', DB::raw($user->idUser))
            ->join('role', 'role.id', 'uadm.roleId')
            ->join('user', 'driver.userId', '=', 'user.idUser')
            ->join('driverRegisterStatus', 'driver.driverRegisterStatusId', '=', 'driverRegisterStatus.idDriverRegisterStatus')
            ->join('balance', 'driver.balanceId', '=', 'balance.idBalance')
            ->join('levelAccess', 'user.idUser', '=', 'levelAccess.userId')
            ->join('userType', 'levelAccess.userTypeId', '=', 'userType.idUserType')
            ->leftJoin('car', 'driver.idDriver', '=', 'car.driverId')
            ->leftJoin('station', 'driver.stationId', '=', 'station.idStation')
            ->leftJoin('militaryUser', 'user.idUser', '=', 'militaryUser.userId')
            ->leftJoin('militaryStatus', 'militaryUser.militaryStatusId', '=', 'militaryStatus.id')
            ->leftJoin('militaryForceGraduation', 'militaryUser.militaryGraduationId', '=', 'militaryForceGraduation.id')
            ->leftJoin('militaryForce', 'militaryUser.militaryForceId', '=', 'militaryForce.id')
            ->where('user.statusId', StatusConst::ACTIVE)
            ->where(function (Builder $query) {
                $query->whereNull('car.pending')
                    ->orWhere('car.pending', 0);
            })
            ->whereNull('car.deleted_at')
            ->when(isset($data['email']), function (Builder $query) use ($data) {
                $query->where('user.email', 'like', '%' . $data['email'] . '%');
            })
            ->when(isset($data['name']), function (Builder $query) use ($data) {
                $query->where('user.name', 'like', '%' . $data['name'] . '%');
            })
            ->when(isset($data['document']), function (Builder $query) use ($data) {
                $query->where('user.document', 'like', '%' . $data['document'] . '%');
            })
            ->when(isset($data['phone']), function (Builder $query) use ($data) {
                $normalizedPhone = PhoneHelper::normalizePhone($data['phone']);
                $query->whereRaw(
                    "REPLACE(REPLACE(REPLACE(REPLACE(user.phone, '(', ''), ')', ''), '-', ''), ' ', '') LIKE ?",
                    ['%' . $normalizedPhone . '%']
                );
            })
            ->when(isset($data['driverType']), function (Builder $query) use ($data) {
                $query->where('levelAccess.userTypeId', $data['driverType']);
            })
            ->when(isset($data['carPlate']), function (Builder $query) use ($data) {
                $normalizedPlate = PlateHelper::normalizePlate($data['carPlate']);
                $query->whereRaw(
                    "REPLACE(REPLACE(UPPER(car.plate), '-', ''), ' ', '') LIKE ?",
                    ['%' . $normalizedPlate . '%']
                );
            })
            ->where(function (Builder $query) use ($cityId) {
                $query->where('role.support', '=', 1);
                $query->when(isset($cityId), function (Builder $query) use ($cityId) {
                    $query->orWhere('driver.cityId', $cityId);
                });
            })
            ->select(
                'driver.idDriver',
                'user.name',
                'user.nickname',
                'user.phone',
                'user.document',
                'driverRegisterStatus.name as registerStatus',
                'driver.driverRegisterStatusId',
                'user.email',
                'user.idUser',
                'balance.balance',
                'balance.blockedBalance',
                'levelAccess.userTypeId',
                'userType.name as userType',
                'user.rating',
                'user.gender',
                'user.created_at',
                'station.name as station',
                'driver.profileImage',
                'driver.proofOfResidence',
                'driver.alvara',
                'user.rg',
                'user.rgFrontPicture',
                'user.rgBackPicture',
                'car.plate as carPlate',
                'car.brand as carBrand',
                'car.model as carModel',
                'driver.cityId',
                'driver.prepaid',
                'driver.appVersion',
                'user.platform',
                'militaryUser.om',
                'militaryStatus.name as militaryStatus',
                'militaryForce.name as militaryForce',
                'militaryForceGraduation.patent as militaryPatent',
                'militaryForceGraduation.picture as militaryPatentPicture',
                'user.zafiraValidated'
            )
            ->orderBy('balance.balance')
            ->get();
    }

    public function allWithPositions(array $status, ?int $cityId = null): Collection
    {
        $user = Auth::user();

        return $this->getQuery()
            ->join('user AS u', 'driver.userId', '=', 'u.idUser')
            ->join('user AS uadm', 'uadm.idUser', '=', DB::raw($user->idUser))
            ->join('levelAccess AS la', 'la.userId', '=', 'u.idUser')
            ->join('userType AS ut', 'ut.idUserType', '=', 'la.userTypeId')
            ->join('driverRegisterStatus AS dr', 'dr.idDriverRegisterStatus', '=', 'driver.driverRegisterStatusId')
            ->join('cityArea AS ca', function (JoinClause $query) use ($cityId, $user) {
                $query
                    ->on('ca.cityId', '=', DB::raw($cityId))
                    ->whereIn('ca.cityId', function ($query) use ($user) {
                        $query->select('rc.cityId')
                            ->from('roleCity AS rc')
                            ->where('rc.roleId', $user->roleId);
                    })
                    ->where('ca.statusId', '=', StatusConst::ACTIVE) // 1 = ATIVO
                    ->whereRaw("ST_Contains(ca.polygon, ST_GeomFromText(CONCAT('POINT(',driver.last_lat, ' ', driver.last_lon, ')'))) = 1");
            })
            ->whereIn('status', $status)
            ->where('u.statusId', '=', StatusConst::ACTIVE)
            ->select(
                'driver.idDriver',
                'driver.userId',
                'driver.last_position_update AS updatedAt', 
                'driver.status',
                'driver.last_lat AS latitude',
                'driver.last_lon AS longitude',
                'driver.profileImage',
                'u.name',
                'u.phone',
                'u.nickname',
                'la.userTypeId',
                'ut.name AS userType',
                'driver.driverRegisterStatusId',
                'dr.name AS driverRegisterStatus',
                'u.rating'
            )
            ->get();
    }

    public function findAllWithoutPage($user, array $data, $cityId = null)
    {
        return $this->getModel()::join('user as uadm', 'uadm.idUser', '=', DB::raw($user->idUser))
            ->join('role', 'role.id', 'uadm.roleId')
            ->join('user', 'driver.userId', '=', 'user.idUser')
            ->join('driverRegisterStatus', 'driver.driverRegisterStatusId', '=', 'driverRegisterStatus.idDriverRegisterStatus')
            ->join('balance', 'driver.balanceId', '=', 'balance.idBalance')
            ->join('levelAccess', 'user.idUser', '=', 'levelAccess.userId')
            ->join('userType', 'levelAccess.userTypeId', '=', 'userType.idUserType')
            ->leftJoin('car', function (JoinClause $join) {
                $join->on('driver.idDriver', '=', 'car.driverId')
                    ->where(function ($query) {
                        $query->whereNull('car.pending')
                            ->orWhere('car.pending', 0);
                    })
                    ->whereNull('car.deleted_at');
            })
            ->leftJoin('city', 'driver.cityId', '=', 'city.id')
            ->leftJoin('estate', 'city.estado', '=', 'estate.id')
            ->leftJoin('station', 'driver.stationId', '=', 'station.idStation')
            ->leftJoin('militaryUser', 'user.idUser', '=', 'militaryUser.userId')
            ->leftJoin('militaryStatus', 'militaryUser.militaryStatusId', '=', 'militaryStatus.id')
            ->leftJoin('militaryForceGraduation', 'militaryUser.militaryGraduationId', '=', 'militaryForceGraduation.id')
            ->leftJoin('militaryForce', 'militaryUser.militaryForceId', '=', 'militaryForce.id')
            ->where('user.statusId', StatusConst::ACTIVE)
            ->when(isset($data['email']), function (Builder $query) use ($data) {
                $query->where('user.email', 'like', '%' . $data['email'] . '%');
            })
            ->when(isset($data['name']), function (Builder $query) use ($data) {
                $query->where('user.name', 'like', '%' . $data['name'] . '%');
            })
            ->when(isset($data['document']), function (Builder $query) use ($data) {
                $query->where('user.document', 'like', '%' . $data['document'] . '%');
            })
            ->when(isset($data['phone']), function (Builder $query) use ($data) {
                $query->where('user.phone', 'like', '%' . $data['phone'] . '%');
            })
            ->when(isset($data['driverType']), function (Builder $query) use ($data) {
                $query->where('levelAccess.userTypeId', $data['driverType']);
            })
            ->when(isset($data['carPlate']), function (Builder $query) use ($data) {
                $query->where('car.plate', 'like', '%' . $data['carPlate'] . '%');
            })
            ->when(isset($data['driverRegisterStatusId']), function (Builder $query) use ($data) {
                $query->where('driver.driverRegisterStatusId', $data['driverRegisterStatusId']);
            })
            ->where(function (Builder $query) use ($cityId) {
                $query->where('role.support', '=', 1);
                $query->when(isset($cityId), function (Builder $query) use ($cityId) {
                    $query->orWhere('driver.cityId', $cityId);
                });
            })
            ->select(
                'driver.idDriver',
                'user.name',
                'user.nickname',
                'user.phone',
                'user.document',
                'driverRegisterStatus.name as registerStatus',
                'driver.driverRegisterStatusId',
                'user.email',
                'city.nome as city',
                'estate.sigla as state',
                'user.idUser',
                'balance.balance',
                'balance.blockedBalance',
                'levelAccess.userTypeId',
                'userType.name as userType',
                'user.rating',
                'user.gender',
                'user.created_at',
                'user.observation',
                'station.name as station',
                'driver.profileImage',
                'driver.proofOfResidence',
                'driver.alvara',
                'user.rg',
                'user.rgFrontPicture',
                'user.rgBackPicture',
                'car.plate as carPlate',
                'car.brand as carBrand',
                'car.model as carModel',
                'driver.cityId',
                'driver.prepaid',
                'driver.appVersion',
                'user.platform',
                'militaryUser.om',
                'militaryStatus.name as militaryStatus',
                'militaryForce.name as militaryForce',
                'militaryForceGraduation.patent as militaryPatent',
                'militaryForceGraduation.picture as militaryPatentPicture',
                'user.zafiraValidated'
            )
            ->orderByDesc('driver.idDriver')
            ->get();
    }


    public function activeDriversByCityRegister($cityId)
    {
        return Driver::selectRaw('count(idDriver) as driversActives')
            ->join('user', 'user.idUser', '=', 'driver.userId')
            ->where('driver.cityId', $cityId)
            ->where('user.statusId', StatusConst::ACTIVE)
            ->where('driver.driverRegisterStatusId', DriverRegisterStatusConst::ACTIVE)
            ->first();
    }

    public function getDriversById($driverIds)
    {
        return $this->getModel()::
        whereIn('idDriver', $driverIds)
        ->with('user')
        ->get();
    }
    public function getDriversByUserIds($userIds)
    {
        return $this->getModel()::
        whereIn('userId', $userIds)
        ->with('user')
        ->get();
    }

    public function updateManyByIds(Collection $drivers, array $attributes): int
    {
        if ($drivers->isEmpty()) {
            return 0;
        }

        return $this->getModel()
            ::whereIn('idDriver', $drivers->pluck('idDriver'))
            ->update($attributes);
    }

    public function findOne($driverId)
    {
        $result = $this->getQuery()
            ->where('idDriver', $driverId)
            ->with('user')
            ->first();

        if(!$result) return [];

        return [
            'idUser' => $result->user->idUser,
            'driverId' => $result->idDriver,
            'name' => $result->user->name,
            'nickname' => $result->user->nickname,
            'document' => $result->user->document,
            'phone' => $result->user->phone,
            'email' => $result->user->email,
            'dateOfBirth' => $result->user->dateOfBirth,
            'profilePhoto' => $result->profileImage,
            'gender' => $result->user->gender,
        ];
    }
}


