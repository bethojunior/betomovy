<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/09/2019
 * Time: 16:25
 */

namespace App\Services\User;


use App\Repositories\Report\BalanceFlowReportRepository;
use App\Repositories\Report\UserIndicationReportRepository;
use App\Repositories\Report\UserReportRepository;
use Illuminate\Support\Facades\Auth;

class UserIndicationReportService
{
    /**
     * @var UserIndicationReportRepository
     */
    private $repository;
    /**
     * @var BalanceFlowReportRepository
     */
    private $balanceFlowReportRepository;
    /**
     * @var UserReportRepository
     */
    private $userReportRepository;

    public function __construct(UserIndicationReportRepository $repository,
                                UserReportRepository $userReportRepository,
                                BalanceFlowReportRepository $balanceFlowReportRepository)
    {
        $this->repository = $repository;
        $this->balanceFlowReportRepository = $balanceFlowReportRepository;
        $this->userReportRepository = $userReportRepository;
    }

    public function synthetic(array $queryRequest = [])
    {
        $result = $this->userReportRepository
            ->countReferredUsers($queryRequest,(Auth::user())->role);

        return $result;
    }

    public function analytical($userId, $request)
    {
        $result = $this->repository
            ->referredUsers($userId, $request);

        return $result;
    }

    public function indicationsCommissions(array $queryRequest = [])
    {
        $result = $this->balanceFlowReportRepository
            ->indicationsCommissions($queryRequest, (Auth::user())->role);

        return $result;
    }
}
