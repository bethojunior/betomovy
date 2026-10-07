<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 02/10/2019
 * Time: 17:10
 * @param $signature
 */

if (!function_exists('artisanBackgroundTask')) {

    function artisanBackgroundTask($signature)
    {
        $base_path = base_path('artisan');

        return exec(
            "nohup php {$base_path} {$signature} > /dev/null 2>&1 & echo $!");
    }
}
