<?php


namespace App\Services\Military;


use App\Models\Military\MilitaryForce;

class MilitaryForceService
{
    public function store(array $data) {
        return MilitaryForce::create($data);
    }
}
