<?php


namespace App\Services\ConfigListContacts;

use App\Repositories\ConfigListContacts\ConfigListContactsGeneralRepository;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;

class ConfigListContactsGeneralService
{
    private $repository;

    public function __construct(
        ConfigListContactsGeneralRepository $repository
    ) {
        $this->repository = $repository;
    }

    public function getConfigListContacts()
    {
        $responseListContacts = $this->repository->getConfigListContacts();
        return $responseListContacts;
    }

    public function updateConfigListContact(int $id, array $request)
    {
        $responseConfigListContacts = $this->repository->findConfigListContactById($id);
        if (is_null($responseConfigListContacts)) {
            throw new ResourceNotFoundException('Configuração não encontrada');
        } else {
            $responseConfigListContacts->messageContacts = $request['messageContacts'];
            $this->repository->save($responseConfigListContacts);

            return $responseConfigListContacts;
        }
    }
}
