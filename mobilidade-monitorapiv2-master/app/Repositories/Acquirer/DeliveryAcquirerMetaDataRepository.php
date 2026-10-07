<?php


namespace App\Repositories\Acquirer;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Acquirer\DeliveryAcquirerMetaData;
use Illuminate\Database\Eloquent\Model;

class DeliveryAcquirerMetaDataRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(DeliveryAcquirerMetaData::class);
    }

    public function getToken()
    {
        $result = $this->getModel()::where('key', 'asaas_token')->first();

        return $result->value;
    }

    public function updateToken($value)
    {
        $this->getModel()
            ::where('key', 'asaas_token')
            ->update([
                'value' => $value
            ]);
    }

    public function findByKey(string $key): Model
    {
        return $this->getModel()::where('key', $key)
            ->first();
    }

    public function updateValueByKey(string $key, ?string $value): bool
    {
        return $this->getModel()
            ::where('key', $key)
            ->update(['value' => $value]);
    }
}
