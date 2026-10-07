<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 21/06/2019
 * Time: 22:43
 */

namespace App\Services\Central;


use App\Constants\Central\CentralCustomerConst;
use App\Constants\StatusConst;
use App\Models\Central\CentralCustomer;
use App\Repositories\Central\CentralCustomerRepository;

class CentralCustomerService
{
    /**
     * @var CentralCustomerRepository
     */
    private $repository;

    public function __construct(CentralCustomerRepository $repository)
    {
        $this->repository = $repository;
    }

    public function store($centralId, array $request)
    {
        $customer = new CentralCustomer($request);

        $customer->centralId = $centralId;

        $this->repository->save($customer);

        return $customer;
    }

    public function find($id)
    {
        return $this->repository
            ->find($id);
    }

    public function update($id, array $request)
    {
        /** @var CentralCustomer $customer */
        $customer = $this->repository
            ->find($id);

        $customer->name = $request['name'];
        $customer->phone = $request['phone'];
        $customer->dateOfBirth =
            $request['dateOfBirth'] ?? $customer->dateOfBirth;
        $customer->document =
            $request['document'] ?? $customer->document;

        $this->repository
            ->save($customer);

        return $customer;
    }

    public function delete($id)
    {
        /** @var CentralCustomer $customer */
        $customer = $this->repository
            ->find($id);

        $customer->statusId = StatusConst::REMOVED;

        $this->repository
            ->save($customer);

        return true;
    }

    public function blockOrRelease($id, $action)
    {
        /** @var CentralCustomer $customer */
        $customer = $this->repository
            ->find($id);

        switch ($action) {
            case CentralCustomerConst::BLOCK_ACTION:
                $customer->customerRegisterStatusId = CentralCustomerConst::STATUS_BLOCKED;
                break;
            case CentralCustomerConst::RELEASE_ACTION:
                $customer->customerRegisterStatusId = CentralCustomerConst::STATUS_ACTIVE;
                break;
        }

        $this->repository
            ->save($customer);

        return $customer;
    }
}
