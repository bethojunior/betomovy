<?php

namespace App\Services\PublicityApp;

use App\Models\PublicityApp\PublicityApp;
use App\Repositories\PublicityApp\PublicityAppRepository;
use Illuminate\Support\Facades\Storage;

class PublicityAppService
{
    private PublicityAppRepository $repository;

    public function __construct(PublicityAppRepository $repository)
    {
        $this->repository = $repository;
    }

    private function generateStorageUrl(string $fileName): string
    {
        $bucket = env('AWS_BUCKET');
        $endpoint = rtrim(env('AWS_ENDPOINT'), '/');

        if (str_contains($endpoint, 'storage.704apps.com.br')) {
            return "{$endpoint}/{$bucket}/{$fileName}";
        }

        return "{$endpoint}/{$bucket}/{$fileName}";
    }


    public function store(array $request)
    {
        $this->repository->disableByApp($request['appId']);

        $imageName = ($request['appId'] == 4) ? 'clientLogo.png' : 'driverLogo.png';

        $logo = Storage::disk('s3')
            ->putFileAs('', $request['logo'], $imageName);

        if (!$logo) {
            throw new \Exception('Ocorreu um erro ao fazer upload da logo');
        }

        $appConfig = new AppConfig($request);
        $appConfig->logo = $this->generateStorageUrl($imageName);
        $appConfig->save();

        return $appConfig;
    }

    public function findAll()
    {
        return $this->repository->findAll();
    }

    public function findById(int $id)
    {
        return $this->repository->findById($id);
    }

    public function insert(array $request)
    {
        $publicityApp = new PublicityApp($request);

        $fileNameImagePassengerScreen = time() . $request['image_passenger_screen']->getClientOriginalName();
        Storage::disk('s3')->putFileAs('', $request['image_passenger_screen'], $fileNameImagePassengerScreen);
        $publicityApp->image_passenger_screen = $this->generateStorageUrl($fileNameImagePassengerScreen);

        $fileNameImagePassengerTransit = time() . $request['image_passenger_transit']->getClientOriginalName();
        Storage::disk('s3')->putFileAs('', $request['image_passenger_transit'], $fileNameImagePassengerTransit);
        $publicityApp->image_passenger_transit = $this->generateStorageUrl($fileNameImagePassengerTransit);

        $fileNameImageDriverInitial = time() . $request['image_driver_initial']->getClientOriginalName();
        Storage::disk('s3')->putFileAs('', $request['image_driver_initial'], $fileNameImageDriverInitial);
        $publicityApp->image_driver_initial = $this->generateStorageUrl($fileNameImageDriverInitial);

        $fileNameImageDriverTransit = time() . $request['image_driver_transit']->getClientOriginalName();
        Storage::disk('s3')->putFileAs('', $request['image_driver_transit'], $fileNameImageDriverTransit);
        $publicityApp->image_driver_transit = $this->generateStorageUrl($fileNameImageDriverTransit);

        try {
            \DB::beginTransaction();

            $this->repository->save($publicityApp);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollBack();
            throw $e;
        }

        return $publicityApp;
    }


    public function update(int $id, array $request)
    {
        $publicityApp = $this->repository->findById($id);

        if (!$publicityApp) {
            throw new \Exception('PublicityApp not found', 404);
        }

        $publicityApp->update($request);

        return $publicityApp;
    }

    public function delete(int $id)
    {
        $publicityApp = $this->repository->findById($id);

        if (!$publicityApp) {
            throw new \Exception('PublicityApp not found', 404);
        }

        $publicityApp->delete();
    }
}