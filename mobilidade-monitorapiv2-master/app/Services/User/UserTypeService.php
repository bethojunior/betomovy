<?php

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 26/09/2019
 * Time: 17:15
 */

namespace App\Services\User;


use App\Constants\StatusConst;
use App\Exceptions\User\UserTypeException;
use App\Models\User\Doc\DocUserType;
use App\Models\User\UserType;
use App\Repositories\AppPartners\UserTypeLinkedAppPartnerRepository;
use App\Repositories\User\Doc\DocRepository;
use App\Repositories\User\Doc\DocUserTypeRepository;
use App\Repositories\User\UserTypeRepository;
use App\Repositories\User\UserRepository;

class UserTypeService
{
    /**
     * @var UserTypeRepository
     */
    private $repository;
    /**
     * @var DocRepository
     */
    private $docRepository;
    /**
     * @var DocUserTypeRepository
     */
    private $docUserTypeRepository;

    private $userTypeLinkedAppPartnerRepository;

    public function __construct(
        UserTypeRepository $repository,
        DocRepository $docRepository,
        DocUserTypeRepository $docUserTypeRepository,
        UserTypeLinkedAppPartnerRepository $userTypeLinkedAppPartnerRepository
    ) {
        $this->repository = $repository;
        $this->docRepository = $docRepository;
        $this->docUserTypeRepository = $docUserTypeRepository;
        $this->userTypeLinkedAppPartnerRepository = $userTypeLinkedAppPartnerRepository;
    }

    public function findAllActives()
    {
        return $this->repository->findAllActives();
    }

    public function findDriversType()
    {
        return $this->repository
            ->findDriversType();
    }

    /**
     * @param array $request
     * @return UserType
     * @throws UserTypeException
     * @throws \Exception
     */
    public function insert(array $request)
    {
        try {
            \DB::beginTransaction();

            $userType = new UserType($request);
            $userType->isDeliveryMan = false;

            $pictureName = \Storage::cloud()
                ->putFile('userType', $request['picture']);

            if (!$pictureName)
                throw new UserTypeException("Ocorreu um erro ao fazer upload da foto");

            $userType->picture =
                \Storage::cloud()->url($pictureName);

            if (isset($request['isDeliveryMan']))
                $userType->isDeliveryMan = (bool) $request['isDeliveryMan'];

            $userType->isDriver = !$userType->isDeliveryMan;

            $this->repository->save($userType);

            $this->createDocsUsertype($userType);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollBack();
            throw $e;
        }

        return $userType;
    }

    public function updateStatus($id, int $active = 1)
    {
        /** @var UserType $userType */
        $userType = $this->repository
            ->find($id);

        $userType
            ->isActive = $active;

        $this->repository
            ->save($userType);

        return $userType;
    }

    public function delete($id)
    {
        if (!$this->repository->find($id))
            throw new UserTypeException("Tipo de usuário $id não encontrado");

        $users = (new UserRepository())->getByType($id);
        if (!empty($users->toArray()))
            throw new UserTypeException("Existem usuários vinculados à este tipo");

        /** @var UserType $userType */
        $userType = $this->repository
            ->find($id);

        $userType
            ->statusId = StatusConst::REMOVED;

        $this->repository
            ->save($userType);

        return true;
    }

    private function saveAppPartners($listAppPartners, $userTypeId) 
    {
        $existingAppPartners = $this->userTypeLinkedAppPartnerRepository
            ->getAppPartnersByUserTypeId($userTypeId)
            ->pluck('config_apps_partners_id')
            ->toArray();

        if (!empty($listAppPartners)) {
            foreach ($listAppPartners as $appPartner) {
                $responseAppPartner = $this->userTypeLinkedAppPartnerRepository->findUserTypeById($appPartner, $userTypeId);
                if (empty($responseAppPartner)) {
                    $this->userTypeLinkedAppPartnerRepository->create([
                        'userTypeId' => $userTypeId,
                        'config_apps_partners_id' => $appPartner
                    ]);
                }
            }
        }

        $partnersToDelete = array_diff($existingAppPartners, $listAppPartners);

        if (!empty($partnersToDelete)) {
            $this->userTypeLinkedAppPartnerRepository->removeAppsPartnersByUserTypeId($userTypeId, $partnersToDelete);
        }
    }

    /**
     * @param $id
     * @param array $request
     * @return UserType
     * @throws UserTypeException
     */
    public function update($id, array $request)
    {
        $userType = $this->repository
            ->find($id);

        $listAppPartners = $request['idsAppPartners'] ?? [];
        $this->saveAppPartners($listAppPartners, $id);

        if (isset($request['picture'])) {
            $pictureName = \Storage::cloud()
                ->putFile('userType', $request['picture']);

            if (!$pictureName)
                throw new UserTypeException("Ocorreu um erro ao fazer upload da foto");

            $userType->picture =
                \Storage::cloud()->url($pictureName);
        }

        $userType->description = $request['description'] ?? $userType->description;
        $userType->name = $request['name'] ?? $userType->name;
        $userType->vehicleType = $request['vehicleType'] ?? $userType->vehicleType;
        $userType->acceptedText = $request['acceptedText'] ?? $userType->acceptedText;
        $userType->boardingText = $request['boardingText'] ?? $userType->boardingText;
        $userType->inProgressText = $request['inProgressText'] ?? $userType->inProgressText;
        $userType->cancellationText = $request['cancellationText'] ?? $userType->cancellationText;

        if (isset($request['isDeliveryMan']))
            $userType->isDeliveryMan = (bool) $request['isDeliveryMan'];

        $userType->isDriver = !$userType->isDeliveryMan;
        $userType->iconMapDriverId = $request['iconMapDriverId'] ?? $userType->iconMapDriverId;

        $userType->load([
            'userTypeLinkedAppPartner' => function ($query) use ($listAppPartners) {
                $query->whereIn("config_apps_partners_id", $listAppPartners);
            }
        ]);

        $this->repository->save($userType);

        return $userType;
    }

    private function createDocsUsertype(UserType $userType): void
    {
        $docs = $this->docRepository->findAll();

        foreach ($docs as $doc) {
            $docUserType = new DocUserType;

            $docUserType->userTypeId = $userType->idUserType;
            $docUserType->docId = $doc->id;

            $this->docUserTypeRepository->save($docUserType);
        }
    }

    public function moveUsers(int $oldUserTypeId, int $newUserTypeId)
    {
        if (!$this->repository->find($oldUserTypeId))
            throw new UserTypeException("Tipo de Usuário $oldUserTypeId não encontrado");

        if (!UserType::where('idUserType', $newUserTypeId)
            ->where('statusId', StatusConst::ACTIVE)
            ->first())
            throw new UserTypeException("Tipo de Usuário $newUserTypeId não encontrado");

        return $this->repository->moveUsers($oldUserTypeId, $newUserTypeId);
    }
}
