<?php

namespace App\Console;

use App\Models\Config\Config;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        //
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $timezone = Config::getConf('application_timezone');

        $schedule
            ->command('balance-posting:trigger')
            ->timezone($timezone)
            ->dailyAt('04:00')
            ->runInBackground();

        $schedule
            ->command('event-notification:trigger')
            ->timezone($timezone)
            ->dailyAt('05:00')
            ->runInBackground();

        $schedule
            ->command('db:sync-firebase-mysql')
            ->hourly()
            ->runInBackground();

        $schedule
            ->command('prepaid:manage-driver-by-period')
            ->timezone($timezone)
            ->dailyAt('00:30')
            ->runInBackground();

        $schedule
            ->command('voucher-pix')
            ->timezone($timezone)
            ->everyTenMinutes()
            ->runInBackground();

        $schedule
            ->command('auto:send-email-open-company')
            ->timezone($timezone)
            ->everyMinute()
            ->runInBackground();

        $schedule
            ->command('queue-insert:sync')
            ->everyFifteenMinutes()
            ->runInBackground();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
