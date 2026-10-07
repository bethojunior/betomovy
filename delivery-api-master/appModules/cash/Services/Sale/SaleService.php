<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/03/2020
 * Time: 09:18
 */

namespace Cash\Services\Sale;


use App\Models\User;
use Cash\Repositories\Sale\SaleRepository;

class SaleService
{
    /**
     * @var SaleRepository
     */
    private $repository;

    public function __construct(SaleRepository $repository)
    {
        $this->repository = $repository;
    }

    public function find($secondaryId)
    {
        $sale = $this->repository
            ->findFullyBySecondaryId($secondaryId);

        $sale->merchant->logoPicture =
            $sale->merchant->logoPicture ?
                \Storage::cloud()->url($sale->merchant->logoPicture) :
                null;

        return $sale;
    }

    public function findAll(User $user, array $request = [])
    {
        return $this->repository
            ->findAllByBuyer($user->idUser, $request);
    }
}
