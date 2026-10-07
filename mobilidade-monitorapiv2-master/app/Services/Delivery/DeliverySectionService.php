<?php

namespace App\Services\Delivery;

use App\Models\Delivery\DeliverySection;
use App\Repositories\Delivery\DeliverySectionRepository;
use Illuminate\Http\UploadedFile;

class DeliverySectionService
{
    private $repository;

    public function __construct(DeliverySectionRepository $repository)
    {
        $this->repository = $repository;
    }

    public function store(array $request)
    {
        $deliverySection = new DeliverySection($request);
        $deliverySection->icon = $this->uploadImage($request['icon']);
        $deliverySection->save();
        return $deliverySection;
    }

    public function findAll()
    {
        return $this->repository->all();
    }

    public function delete($id)
    {
        $deliverySection = $this->repository->find($id);
        $deliverySection->delete();
    }

    public function update($id, array $request)
    {
        $deliverySection = $this->repository->find($id);

        if (isset($request['icon']))
            $deliverySection->icon = $this->uploadImage($request['icon']);

        if (isset($request['name']))
            $deliverySection->name = $request['name'];

        if (isset($request['description']))
            $deliverySection->description = $request['description'];

        $deliverySection->save();

        return $deliverySection;

    }

    public function uploadImage(UploadedFile $file)
    {
        return \Storage::cloud()
            ->putFile("delivery/sections", $file, 'public');
    }
}
