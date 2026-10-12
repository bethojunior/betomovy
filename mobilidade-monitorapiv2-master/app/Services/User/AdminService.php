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
        $userExists = $this->repository->findByEmail($request['email']);

        if ($userExists) {
            throw new EmailAlreadyExistsException;
        }

        DB::beginTransaction();

        try {
            $admin = new User;
            $admin->name     = $request['name'];
            $admin->email    = $request['email'];
            $admin->password = base64_encode($request['password']);
            $admin->document = onlyCharacters($request['document']);
            $admin->nickname = $request['nickname'];
            $admin->blocked  = false;
            $admin->statusId = \App\Constants\StatusConst::ACTIVE;
            $admin->phone    = onlyCharacters($request['phone']);
            $admin->roleId   = $request['roleId'];

            $admin->save();

            LevelAccess::create([
                'userId'     => $admin->idUser,
                'userTypeId' => UserTypeConst::ADMIN,
            ]);

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

        $userExists = $this->repository->findByEmailExceptId($request['email'], $id);
        if ($userExists) {
            throw new EmailAlreadyExistsException;
        }

        DB::beginTransaction();

        try {
            $admin->name     = $request['name'];
            $admin->email    = $request['email'];
            $admin->document = onlyCharacters($request['document']);
            $admin->nickname = $request['nickname'];
            $admin->phone    = onlyCharacters($request['phone']);
            $admin->roleId   = $request['roleId'];
            
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
