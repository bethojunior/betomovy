<?php

namespace app\utils;

class TripFirestore extends CloudFirestore
{
    protected $collection = 'trips';

    public function __construct()
    {
        parent::__construct();
    }
}
