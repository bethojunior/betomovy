<?php


namespace App\Services\App;

use App\Models\App\MenuApp;
use App\Models\App\MenuAppPro;
use App\Repositories\App\MenuAppRepository;
use Illuminate\Support\Facades\Storage;

class MenuAppService
{
    private $repository;

    public function __construct(MenuAppRepository $repository)
    {
        $this->repository = $repository;
    }

    public function insert(array $request)
    {
        $this->repository->disableMenuActiveByType($request['menuAppTypeId']);
        $menuApp = new MenuApp($request);
        $menuApp->save();

        return $menuApp;
    }

    public function insertPro($request)
    {
        $requestApp = json_decode($request->input('data'), true);
        $this->repository->disableMenuActiveByType($requestApp['menuAppTypeId']);
        if ($request->hasFile('linkImage')) {
            $file = $request->file('linkImage');
            $path = Storage::disk('s3')->putFile('linkImage', $file);
            $requestApp['linkImage'] = $path;
        } else {
            $requestApp['linkImage'] = $request->input('linkImage') ?? null;
        }
        $menuApp = new MenuAppPro($requestApp);
        $menuApp->save();

        return $menuApp;
    }

    public function findActives()
    {
        return $this->repository->findActives();
    }

    public function findActivesPro()
    {
        return $this->repository->findActivesPro();
    }

    public function disableMenuApp(int $id)
    {
        return $this->repository->disableMenuApp($id);
    }
}
