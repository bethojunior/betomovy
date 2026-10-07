<?php

namespace App\Services\App;

use App\Repositories\App\AppAnimationRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class AppAnimationService
{
    private $repository;

    public function __construct(AppAnimationRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getAll()
    {
        return $this->repository->getAll();
    }


    public function update(array $request)
    {
        try {
            DB::beginTransaction();
            foreach ($request['screens'] as $screen) {
                $this->repository->where('screen', $screen['screen'])->update(['screen' => null]);
                $animationApp = $this->repository->where('id_app', $screen['id_app'])->firstOrFail();
                $this->repository->update($animationApp,  $screen);
            }
            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
