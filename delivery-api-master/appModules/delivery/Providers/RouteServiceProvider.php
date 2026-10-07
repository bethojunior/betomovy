<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/06/2020
 * Time: 13:02
 */

namespace Delivery\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    protected $namespace = 'Delivery\Http\Controllers';

    /**
     * Define the routes for the application.
     *
     * @return void
     */
    public function map()
    {
        $this->mapDeliveryRoutes();

        //
    }

    /**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    protected function mapDeliveryRoutes()
    {
        Route::middleware('api')
            ->prefix('delivery')
            ->namespace($this->namespace)
            ->group(base_path('routes/modules/delivery/index.php'));
    }
}
