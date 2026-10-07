<?php

namespace App\Services\MonitoringArea;

use App\Models\Price\Dynamic\MonitoringArea;
use App\Repositories\MonitoringArea\MonitoringAreaRepository;

class MonitoringAreaService
{
    protected $repository;

    public function __construct(MonitoringAreaRepository $repository)
    {
        $this->repository = $repository;
    }

    public function store(array $request)
    {
        $monitoringArea = new MonitoringArea($request);
        // A coluna area é do tipo JSON, então salvamos o array diretamente
        // O Laravel fará a conversão automática devido ao cast no modelo
        $monitoringArea->area = $request['area'];
        $monitoringArea->save();

        return $monitoringArea;
    }

    public function findAllByCity($cityId)
    {
        $monitoringAreas = $this->repository->findAllByCity($cityId);

        // A área já vem como array devido ao cast no modelo
        // Apenas convertemos para objeto se necessário
        $monitoringAreas = $monitoringAreas->map(function ($item) {
            // Converter o array de pontos para objetos com lat/lng
            if (isset($item->area) && is_array($item->area)) {
                $item->area = array_map(function ($point) {
                    if (is_array($point)) {
                        return (object) $point;
                    }
                    return $point;
                }, $item->area);
            }
            return $item;
        });

        return $monitoringAreas;
    }

    public function update(int $id, array $request)
    {
        $monitoringArea = $this->repository->find($id);

        $monitoringArea->fill($request);

        if (isset($request['area'])) {
            // A coluna area é do tipo JSON, então salvamos o array diretamente
            $monitoringArea->area = $request['area'];
        }

        $monitoringArea->save();

        return $monitoringArea;
    }

    public function delete($id)
    {
        $monitoringArea = $this->repository->find($id);
        $monitoringArea->delete();
    }

    public function changeStatus($id, $active)
    {
        $monitoringArea = $this->repository->find($id);
        $monitoringArea->active = $active;
        $monitoringArea->save();
    }
}


