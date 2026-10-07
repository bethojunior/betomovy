<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\User\Driver;
use App\Services\Driver\DriverAccountBankService;
use Illuminate\Http\JsonResponse;


class DriverAccountBankController extends Controller
{

    private $service;

    function __construct(DriverAccountBankService $service)
    {
        $this->service = $service;
    }

    public function index(Driver $driver): JsonResponse
    {
        return $this->service->accountBank($driver);
    }

    public function store(Driver $driver): JsonResponse
    {
        return $this->service->createAccountBank($driver);
    }
}
