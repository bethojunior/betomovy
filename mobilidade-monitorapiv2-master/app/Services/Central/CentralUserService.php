<?php

namespace App\Services\Central;

use App\Constants\StatusConst;
use App\Constants\Users\PartnerRegisterStatusConst;
use App\Exceptions\Central\CentralUserException;
use App\Models\Central\CentralUser;
use App\Models\User\Partner;
use App\Repositories\Central\CentralUserRepository;
use App\Repositories\User\PartnerRepository;
use App\Repositories\User\UserRepository;
use Illuminate\Support\Facades\DB;

class CentralUserService
{

    private $repository;
    private $partnerRepository;
    private $userRepository;

    public function __construct(
        CentralUserRepository $repository,
        PartnerRepository $partnerRepository,
        UserRepository $userRepository
    ) {
        $this->repository = $repository;
        $this->partnerRepository = $partnerRepository;
        $this->userRepository = $userRepository;
    }

    /**
     * Usuários elegíveis pra vincular como responsável de uma Central
     * (ativos, tipo passageiro, sem roleId de painel, sem relação com driver).
     */
    public function eligible(string $search = null, int $page = 1)
    {
        return $this->userRepository->eligibleForCentral($search, $page);
    }

    public function insertUser(array $request)
    {
        try {
            DB::beginTransaction();

            $centralUserExists = $this->findByCentralUser($request['centralId'], $request['userId']);

            if ($centralUserExists) {
                throw new CentralUserException('Usuário já cadastrado no central.');
            }

            $result = CentralUser::create([
                'centralId' => $request['centralId'],
                'userId' => $request['userId'],
                'isAdmin' => $request['isAdmin']
            ]);

            $partner = $this->partnerRepository->findByUser($request['userId']);
            if (!$partner) {
                Partner::create([
                    'userId' => $request['userId'],
                    'partnerRegisterStatusId' => PartnerRegisterStatusConst::ACTIVE
                ]);
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return $result;
    }

    public function findByCentralUser($centralId, $userId)
    {
        return $this->repository->findByCentralUser($centralId, $userId);
    }

    public function findUsersByCentral(int $centralId)
    {
        return $this->repository->findUsersByCentral($centralId);
    }
}
