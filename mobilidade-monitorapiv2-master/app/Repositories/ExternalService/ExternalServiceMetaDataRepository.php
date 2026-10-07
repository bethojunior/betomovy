<?php


namespace App\Repositories\ExternalService;


use App\Contracts\Repository\AbstractRepository;
use App\Models\ExternalService\ExternalServiceMetadata;

class ExternalServiceMetaDataRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(ExternalServiceMetadata::class);
    }

    public function findByKey(string $key)
    {
        return $this->getModel()::where('key', $key)
            ->first();
    }

    public function updateValueByKey(string $key, string $value)
    {
        return $this->getModel()
            ::where('key', $key)
            ->update(['value' => $value]);
    }
}
