<?php

namespace App\Http\Middleware;

use App\Helpers\Config\ConfigHelper;
use Carbon\Carbon;
use Closure;

class TimezoneConfigMiddleware
{
    /**
     * @var ConfigHelper
     */
    private $configHelper;

    public function __construct(ConfigHelper $configHelper)
    {
        $this->configHelper = $configHelper;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $timezone = $this->configHelper->get('application_timezone');

        config(['app.timezone' => $timezone]);
        date_default_timezone_set($timezone);

        return $next($request);
    }
}
