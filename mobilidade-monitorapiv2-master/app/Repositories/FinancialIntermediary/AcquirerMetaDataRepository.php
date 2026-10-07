<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 28/07/2020
 * Time: 19:47
 */

namespace App\Repositories\FinancialIntermediary;

use App\Contracts\Repository\AbstractRepository;
use App\Models\Acquirer\AcquirerMetaData;
use Illuminate\Support\Collection;

class AcquirerMetaDataRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(AcquirerMetaData::class);
    }

    public function updateValueByKey(string $key, ?string $value)
    {
        return $this->getModel()
            ::where('key', $key)
            ->update(['value' => $value]);
    }

    public function findByKey(string $key)
    {
        return $this->getModel()::where('key', $key)
            ->first();
    }

    public function findByKeys(array $keys): array
    {
        return $this->getQuery()
            ->whereIn('key', $keys)
            ->select(['key', 'value'])
            ->pluck('value', 'key')
            ->toArray();
    }

    public function findManyByKeys(string ...$keys): Collection
    {
        return $this->getQuery()
            ->whereIn('key', $keys)
            ->pluck('value', 'key');
    }
}
