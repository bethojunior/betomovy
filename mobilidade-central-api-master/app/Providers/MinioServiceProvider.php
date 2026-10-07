<?php

namespace App\Providers;

use App\Providers\Storage\MinioAdapter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Storage;
use League\Flysystem\Filesystem;

class MinioServiceProvider extends ServiceProvider
{
    public function boot()
    {
        Storage::extend('minio', function ($app, $config) {
            $adapter = new MinioAdapter($config);
            return new Filesystem($adapter);
        });
    }
}