<?php

namespace App\Repositories\Delivery;

use App\Contracts\Repository\AbstractRepository;
use App\Models\Delivery\DeliveryConfigAdmin;

class DeliveryConfigAdminRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(DeliveryConfigAdmin::class);
    }

    public function listAll() {
        return $this->getModel()
            ::select('*')
            ->get();
    }

    public function insert($request)
    {
        $this->getModel()
            ::query()
            ->updateOrCreate(
            [
                'id' => 1
            ],[
                'linkAndroid' => $request->linkAndroid,
                'linkIos' => $request->linkIos,
                'image' => $request->image,
                'cities' => $request->cities,
            ]);

         return $request;
    }
}
