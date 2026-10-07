<?php

namespace App\Services\User;

use App\Models\User\Customer;
use App\Repositories\User\CustomerRepository;
use App\Traits\Storage\UploadsFilesToS3;

class CustomerProfilePhotoService
{
    use UploadsFilesToS3;

    /**
     * @var CustomerRepository
     */
    private $repository;

    public function __construct(CustomerRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * @param $customerId
     * @param array $request
     * @return Customer
     * @throws \Exception
     */
    public function uploadProfilePhoto($customerId, array $request)
    {
        /** @var Customer $customer */
        $customer = $this->repository->find($customerId);

        if (!$customer)
            throw new \Exception("Cliente não encontrado");

        $oldFileName = $customer->profileImage;
        $fileName = $this->generateFileName($request['image']);

        if ($oldFileName) {
            $this->deleteFile('customer/profile/', $oldFileName);
            $this->deleteFile('customer/profile/compressed/', $oldFileName);
        }

        $this->putFile($request['image'], 'customer/profile/', $fileName);
        $this->putFile($request['imageCompressed'] ?? $request['image'], 'customer/profile/compressed/', $fileName);

        $customer->profileImage = $fileName;

        $this->repository->save($customer);

        return $customer;
    }
}
