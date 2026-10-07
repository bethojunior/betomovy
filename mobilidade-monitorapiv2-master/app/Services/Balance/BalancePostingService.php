<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 30/04/2020
 * Time: 11:09
 */

namespace App\Services\Balance;


use App\Models\Balance\BalancePosting;
use App\Repositories\Balance\BalancePostingRepository;
use Illuminate\Database\Eloquent\Collection;

class BalancePostingService
{
    /**
     * @var BalancePostingRepository
     */
    private $repository;

    public function __construct(BalancePostingRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getAll(): Collection
    {
        return $this->repository->findAll();
    }

    /**
     * @param array $request
     * @return BalancePosting
     */
    public function insert(array $request): BalancePosting
    {
        $balancePosting = new BalancePosting($request);
        $balancePosting->save();

        return $balancePosting;
    }

    /**
     * @param BalancePosting $balancePosting
     * @return bool|null
     * @throws \Exception
     */
    public function delete(BalancePosting $balancePosting): ?bool
    {
        return $balancePosting->delete();
    }
}
