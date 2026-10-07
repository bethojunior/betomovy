<?php

namespace App\Services\Delivery;

use App\Exceptions\User\UserTypeException;
use App\Repositories\Delivery\DeliveryConfigAdminRepository;
use Illuminate\Support\Facades\Storage;
use App\Models\Delivery\DeliveryConfigAdmin;
use Illuminate\Http\File;

class DeliveryConfigAdminService
{
    private $repository;

    public function __construct(DeliveryConfigAdminRepository $configRepository)
    {
        $this->repository = $configRepository;
    }

    public function findAll()
    {
        return $this->repository->listAll();
    }

    public function insert($request) {
        $config = $this->findAll();
        $data = new DeliveryConfigAdmin();

        if($request->image){

            $image = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '',$request->image));
            $imageName = 'delivery/'.rand(10,100).'.png';

            Storage::cloud()->put($imageName, $image);
            $image_url = Storage::cloud()->url($imageName);

            $data->image = $image_url;
        } else {
            $data->image = $config[0]->image;
        }

            $data->linkAndroid = $request->linkAndroid ?? $config[0]->linkAndroid;
            $data->linkIos = $request->linkIos ?? $config[0]->linkIos;
            $data->cities = $request->cities ?? $config[0]->cities;

        return $this->repository->insert($data);
    }

}
