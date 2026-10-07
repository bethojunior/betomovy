<?php


namespace App\Services\Price\Dynamic;


use App\Constants\StatusConst;
use App\Models\Price\Dynamic\PriceDynamicScheduled;
use App\Repositories\Price\Dynamic\PriceDynamicScheduledRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class PriceDynamicScheduledService
{
    private $repository;

    public function __construct(PriceDynamicScheduledRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll(array $request = [], int $cityId = null): Collection
    {
        return $this->repository->findAll($request, $cityId);
    }

    public function store(array $data): PriceDynamicScheduled
    {
        $data['startDateUTC'] = gmdate('Y-m-d H:i:s', strtotime($data['startDateUTC']));
        $data['endDateUTC'] = gmdate('Y-m-d H:i:s', strtotime($data['endDateUTC']));

        return PriceDynamicScheduled::create($data);
    }

    public function show(int $id): Model
    {
        return $this->repository->show($id);
    }

    public function update(array $data, int $id): bool
    {
        $data['startDateUTC'] = gmdate('Y-m-d H:i:s', strtotime($data['startDateUTC']));
        $data['endDateUTC'] = gmdate('Y-m-d H:i:s', strtotime($data['endDateUTC']));

        return PriceDynamicScheduled::find($id)->update($data);
    }

    public function delete(PriceDynamicScheduled $priceDynamicScheduled): bool
    {
        $priceDynamicScheduled->statusId = StatusConst::REMOVED;

        return $priceDynamicScheduled->save();
    }
}
