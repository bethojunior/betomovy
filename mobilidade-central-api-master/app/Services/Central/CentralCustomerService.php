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
use App\Models\User\Customer;
use App\Models\User\User;
use App\Repositories\Central\CentralCustomerRepository;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB as FacadesDB;
use App\Providers\PulseProvider;
use App\Utils\Pulse\GroupIds;

class CentralCustomerService
{
    /**
     * @var CentralCustomerRepository
     */
    private $repository;
    /**
     * @var PulseProvider
     */
    private $pulseProvider;

    public function __construct(CentralCustomerRepository $repository)
    {
        $this->repository = $repository;
        $this->pulseProvider = new PulseProvider("central-" . env('APP_NAME', 'laravel'), GroupIds::CENTRAL_PROD);
    }

    public function store($centralId, array $request)
    {
        try {
            FacadesDB::beginTransaction();
            
            $profileImage = "default.png";
            $user = new User();
            $user->name  = $request['name'];
            $user->nickname  = $request['name'];
            $user->email = $request['email'];
            $user->phone = $request['phone'];
            if (isset($request['document']) && $request['document'] !== '') {
                $user->document = $request['document'];
            }
            $user->profilePhoto = $profileImage;
            $user->dateOfBirth = Carbon::parse($request['dateOfBirth'])->format('Y-m-d');

            $user->password = base64_encode("no_has_deafult_password");
            $user->statusId = StatusConst::ACTIVE;
            $user->save();

            $customer = new Customer();
            $customer->userId = $user->idUser;
            $customer->name = $request['name'];
            $customer->phone = $request['phone'];
            $customer->customerRegisterStatusId = 1;

            $customer->save();

            $centralCustomer = new CentralCustomer();
            $centralCustomer->centralId = $centralId;
            $centralCustomer->userId = $user->idUser;
            $centralCustomer->name = $request['name'];
            $centralCustomer->phone = $request['phone'];
            if (isset($request['document']) && $request['document'] !== '') {
                $centralCustomer->document = $request['document'];
            }
            $centralCustomer->isCompany = $request['isCompany'] ?? false;
            if (isset($request['dateOfBirth']) && $request['dateOfBirth'] !== '') {
                $centralCustomer->dateOfBirth = Carbon::parse($request['dateOfBirth'])->format('Y-m-d');
            }
            $centralCustomer->statusId = StatusConst::ACTIVE;
            $centralCustomer->save();


            FacadesDB::commit();
            return $centralCustomer;
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            FacadesDB::rollBack();
            $now = date('H:i:s');
            $this->pulseProvider->critical("Erro ao criar usuário na central " . $now, $e->getTraceAsString() . $now);
            throw new \Exception("Erro ao registrar usuário");
        }
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
        $customer->isCompany = $request['isCompany'] ?? $customer->isCompany;

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
