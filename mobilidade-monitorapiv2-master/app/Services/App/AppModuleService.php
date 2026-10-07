<?php

namespace App\Services\App;

use App\Repositories\App\AppModuleRepository;
use Illuminate\Support\Facades\Storage;

class AppModuleService
{
    /**
     * @var AppModuleRepository
     */
    private $repository;

    public function __construct(AppModuleRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getAll()
    {
        return $this->repository->getAll();
    }

    public function updateStatus($request)  
    {
        if(isset($request['logo'])) {
            Storage::cloud()
                ->putFileAs('iconModules', $request['logo'], $request['name']);

            $request['logo'] = Storage::cloud()->url('iconModules/' . $request['name']);
            return $this->repository->updateLogo($request);
        }
        return $this->repository->updateStatus($request);
    }
}