<?php


namespace App\Services\Military;


use App\Models\Military\MilitaryForceGraduation;
use App\Repositories\Military\MilitaryForceGraduationRepository;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class MilitaryForceGraduationService
{
    private $repository;

    /**
     * MilitaryForceGraduationService constructor.
     * @param $repository
     */
    public function __construct(MilitaryForceGraduationRepository $repository)
    {
        $this->repository = $repository;
    }

    public function find(int $id)
    {
        $militaryForceGraduation = $this->repository->findById($id);
        if (empty($militaryForceGraduation)) throw new ModelNotFoundException("Nãp encontrado");

        return $militaryForceGraduation;
    }

    public function store(array $data)
    {
        return MilitaryForceGraduation::create($data);
    }

    public function update(MilitaryForceGraduation $militaryForceGraduation, array $data)
    {
        $militaryForceGraduation->update($data);

        return $militaryForceGraduation;
    }

    public function delete(MilitaryForceGraduation $militaryForceGraduation)
    {
        $militaryForceGraduation->statusId = 2;
        $militaryForceGraduation->save();

        return $militaryForceGraduation;
    }
}
