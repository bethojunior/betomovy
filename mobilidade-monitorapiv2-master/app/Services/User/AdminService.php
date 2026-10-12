<?php

namespace App\Services\User;

use App\Constants\Users\UserTypeConst;
use App\Exceptions\User\Admin\EmailAlreadyExistsException;
use App\Models\User\LevelAccess;
use App\Models\User\User;
use App\Repositories\User\AdminRepository;
use App\Utils\Admin704Apps\Admin704Apps;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class AdminService
{
    private $repository;
    private $admin704Apps;
    
    public function __construct(
        AdminRepository $repository,
        Admin704Apps $admin704Apps
    )
    {
        $this->repository = $repository;
        $this->admin704Apps = $admin704Apps;
    }

    public function findAll(): Collection
    {
        return $this->repository->findAll();
    }

    /**
     * @param array $request
     * @return User
     * @throws EmailAlreadyExistsException
     */
    public function store(array $request): User
    {
        $cleanEmail = strtolower(trim($request['email']));
        $userExists = User::whereRaw('LOWER(TRIM(email)) = ?', [$cleanEmail])->first();

        DB::beginTransaction();

        try {
            if ($userExists) {
                $admin = $userExists;
            } else {
                $admin = new User;
            }

            $admin->name     = trim($request['name']);
            $admin->email    = $cleanEmail;
            $admin->password = base64_encode($request['password']);
            $admin->document = onlyCharacters($request['document'] ?? '');
            $admin->nickname = !empty($request['nickname']) ? trim($request['nickname']) : trim($request['name']);
            $admin->blocked  = 0;
            $admin->statusId = \App\Constants\StatusConst::ACTIVE;
            $admin->phone    = onlyCharacters($request['phone'] ?? '');

            $roleId = !empty($request['roleId']) ? (int) $request['roleId'] : 1;
            try {
                $roleExists = DB::table('role')->where('id', $roleId)->exists();
                if (!$roleExists) {
                    if ($roleId == 2) {
                        DB::table('role')->insert(['id' => 2, 'name' => 'Gestor', 'statusId' => 1, 'isRoot' => 0]);
                    } elseif ($roleId == 3) {
                        DB::table('role')->insert(['id' => 3, 'name' => 'Suporte', 'statusId' => 1, 'isRoot' => 0]);
                    } else {
                        $roleId = 1;
                    }
                }
            } catch (\Throwable $t) {
                $roleId = 1;
            }
            $admin->roleId   = $roleId;

            $tokenApi = new \App\Utils\TokenApi();
            $admin->api_token = $tokenApi->generate($admin->idUser ?: rand(1, 999999));

            $admin->save();

            // Ensure LevelAccess for ADMIN (userTypeId = 4)
            LevelAccess::firstOrCreate(
                [
                    'userId'     => $admin->idUser,
                    'userTypeId' => UserTypeConst::ADMIN,
                ]
            );

            // Ensure Partner record exists
            try {
                \App\Models\User\Partner::firstOrCreate(
                    ['userId' => $admin->idUser],
                    [
                        'partnerRegisterStatusId' => 1,
                        'statusId' => \App\Constants\StatusConst::ACTIVE,
                        'api_token' => $admin->api_token,
                    ]
                );
            } catch (\Throwable $t) {
            }

            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return $admin;
    }

    public function findById($id): ?User
    {
        return $this->repository->findById($id);
    }

    public function update($id, array $request): User
    {
        $admin = $this->repository->findById($id);
        
        if (!$admin) {
            throw new \Exception('Usuário não encontrado');
        }

        DB::beginTransaction();

        try {
            $admin->name     = trim($request['name']);
            if (!empty($request['email'])) {
                $admin->email = strtolower(trim($request['email']));
            }
            $admin->document = onlyCharacters($request['document'] ?? '');
            $admin->nickname = !empty($request['nickname']) ? trim($request['nickname']) : trim($request['name']);
            $admin->phone    = onlyCharacters($request['phone'] ?? '');
            if (!empty($request['roleId'])) {
                $admin->roleId = (int)$request['roleId'];
            }
            $admin->blocked = 0;
            $admin->statusId = \App\Constants\StatusConst::ACTIVE;
            
            if (!empty($request['password'])) {
                $admin->password = base64_encode($request['password']);
            }

            $admin->save();

            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return $admin;
    }


    public function getBills($customerName) {
        return $this->admin704Apps->getBillsStatus($customerName);
    }
}
