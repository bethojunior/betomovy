<?php

namespace App\Services\Dashboard;

use App\Constants\Trip\PaymentFormTypeConst;
use App\Models\Role\Role;
use App\Repositories\Dashboard\DashboardRepository;
use App\Repositories\Trip\TripRepository;
use App\Repositories\User\CustomerRepository;
use App\Repositories\User\DriverRepository;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class DashboardService
{
    private $repository;
    private $tripRepository;
    private $driverRepository;
    private $customerRepository;

    public function __construct(
        DashboardRepository $repository,
        TripRepository $tripRepository,
        DriverRepository $driverRepository,
        CustomerRepository $customerRepository
    )
    {
        $this->repository = $repository;
        $this->tripRepository = $tripRepository;
        $this->driverRepository = $driverRepository;
        $this->customerRepository = $customerRepository;
    }

    public function currentQuantities(?int $cityId = null): array
    {
        return Cache::remember('dashboard:currentQuantities:' . $cityId ?? 'all', 3600, function () use ($cityId) {
            /** @var Role $role */
            $role = (Auth::user())->role;

            return [
                'drivers' => $this->repository
                    ->getCountDrivers($role, $cityId),
                'customers' => $this->repository
                    ->getCountCustomers($role, $cityId),
                'customers_polygon' => $this->repository
                    ->getCountCustomersInsidePolygon($role, $cityId),
            ];
        });
    }

    public function currentQuantitiesAll(): array
    {
        return Cache::remember('dashboard:currentQuantities:' ?? 'all', 3600, function () {
            /** @var Role $role */
            $role = (Auth::user())->role;

            return [
                'drivers' => $this->repository
                    ->getCountDrivers($role),
                'customers' => $this->repository
                    ->getCountCustomers($role),
                'customers_polygon' => $this->repository
                    ->getCountCustomersInsidePolygon($role),
            ];
        });
    }

    public function statisticsByCity(?int $cityId = null)
    {
        $trips = $this->tripRepository->findTripsByCity($cityId);

        return $this->mountStatistics($trips);
    }


    public function statisticsByCityToday(?int $cityId = null)
    {
        $trips = $this->tripRepository->findTripsByCityToday($cityId);

        return $this->mountStatistics($trips);
    }

    public function statisticsAll()
    {
        $trips = $this->tripRepository->findAllTrip();

        return $this->mountStatistics($trips);
    }

    public function driverAndCustomersActivesByCity(?int $cityId = null)
    {
        $driverActives = $this->driverRepository->activeDriversByCityRegister($cityId);

        $customerActives = $this->customerRepository->activeCustomersByCityRegister($cityId);

        return [
            'driverActives' => $driverActives,
            'customerActives' => $customerActives
        ];
    }

    public function mountStatistics($trips)
    {
        $today = Carbon::now('America/Sao_Paulo')->toDateString();
        $todayTotalTrips = 0;
        $todayTotalMoney = 0;
        $ticketMedia = 0;

        $canceledbyDriver = 0;
        $canceledbyCustomer = 0;
        $totalCanceled = 0;

        $totalTrips = 0;
        $tripAccepted = 0;
        $tripFinished = 0;

        $paidOutVoucher = 0;
        $paidOutMoney = 0;
        $paidOutCreditCard = 0;

        if($trips) {
            foreach ($trips as $trip) {
                if($trip->canceledBy) {
                    if($trip->canceledBy == 'driver'){
                        $canceledbyDriver++;
                    }
                    if($trip->canceledBy == 'customer'){
                        $canceledbyCustomer++;
                    }
                    $totalCanceled++;
                    $tripAccepted++;
                }

                if($trip->status == 'finished') {
                     $tripFinished++;
                     $tripAccepted++;
                }

                if($trip->status == 'accepted') {
                    $tripAccepted++;
                }

                if($trip->paymentFormTypeId == PaymentFormTypeConst::VOUCHER) {
                    $paidOutVoucher++;
                }

                if($trip->paymentFormTypeId == PaymentFormTypeConst::MONEY) {
                    $paidOutMoney++;
                }

                if($trip->paymentFormTypeId == PaymentFormTypeConst::CREDIT_CARD) {
                    $paidOutCreditCard++;
                }

                if(Carbon::parse($trip->date)->toDateString() == $today) {
                    $todayTotalTrips++;
                    $todayTotalMoney += $trip->price;
                }

                $totalTrips++;
            }
        }

        $groupedData = [];
        if($trips)  {
            $tripGroups = collect($trips)->groupBy('name');
            foreach ($tripGroups as $name => $group) {
                $count = $group->count();

                $groupedData[] = [
                    'name' => $name,
                    'count' => $count,
                ];
            }
        }

        if($todayTotalTrips != 0) {
            $ticketMedia = $todayTotalMoney / $todayTotalTrips;
            $ticketMedia = number_format($ticketMedia, 2);
        }

        $filtered = [
            'canceledbyDriver' => $canceledbyDriver,
            'canceledbyCustomer' => $canceledbyCustomer,
            'totalCanceled' => $totalCanceled,
            'totalTrips' => $totalTrips,
            'tripAccepted' => $tripAccepted,
            'tripFinished' => $tripFinished,
            'todayTotalTrips' => $todayTotalTrips,
            'ticketMedia' => $ticketMedia,
            'paidOutVoucher' => $paidOutVoucher,
            'paidOutMoney' => $paidOutMoney,
            'paidOutCreditCard' => $paidOutCreditCard,
            'paymentForm' => $groupedData,
        ];

        return $filtered;
    }
}
