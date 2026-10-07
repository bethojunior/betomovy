<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 09/10/2019
 * Time: 17:26
 */

namespace App\Services\Trip;


use App\Constants\StatusConst;
use App\Models\Trip\TripCancellationCustomerFee;
use App\Repositories\Trip\TripCancellationCustomerFeeRepository;
use Illuminate\Support\Facades\Auth;

class TripCancellationCustomerFeeService
{
    /**
     * @var TripCancellationCustomerFeeRepository
     */
    private $repository;

    public function __construct(TripCancellationCustomerFeeRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getAll(array $request = [])
    {
        return $this->repository
            ->getAll($request);
    }

    public function findAll(array $request = [])
    {
        return $this->repository
            ->findAll((Auth::user())->role, $request);
    }

    public function delete($id)
    {
        /** @var TripCancellationCustomerFee $cancellationFee */
        $cancellationFee = $this->repository
            ->find($id);

        $cancellationFee
            ->statusId = StatusConst::REMOVED;

        $this->repository->save($cancellationFee);

        return true;
    }
}
