<?php


namespace App\Services\Driver;


use App\Constants\StatusConst;
use App\Models\User\Driver\IconMapDriver;
use App\Models\User\UserType;
use App\Repositories\User\Driver\IconMapDriverRepository;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Storage;

class IconMapDriverService
{
    private $repository;

    public function __construct(IconMapDriverRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll(array $request = [])
    {
        return $this->repository->findAll($request);
    }

    public function find(int $id)
    {
        $iconMapDriver = IconMapDriver::find($id);

        if (!isset($iconMapDriver)) throw new ModelNotFoundException('Ícone do mapa não encontrado');

        return $iconMapDriver;
    }

    public function store(array $data)
    {
        $iconMapDriver = new IconMapDriver();

        $icon = Storage::disk('s3')
            ->putFile('tripType', $data['icon']);

        if (!$icon) echo 'Ocorreu um erro ao fazer upload do ícone';
        $iconMapDriver->link = Storage::disk('s3')->url($icon);
        $iconMapDriver->save();

        return $iconMapDriver;
    }

    public function update(IconMapDriver $iconMapDriver, array $data)
    {
        $icon = Storage::disk('s3')
            ->putFile('tripType', $data['icon']);

        if (!$icon) echo 'Ocorreu um erro ao fazer upload do ícone';
        $iconMapDriver->link = Storage::disk('s3')->url($icon);
        $iconMapDriver->save();

        return $iconMapDriver;
    }

    public function delete(IconMapDriver $iconMapDriver):bool
    {
        if ($this->repository->isBoundToUserType($iconMapDriver->id)) throw new \Exception('O ícone está vinculado a um tipo de usuário');

        return $iconMapDriver->update(['statusId' => StatusConst::REMOVED]);
    }
}
