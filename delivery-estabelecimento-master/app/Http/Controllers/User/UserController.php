<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Repositories\City\CityRepository;
use App\Repositories\Config\ConfigRepository;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function list()
    {
        return view('client.list-users');
    }

    /**
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function fieldRegister()
    {
        return view('client.setting.user');
    }

    /**
     * @param CityRepository $cityRepository
     * @param ConfigRepository $configRepository
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function preregister(CityRepository $cityRepository, ConfigRepository $configRepository)
    {
        $cities = $cityRepository->findActives();

        $banner = $configRepository->findByKey('url_image_registration_screen_delivery_panel');

        return view('register.preregister', compact('cities','banner'));
    }
}
