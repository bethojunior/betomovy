<?php


namespace App\Services\Contact;


use App\Repositories\Contact\ContactUsRepository;

class ContactUsService
{
    private $repository;

    public function __construct(ContactUsRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll(array $request, int $cityId)
    {
        return $this->repository->findAll($request, $cityId);
    }
}
