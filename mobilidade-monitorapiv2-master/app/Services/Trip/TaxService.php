<?php

namespace App\Services\Trip;

use App\Models\Trip\Tax;
use App\Repositories\Trip\TaxRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

class TaxService
{
    private $repository;

    public function __construct(TaxRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll(array $request = []): Collection
    {
        return $this->repository->findAll($request, (Auth::user())->role);
    }

    public function store(array $data): Model
    {
        $data['userId'] = (Auth::user())->idUser;
        return Tax::create($data);
    }

    public function update(int $id, array $data): Model
    {
        $tax = Tax::findOrFail($id);
        $newTax = $tax->replicate();
        $tax->update(['active' => false]);
        $tax->delete();

        $newTax->save();
        $newTax->update($data);

        return $newTax;
    }

    public function active(int $id, bool $active)
    {
        $tax = Tax::findOrFail($id);
        $tax->active = $active;
        return $tax->save();
    }

    public function delete(int $id): bool
    {
        $tax = Tax::findOrFail($id);
        $tax->update(['active' => false]);

        return $tax->delete();
    }
}
