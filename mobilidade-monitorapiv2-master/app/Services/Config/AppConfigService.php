<?php

namespace App\Services\Config;

use App\Models\Config\AppConfig;
use App\Repositories\Config\AppConfigRepository;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class AppConfigService
{
    private $repository;

    public function __construct(AppConfigRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll()
    {
        return $this->repository->all();
    }

    public function store(array $request)
    {
        if (empty($request['logo'])) {
            $existing = $this->repository->findActiveByApp($request['appId']);
            if (!$existing) {
                throw new Exception("Logo é obrigatória para criar uma nova configuração");
            }
            $logoUrl = $existing->logo;
        } else {
            $prefix = $request['appId'] == 4 ? 'clientLogo' : 'driverLogo';
            $imageName = $prefix . '_' . time() . '.png';
            $uploaded = Storage::disk('s3')->putFileAs('', $request['logo'], $imageName);
            if (!$uploaded) throw new Exception('Ocorreu um erro ao fazer upload da logo');
            $logoUrl = Storage::disk('s3')->url($imageName);
        }

        return DB::transaction(function () use ($request, $logoUrl) {
            $this->repository->disableByApp($request['appId']);

            $appConfig = new AppConfig($request);
            $appConfig->logo = $logoUrl;
            $appConfig->save();

            return $appConfig;
        });
    }

    public function delete($id)
    {
        $this->repository->deleteById($id);
    }
 
    public function storeDefaultLogo($logo)
    {
        if(!$logo) {
            throw new Exception("Logo não enviada");
        }
        
        Storage::disk('s3')
        ->putFileAs('', $logo, 'default.jpg');
    }
}
