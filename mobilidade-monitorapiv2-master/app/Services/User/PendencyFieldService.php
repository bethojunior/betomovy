<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/12/2019
 * Time: 17:43
 */

namespace App\Services\User;


use App\Constants\StatusConst;
use App\Constants\Users\CustomerRegisterStatusConst;
use App\Exceptions\User\PendencyFieldException;
use App\Repositories\User\CustomerRepository;
use App\Repositories\User\PendencyField\PendencyFieldRepository;

class PendencyFieldService
{
    /**
     * @var PendencyFieldRepository
     */
    private $repository;
    /**
     * @var CustomerRepository
     */
    private $customerRepository;

    public function __construct(PendencyFieldRepository $repository,
                                CustomerRepository $customerRepository)
    {
        $this->repository = $repository;
        $this->customerRepository = $customerRepository;
    }

    /**
     * @param array $request
     * @return bool
     * @throws PendencyFieldException
     */
    public function insert(array $request = [])
    {
        foreach ($request['pendencies'] as $pendency) {
            $pendencyExists = $this->repository
                ->findByUserAndPendencyFieldType($pendency['userId'], $pendency['pendencyFieldTypeId']);

            if ($pendencyExists)
                throw new PendencyFieldException(
                    "Essa pendência já existe para esse usuário: ".
                    $pendencyExists->pendencyFieldType->description);
        }

        $userId = $request['pendencies'][0]['userId'];

        $this->repository->createMany($request['pendencies']);

        $pendenciesNotApproved = $this->repository
            ->findNotApprovedByUser($userId);

        if ($pendenciesNotApproved->isNotEmpty())
            $this->updateStatusCustomer(
                $userId, CustomerRegisterStatusConst::PENDING);

        return true;
    }

    public function updateStatus($id, $request)
    {
        $pendencyField = $this->repository
            ->find($id);

        $pendencyField->pendencyFieldStatusId = $request['pendencyFieldStatusId'];

        $this->repository
            ->save($pendencyField);

        $pendenciesNotApproved = $this->repository
            ->findNotApprovedByUser($pendencyField->userId);

        $this->updateStatusCustomer(
            $pendencyField->userId,
            $pendenciesNotApproved->isEmpty() ?
                CustomerRegisterStatusConst::ACTIVE : CustomerRegisterStatusConst::PENDING);

        return $pendencyField;
    }

    /**
     * @param $id
     * @return bool
     */
    public function delete($id)
    {
        $pendencyField = $this->repository
            ->find($id);

        $pendencyField->statusId = StatusConst::REMOVED;

        $this->repository
            ->save($pendencyField);

        $pendenciesNotApproved = $this->repository
            ->findNotApprovedByUser($pendencyField->userId);

        if ($pendenciesNotApproved->isEmpty())
            $this->updateStatusCustomer(
                $pendencyField->userId, CustomerRegisterStatusConst::ACTIVE);

        return true;
    }

    public function findByUser($userId)
    {
        return $this->repository
            ->findByUser($userId);
    }

    private function updateStatusCustomer($userId, $customerRegisterStatusId)
    {
        $customer = $this->customerRepository
            ->findByUser($userId);

        if (!$customer)
            return null;

        $customer->customerRegisterStatusId = $customerRegisterStatusId;

        $this->customerRepository->save($customer);
    }
}
