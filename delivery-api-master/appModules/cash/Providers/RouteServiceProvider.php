<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/07/2020
 * Time: 09:19
 */

namespace Cash\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Route;

class RouteServiceProvider extends ServiceProvider
{
    protected $namespace = 'Cash\Http\Controllers';

    /**
     * Define the routes for the application.
     *
     * @return void
     */
    public function map()
    {
        $this->mapCashRoutes();

        //
    }

    /**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    protected function mapCashRoutes()
    {
        Route::middleware('api')
            ->prefix('cash')
            ->namespace($this->namespace)
            ->group(base_path('routes/modules/cash/index.php'));
    }
}
