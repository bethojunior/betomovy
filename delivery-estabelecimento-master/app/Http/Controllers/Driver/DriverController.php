<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/07/2020
 * Time: 17:12
 */

namespace App\Http\Controllers\Driver;


use App\Http\Controllers\Controller;

class DriverController extends Controller
{
    public function index()
    {
        return view('drivers.index');
    }
}
