<?php


namespace App\Services\Establishment;


use App\Constants\StatusConst;
use App\Constants\StatusPaymentConst;
use App\Models\Establishment\EstablishmentBilling;
use App\Repositories\Establishment\EstablishmentBillingRepository;

class EstablishmentBillingService
{
    private $repository;

    public function __construct(EstablishmentBillingRepository $repository)
    {
        $this->repository = $repository;
    }

    public function create(array $request)
    {
        $establishmentBilling = new EstablishmentBilling($request);
        $establishmentBilling->statusPaymentId = StatusPaymentConst::PENDING;
        $establishmentBilling->save();

        return $establishmentBilling;
    }

    public function findAll(array  $request)
    {
        return $this->repository->findAll($request['companyId'] ?? null);
    }

    public function deleteById($id)
    {
        $establishmentBilling = $this->repository->find($id);
        $establishmentBilling->statusId = StatusConst::REMOVED;
        $establishmentBilling->save();

        return $establishmentBilling;
    }

    /**
     * @param $id
     * @return \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model|null
     * @throws \Exception
     */
    public function confirmPayment($id)
    {
        $establishmentBilling = $this->repository->find($id);
        if($establishmentBilling->statusId == StatusConst::REMOVED)
            throw new \Exception("Cobrança invalída");


        if($establishmentBilling->statusPaymentId != StatusPaymentConst::PENDING)
            throw new \Exception("Não é possível confirmar o pagamento da cobrança");

        $establishmentBilling->statusPaymentId = StatusPaymentConst::CONFIRMED;
        $establishmentBilling->save();

        return $establishmentBilling;
    }

    /**
     * @param $id
     * @return \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model|null
     * @throws \Exception
     */
    public function refusePayment($id)
    {
        $establishmentBilling = $this->repository->find($id);
        if($establishmentBilling->statusId == StatusConst::REMOVED)
            throw new \Exception("Cobrança invalída");


        if($establishmentBilling->statusPaymentId != StatusPaymentConst::PENDING)
            throw new \Exception("Não é possível recusar o pagamento da cobrança");

        $establishmentBilling->statusPaymentId = StatusPaymentConst::REFUSED;
        $establishmentBilling->save();

        return $establishmentBilling;
    }
}
