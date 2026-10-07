<?php

namespace app\services;

use app\dao\ConfigMenuAppDao;

class ConfigMenuAppService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new ConfigMenuAppDao;
    }

    public function menuPermissions()
    {
        $permissions = $this->dao
            ->findPermissions([
                'driver_profile',
                'driver_races',
                'driver_dynamic',
                'driver_client',
                'driver_indications',
                'driver_account',
                'driver_corporate_routes',
                'driver_prepaid',
                'driver_google',
                'driver_indicate_driver',
                'driver_indicate_client',
                'driver_my_deliveries',
                'driver_routes',
                'driver_link_ads',
                'client_profile',
                'client_trip',
                'client_coupon',
                'client_account',
                'client_indication',
                'client_dependent',
                'client_favorite_driver',
                'client_payment',
                'client_google',
                'client_share',
                'client_contact_us',
                'driver_my_deliveries',
                'driver_routes',
                'driver_link_ads',
                'driver_relate_problem',
                'driver_vehicles',
                'driver_settings',
                'driver_languages',
                'client_transfers',
                'client_addresses',
                'client_languages'
            ]);

        return $permissions;
    }
}