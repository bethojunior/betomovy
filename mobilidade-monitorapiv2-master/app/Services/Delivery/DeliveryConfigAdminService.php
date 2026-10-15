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
        $firstConfig = $config instanceof \Illuminate\Support\Collection ? $config->first() : (isset($config[0]) ? $config[0] : null);
        $data = new DeliveryConfigAdmin();

        if ($request->image) {
            $image = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $request->image));
            $imageName = 'delivery/' . time() . '_' . uniqid() . '.png';

            Storage::cloud()->put($imageName, $image);
            $image_url = Storage::cloud()->url($imageName);

            $data->image = $image_url;
        } else {
            $data->image = $firstConfig ? $firstConfig->image : null;
        }

        $data->linkAndroid = $request->linkAndroid ?? ($firstConfig ? $firstConfig->linkAndroid : null);
        $data->linkIos = $request->linkIos ?? ($firstConfig ? $firstConfig->linkIos : null);
        $data->cities = $request->cities ?? ($firstConfig ? $firstConfig->cities : null);

        return $this->repository->insert($data);
    }

}
