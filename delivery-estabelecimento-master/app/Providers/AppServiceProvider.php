<?php

namespace App\Providers;

use App\Repositories\Config\ConfigRepository;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use JeroenNoten\LaravelAdminLte\Events\BuildingMenu;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot(Dispatcher $events, ConfigRepository $configRepository)
    {
        $events->listen(BuildingMenu::class, function (BuildingMenu $event) use ($configRepository) {

            $name = \Cache::remember('name_establishment_delivery', 600, function () use ($configRepository) {
                $config = $configRepository->findByKey('name_establishment_delivery');

                return $config && $config->value ? $config->value : 'Delivery';
            });
            config([
                'adminlte.title' => $name,
                'adminlte.short_name' => $name,
                'adminlte.logo' => $name
            ]);

            $companyDeliveryConfig =
                \Cache::remember('companyDeliveryConfig', 600, function () {
                    $company = \Auth::user()->companyWorker->company;

                    return $company->companyDeliveryConfig;
                });

            if ($companyDeliveryConfig->releaseDelivery)
                $event->menu->addAfter('customers', [
                    'key' => 'drivers',
                    'text'    => 'Entregadores',
                    'icon'    => 'fas fa-motorcycle',
                    'route'   => 'driver.index',
                ]);
        });

        if($this->app->environment('production')) {
            URL::forceScheme('https');
        }
    }
}
