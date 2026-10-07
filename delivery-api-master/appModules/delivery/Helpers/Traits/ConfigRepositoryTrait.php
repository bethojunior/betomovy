<?php
namespace Delivery\Helpers\Traits;

use Illuminate\Database\Eloquent\Builder;

trait ConfigRepositoryTrait
{
    protected $model;

    public function findByKey($key)
    {
        return $this->getModel()
            ::where('key', $key)
            ->first();
    }

    public function findMany(array $keys)
    {
        return $this->getModel()
            ::where(function (Builder $query) use ($keys){
                foreach ($keys as $key) {
                    $query
                        ->orWhere('key', $key);
                }
            })
            ->get();
    }

    protected function getModel()
    {
        return $this->model;
    }
}
