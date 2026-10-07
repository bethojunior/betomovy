<?php

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/06/2019
 * Time: 10:12
 */

namespace App\Repositories\User;

use App\Constants\Central\CentralConst;
use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Exceptions\Central\CentralException;
use App\Models\Central\CentralCustomer;
use App\Models\User\Customer;
use App\Models\User\User;
use DB;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB as FacadesDB;
use App\Providers\PulseProvider;
use App\Utils\Pulse\GroupIds;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class UserRepository extends AbstractRepository
{
    /**
     * @var PulseProvider
     */
    private $pulseProvider;
    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(User::class);
        $this->pulseProvider = new PulseProvider("central-" . env('APP_NAME', 'laravel'), GroupIds::CENTRAL_PROD);
    }

    public function find($userId, $columns = ['*'])
    {
        return $this->getModel()::find($userId, $columns);
    }

    public function findForAuthProvider($userId)
    {
        /** @var User $user */
        $user = $this->getModel()::where('idUser', $userId)
            ->select([
                'idUser',
                'name',
                'nickname',
                'document',
                'phone',
                'email',
                'password',
                'profilePhoto',
                'bankAccountId',
                'gender',
                'user.created_at',
                'updated_at',
                'roleId',
                'blocked',
                'user.statusId',
                'partner.api_token',
            ])
            ->join('partner', 'partner.userId', '=', 'user.idUser')
            ->whereHas('centralUser', function (Builder $query) {
                $query->where('statusId', StatusConst::ACTIVE);
            })
            ->first();

        return $user;
    }

    public function findByAuth($email, $password)
    {
        /** @var User $user */
        $user = $this->getModel()::where('email', $email)
            ->where('password', $password)
            ->where('statusId', StatusConst::ACTIVE)
            ->where('blocked', 0)
            ->whereHas('centralUser', function (Builder $query) {
                $query
                    ->where('statusId', StatusConst::ACTIVE)
                    ->whereHas('central', function ($query) {
                        $query->where('statusId', StatusConst::ACTIVE);
                    });
            })
            ->with(['centralUser' => function (HasMany $query) {
                $query
                    ->select(['id', 'centralId', 'userId', 'isAdmin'])
                    ->where('statusId', StatusConst::ACTIVE)
                    ->whereHas('central', function ($query) {
                        $query->where('statusId', StatusConst::ACTIVE);
                    })
                    ->with(['central' => function ($query) {
                        $query->where('statusId', StatusConst::ACTIVE);
                    }]);
            }])
            ->first();

        return $user;
    }
    public function findById($id)
    {
        /** @var User $user */
        $user = $this->getModel()::where('idUser', $id)
            ->where('statusId', StatusConst::ACTIVE)
            ->where('blocked', 0)
            ->whereHas('centralUser', function (Builder $query) {
                $query
                    ->where('statusId', StatusConst::ACTIVE)
                    ->whereHas('central', function ($query) {
                        $query->where('statusId', StatusConst::ACTIVE);
                    });
            })
            ->with(['centralUser' => function (HasMany $query) {
                $query
                    ->select(['id', 'centralId', 'userId', 'isAdmin'])
                    ->where('statusId', StatusConst::ACTIVE)
                    ->whereHas('central', function ($query) {
                        $query->where('statusId', StatusConst::ACTIVE);
                    })
                    ->with(['central' => function ($query) {
                        $query->where('statusId', StatusConst::ACTIVE);
                    }]);
            }])
            ->first();

        return $user;
    }

    public function findUserById($id)
    {
        /** @var User $user */
        $user = $this->getModel()::where('idUser', $id)->first();
        return $user;
    }

    public function findByPhoneAndUserType(string $phone, int $userTypeId)
    {
        return $this->getModel()::whereRaw(
            DB::raw(
                "
                       TRIM(
                        REPLACE(
                             REPLACE(
                                 REPLACE(
                                     REPLACE(
                                         REPLACE(`phone`, '+', ''),
                                     ' ', ''),
                                 '(', ''),
                             ')', ''),
                         '-', '')
                       ) LIKE ?
                    "
            ),
            onlyCharacters($phone)
        )
            ->where('statusId', StatusConst::ACTIVE)
            ->where(function (Builder $query) use ($userTypeId) {
                $query
                    ->whereExists(function ($query) use ($userTypeId) {
                        $query->select(DB::raw(1))
                            ->from('levelAccess')
                            ->where('levelAccess.userTypeId', $userTypeId);
                    });
            })
            ->first();
    }

    public function findByEmail($email): ?Model
    {
        return $this->getModel()::where('email', $email)
            ->where('statusId', StatusConst::ACTIVE)
            ->where('blocked', 0)
            ->whereHas('centralUser', function (Builder $query) {
                $query
                    ->where('statusId', StatusConst::ACTIVE)
                    ->whereHas('central', function ($query) {
                        $query->where('statusId', StatusConst::ACTIVE);
                    });
            })
            ->first();
    }

    public function findWithCustomer($id)
    {
        return $this->getModel()::where('idUser', $id)->with('customer')->first();
    }

    public function getToken($userId)
    {
        $token = FacadesDB::table('partner')
            ->where('userId', $userId)
            ->select('api_token')
            ->value('api_token');

        return password_hash($token, PASSWORD_BCRYPT);
    }

    public function getIdUser($centralId)
    {
        return FacadesDB::table('central')
            ->join('user', 'central.responsibleId', '=', 'user.idUser')
            ->where('central.id', $centralId)
            ->select('user.*')
            ->first();
    }

    public function getTokenCentralUserManager($centralId)
    {
        $user = $this->findById($this->getIdUser($centralId)->idUser);
        return [
            'token' => $this->getToken(($user->idUser)),
            'userId' => $user->idUser
        ];
    }

    private function sanitizePhone(string $phone): string
    {
        return preg_replace('/\D/', '', $phone);
    }

    public function findUserByPhone($phone)
    {
        $cleanPhone = $this->sanitizePhone($phone);

        $user = $this->getModel()::whereRaw(
            "REGEXP_REPLACE(phone, '[^0-9]', '') LIKE ?",
            ["%{$cleanPhone}%"]
        )->first();

        if (!$user && strlen($cleanPhone) >= 10) {
            $phoneWithNine = substr($cleanPhone, 0, 2) . '9' . substr($cleanPhone, 2);

            $user = $this->getModel()::whereRaw(
                "REGEXP_REPLACE(phone, '[^0-9]', '') LIKE ?",
                ["%{$phoneWithNine}%"]
            )->first();
        }

        return $user;
    }

    public function findWithCustomerByWpp($phone, $centralId)
    {
        try {
            $IS_APP_PARTNER = filter_var(env('APP_PARTNER', false), FILTER_VALIDATE_BOOLEAN);
            $cleanPhone = $this->sanitizePhone($phone);
            $user = $this->getModel()::whereRaw("REGEXP_REPLACE(phone, '[^0-9]', '') LIKE ?", ["%{$cleanPhone}%"])->first();

            if ($IS_APP_PARTNER) {
                $user = $this->getModel()::whereRaw("REGEXP_REPLACE(phone, '[^0-9]', '') LIKE ?", ["%{$cleanPhone}%"])
                    ->orderByRaw("CASE WHEN key_app_partner IS NOT NULL THEN 0 ELSE 1 END")
                    ->first();
            }

            if (!$user) {
                return null;
            }

            $findCustomerByUserId = Customer::where('userId', $user->idUser)->first();

            if (!$findCustomerByUserId) {
                Customer::create(
                    [
                        'name' => $user->name,
                        'phone' => $user->phone,
                        'customerRegisterStatusId' => 1,
                        'userId' => $user->idUser
                    ]
                );
            }


            $userCustomer = $this->getModel()::whereRaw("REGEXP_REPLACE(phone, '[^0-9]', '') LIKE ?", ["%{$cleanPhone}%"])
                ->whereHas('centralCustomer', function (Builder $query) use ($centralId) {
                    $query->where('centralId', $centralId);
                })
                ->where('statusId', StatusConst::ACTIVE)
                ->select('idUser', 'api_token')
                ->first();

            if ($userCustomer) {
                return $userCustomer;
            }

            $centralCustomer = new CentralCustomer();
            $centralCustomer->centralId = $centralId;
            $centralCustomer->userId = $user->idUser;
            $centralCustomer->name = $user->name;
            $centralCustomer->phone = $user->phone;
            $centralCustomer->dateOfBirth = Carbon::parse($user->dateOfBirth)->format('Y-m-d');
            $centralCustomer->statusId = StatusConst::ACTIVE;
            $centralCustomer->save();

            $userCustomer = $this->getModel()::where('idUser', $centralCustomer->userId)
                ->select('idUser', 'api_token')
                ->first();

            return $userCustomer;
        } catch (\Throwable $th) {
            throw new CentralException("Erro ao buscar usuário pela central: " . $th->getMessage());
        }
    }

    public function registerBySiteForWhatsApp(array $data)
    {
        try {
            FacadesDB::beginTransaction();
            $profileImage = "default.png";

            // try {
            //     $path = Storage::disk('minio')->putFileAs(
            //         'customer/profile/compressed',
            //         $data['image'],
            //         $data['image']->getClientOriginalName()
            //     );
            //     $path2 = Storage::disk('minio')->putFileAs(
            //         'customer/profile',
            //         $data['image'],
            //         $data['image']->getClientOriginalName()
            //     );
            //     $profileImage = Storage::disk('minio')->url($path);
            // } catch (\Exception $e) {
            //     $now = date('H:i:s');
            //     $this->pulseProvider->critical("Erro ao enviar imagem para o minio " . $now, $e->getTraceAsString() . $now);
            // }

            $user = new User();
            $user->name  = $data['name'];
            $user->nickname  = $data['name'];
            $user->email = $data['email'];
            $user->phone = $data['phone'];
            $user->profilePhoto = $profileImage;
            $user->dateOfBirth = Carbon::parse($data['dateOfBirth'])->format('Y-m-d');

            $user->password = base64_encode("no_has_deafult_password");
            $user->statusId = StatusConst::ACTIVE;
            $user->save();

            $customer = new Customer();
            $customer->userId = $user->idUser;
            $customer->name = $data['name'];
            $customer->phone = $data['phone'];
            $customer->profileImage = $profileImage;
            $customer->customerRegisterStatusId = 1;

            $customer->save();

            $centralCustomer = new CentralCustomer();
            $centralCustomer->centralId = $data['centralId'];
            $centralCustomer->userId = $user->idUser;
            $centralCustomer->name = $data['name'];
            $centralCustomer->phone = $data['phone'];
            $centralCustomer->dateOfBirth = Carbon::parse($data['dateOfBirth'])->format('Y-m-d');
            $centralCustomer->statusId = StatusConst::ACTIVE;
            $centralCustomer->save();

            FacadesDB::commit();
            return $user;
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            FacadesDB::rollBack();
            $now = date('H:i:s');
            $this->pulseProvider->critical("Erro ao criar usuário na central " . $now, $e->getTraceAsString() . $now);
            throw new \Exception("Erro ao registrar usuário");
        }
    }
}
