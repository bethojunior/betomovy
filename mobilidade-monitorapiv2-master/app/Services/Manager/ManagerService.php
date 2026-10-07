<?php

namespace App\Services\Manager;

use App\Constants\Manager\ManagerRegisterStatusConst;
use App\Models\Balance\Balance;
use App\Repositories\Manager\ManagerRepository;
use App\Repositories\User\DriverRepository;

class ManagerService
{
    /**
     * @var ManagerRepository
     */
    private $managerRepository;

    public function __construct(ManagerRepository $managerRepository)
    {
        $this->managerRepository = $managerRepository;
    }

    public function getAllManagers(array $request)
    {
        return $this->managerRepository->getAllManagers($request);
    }

    public function insert(array $request)
    {
        $balance = Balance::create();

        return $this->managerRepository->create([
            'userId' => $request['userId'],
            'managerRegisterStatusId' => ManagerRegisterStatusConst::ACTIVE,
            'cityId' => $request['cityId'],
            'valueCommission' => $request['motValueCommission'],
            'valueTypeCommission' => $request['motValueTypeCommission'],
            'partnerCommission' => $request['cliValueCommission'],
            'partnerTypeCommission' => $request['cliValueTypeCommission'],
            'balanceId' => $balance->idBalance,
        ]);
    }

    public function findDrivers(int $id, array $request)
    {
        return $this->managerRepository->findDrivers($id, $request['page'] ?? null);
    }

    public function getManager(int $id)
    {
        return $this->managerRepository->find($id);
    }

    /**
     * @throws \Exception
     */
    public function removeManager(int $id): void
    {
        $manager = $this->managerRepository->find($id);

        if (!$manager) {
            throw new \Exception("Gestor não encontrado");
        }

        $manager->delete();
    }

    public function update(int $id, array $request)
    {
        $manager = $this->managerRepository->find($id);

        if (!$manager) {
            throw new \Exception("Gestor não encontrado");
        }

        $manager->update([
            'cityId' => $request['cityId'] ?? $manager->cityId,
            'valueCommission' => $request['valueCommission'] ?? $manager->valueCommission,
            'valueTypeCommission' => $request['valueTypeCommission'] ?? $manager->valueTypeCommission,
            'partnerCommission' => $request['partnerCommission'] ?? $manager->partnerCommission,
            'partnerTypeCommission' => $request['partnerTypeCommission'] ?? $manager->partnerTypeCommission,
            'userId' => $request['userId'] ?? $manager->userId
        ]);

        return $manager;
    }

    public function getAllManagersSelect()
    {
        return $this->managerRepository->getAllManagersSelect();
    }

    public function verifyUserIsManager(int $id)
    {
        return $this->managerRepository->verifyUserIsManager($id);
    }
}
