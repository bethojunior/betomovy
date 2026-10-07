<?php


namespace App\Services\Promotion;


use App\Models\Promotion\RoutePromotionalBanner;
use App\Repositories\Promotion\RoutePromotionalBannerRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class RoutePromotionalBannerService
{
    private $repository;

    public function __construct(RoutePromotionalBannerRepository $repository)
    {
        $this->repository = $repository;
    }


    public function findAll()
    {
        return $this->repository->findAll();
    }

    public function find(int $id)
    {
        return RoutePromotionalBanner::findOrFail($id);
    }

    public function save(array $data)
    {
        DB::beginTransaction();
        $routePromotionalBanner = RoutePromotionalBanner::create($data);
        $path = Storage::cloud()->putFile('promotionalBanner', $data['picture']);
        if (!$path) throw new \Exception('Erro ao salvar a imagem');

        $routePromotionalBanner->path = $path;
        $routePromotionalBanner->save();
        DB::commit();

        return $routePromotionalBanner;
    }

    public function delete(int $id)
    {
        $routePromotionalBanner = RoutePromotionalBanner::find($id);
        if (!$routePromotionalBanner) throw new \Exception('Banner não existe');
        $routePromotionalBanner->statusId = 2;
        $routePromotionalBanner->save();
        return true;
    }
}
