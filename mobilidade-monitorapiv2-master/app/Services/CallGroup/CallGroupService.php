<?php

namespace App\Services\CallGroup;

use App\Repositories\CallGroup\CallGroupRepository;
use App\Repositories\CallGroup\DriverLinkedCallGroupRepository;
use App\Repositories\User\DriverRepository;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;

class CallGroupService
{
    /**
     * @var CallGroupRepository
     */
    private $repository;

    /**
     * CallGroupService constructor.
     * @param CallGroupRepository $repository
     */

    private $driverRepository;
    private $driverLinkedCallGroupRepository;

    public function __construct(
        CallGroupRepository $repository,
        DriverRepository $driverRepository,
        DriverLinkedCallGroupRepository $driverLinkedCallGroupRepository
    ) {
        $this->repository = $repository;
        $this->driverRepository = $driverRepository;
        $this->driverLinkedCallGroupRepository = $driverLinkedCallGroupRepository;
    }

    public function getAllCallGroup()
    {
        return $this->repository->all();
    }

    public function addCallGroup(array $request)
    {
        $hasExistCallGroup = $this->repository->verifyExistCallGroupRegistered($request['name'], $request['weight']);

        if (!$hasExistCallGroup) {
            $fileName = time() . '-' . $request['image']->getClientOriginalName();

            $imageCallGroup = Storage::disk('s3')->putFileAs('', $request['image'], $fileName);

            if (!$imageCallGroup) echo "Ocorreu um erro ao fazer upload da imagem";

            $url = env("IMAGE_STORAGE") . $fileName;

            $request['image'] = $url;

            return $this->repository->create($request);
        } else {
            throw new ResourceNotFoundException('Já existe um grupo de chamado com esse nome ou peso.');
        }
    }

    public function updateCallGroup(array $request, $id)
    {
        $responseCallGroup = $this->repository->verifyExistCallGroupById(intval($id));
        $sameWeightRegistered = $this->repository->verifyExistCallGroupByWeight($request['weight']);

        if (is_null($responseCallGroup)) {
            throw new ResourceNotFoundException('Grupo de chamado não encontrado.');
        } else if (!is_null($sameWeightRegistered) && $sameWeightRegistered->id !== intval($id)) {
            throw new ResourceNotFoundException('Já existe um grupo de chamado com esse peso.');
        } else {
            $url = $responseCallGroup->image;

            if (array_key_exists('image', $request) && !is_null($request['image'])) {
                $lastIndexArrayUrlLogo = array_key_last(explode("/", $responseCallGroup->image));
                $oldLogoName = explode("/", $responseCallGroup->image)[$lastIndexArrayUrlLogo];

                Storage::disk('s3')->delete($oldLogoName);

                $fileName = time() . '-' . $request['image']->getClientOriginalName();
                $imageCallGroup = Storage::disk('s3')->putFileAs('', $request['image'], $fileName);

                if (!$imageCallGroup) {
                    echo "Ocorreu um erro ao fazer upload da imagem";
                }

                $url = env("IMAGE_STORAGE") . $fileName;
            }


            $responseCallGroup->id = intval($id);
            $responseCallGroup->name = $request['name'];
            $responseCallGroup->image = $url;
            $responseCallGroup->weight = intval($request['weight']);

            $this->repository->save($responseCallGroup);

            return $responseCallGroup;
        }
    }

    public function deleteCallGroup(int $id)
    {
        $responseCallGroup = $this->repository->verifyExistCallGroupById($id);
        
        if (is_null($responseCallGroup)) {
            throw new ResourceNotFoundException('Grupo de chamado não encontrado.');
        }

        $responseDriverLinked = $this->driverLinkedCallGroupRepository->findCallGroupVinculated($id);

        if(empty($responseDriverLinked)) {
            $lastIndexArrayUrlLogo = array_key_last(explode("/", $responseCallGroup->image));
    
            $nameLogo = explode("/", $responseCallGroup->image)[$lastIndexArrayUrlLogo];
    
            Storage::disk('s3')->delete($nameLogo);
    
            $this->repository->delete($responseCallGroup);
            return $responseCallGroup;
        }

        throw new ResourceNotFoundException('Não é possível deletar um grupo de chamado que já está vinculado a um tipo de motorista ou existem motoristas vinculados a esse grupo.');
    }

    private function verifyExistDriver($idDriver)
    {
        $driverResponse = $this->driverRepository->findDriver($idDriver);

        if (is_null($driverResponse)) {
            throw new ResourceNotFoundException('Motorista não encontrado.');
        }
    }

    private function verifyExistCallGroup($idCallGroup)
    {
        $callGroupResponse = $this->repository->verifyExistCallGroupById((int) $idCallGroup);

        if (is_null($callGroupResponse)) {
            throw new ResourceNotFoundException('Grupo de chamado não encontrado.');
        }
    }

    public function findLinkedDrivers(int $idCallGroup)
    {
        $this->verifyExistCallGroup($idCallGroup);

        $responseDriverLinked = $this->driverLinkedCallGroupRepository->findDriversByCallGroup($idCallGroup);
        return $responseDriverLinked;
    }

    public function linkDriver(array $request)
    {
        $this->verifyExistDriver($request['idDriver']);
        $this->verifyExistCallGroup($request['idCallGroup']);

        $responseDriverLinked = $this->driverLinkedCallGroupRepository->linkDrivers($request['idDriver'], $request['idCallGroup']);
        return $responseDriverLinked;
    }

    public function unlinkDriver(array $request)
    {
        $this->verifyExistDriver($request['idDriver']);
        $this->verifyExistCallGroup($request['idCallGroup']);

        $responseDriverLinked = $this->driverLinkedCallGroupRepository->unlinkDrivers($request['idDriver'], $request['idCallGroup']);
        return $responseDriverLinked;
    }

    public function searchDriver($request)
    {
        $nameDriver   = $request->query('nameDriver');
        $idCallGroup  = intval($request->query('idCallGroup'));

        $nameDriver = !empty(trim($nameDriver ?? ''))
            ? trim($nameDriver)
            : null;

        $this->verifyExistCallGroup($idCallGroup);

        if (is_null($nameDriver)) {
            $responseDriverLinked = $this->driverLinkedCallGroupRepository->findDriversByCallGroup($idCallGroup);
            return $responseDriverLinked;
        }

        $responseDriverLinked = $this->driverLinkedCallGroupRepository->searchDriverByCallGroup($nameDriver, $idCallGroup);
        return $responseDriverLinked;
    }
}
