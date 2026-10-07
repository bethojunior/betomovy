<?php


namespace App\Http\Controllers\Financial;


use App\Http\Controllers\Controller;

class FinancialController extends Controller
{
    public function billing()
    {
        return view('financial.billing');
    }
}
