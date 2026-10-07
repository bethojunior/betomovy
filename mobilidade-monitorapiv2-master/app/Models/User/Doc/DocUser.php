<?php

namespace App\Models\User\Doc;

use Illuminate\Database\Eloquent\Model;

class DocUser extends Model
{
    protected $table = 'docUser';

    protected $fillable = [
        'userId',
        'docId',
        'text',
        'image',
        'pdf',
        'docStatusId',
    ];

    public function getImageAttribute()
    {

        return $this->attributes['image']
            ? $this->generateStorageUrl("user/{$this->attributes['userId']}/docs/{$this->attributes['image']}")
            : null;
    }

    public function getPdfAttribute()
    {

        return $this->attributes['pdf']
            ? $this->generateStorageUrl("user/{$this->attributes['userId']}/docs/{$this->attributes['pdf']}")
            : null;
    }

    private function generateStorageUrl(string $fileName): string
    {
        $bucket = env('STORAGE_BUCKET') ?? env('AWS_BUCKET');
        $endpoint = rtrim(env('STORAGE_ENDPOINT') ?? env('AWS_ENDPOINT'), '/');

        return "{$endpoint}/{$bucket}/{$fileName}";
    }
}
 