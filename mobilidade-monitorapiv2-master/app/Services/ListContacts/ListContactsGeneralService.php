<?php


namespace App\Services\ListContacts;

use App\Repositories\ListContacts\ListContactsGeneralRepository;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;

class ListContactsGeneralService
{
    private $repository;

    public function __construct(
        ListContactsGeneralRepository $repository
    ) {
        $this->repository = $repository;
    }

    public function addContacts(array $contacts)
    {
        $inserted = [];

        foreach ($contacts as $contact) {
            $exists = $this->repository->where('id_person', $contact['id_person'])->where('phone_person', $contact['phone_person'])->exists();

            if (!$exists) {
                $inserted[] = $this->repository->create([
                    'id_person'               => $contact['id_person'],
                    'name_person'             => $contact['name_person'],
                    'phone_person'            => $contact['phone_person'],
                ]);
            }
        }

        return $inserted;
    }
    
    public function listContacts(array $request)
    {
        return $this->repository->findListContactsWithPagination($request);
    }

    public function deleteContacts(int $id)
    {
        $responseContact = $this->repository->findContactById($id);

        if (is_null($responseContact)) {
            throw new ResourceNotFoundException('Id do contato não encontrado');
        } else {
            $this->repository->delete($responseContact);
            return $responseContact;
        }
    }
}
