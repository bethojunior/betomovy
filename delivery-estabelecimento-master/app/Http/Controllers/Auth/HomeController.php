<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Repositories\Order\DeliveryOrderRepository;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        return view('welcome');
    }

    public function home(DeliveryOrderRepository $deliveryOrderRepository)
    {
        $dashboard = $deliveryOrderRepository->dashboardByCompany(\Auth::user()->companyWorker->company->id);

        return view('home',compact('dashboard'));
    }
}
