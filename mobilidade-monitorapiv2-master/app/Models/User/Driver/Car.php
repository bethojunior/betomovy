<?php


namespace App\Models\User\Driver;


use App\Models\User\Driver;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Car extends Model
{
    use SoftDeletes;

    protected $table = 'car';
    protected $primaryKey = 'idCar';

    public function driver()
    {
        return $this->belongsTo(Driver::class, 'driverId');
    }

    public function getDocumentAttribute($value)
    {
        if (!$value)
            return null;

        $userId = $this->attributes['idUser'] ?? $this->driver->userId;

        return $this->generateStorageUrl("user/{$userId}/docs/{$value}");
    }

    private function generateStorageUrl(string $fileName): string
    {
        $bucket = env('STORAGE_BUCKET') ?? env('AWS_BUCKET');
        $endpoint = rtrim(env('STORAGE_ENDPOINT') ?? env('AWS_ENDPOINT'), '/');

        return "{$endpoint}/{$bucket}/{$fileName}";
    }
}
