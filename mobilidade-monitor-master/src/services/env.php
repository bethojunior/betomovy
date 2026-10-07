<?php
//
//function env($key) {
//    $key = strtoupper($key);
//    $data = json_decode(file_get_contents(getEnvironment()));
//    return $data->$key ?? null;
//}
//
//function getEnvironment(){
//    $url = explode(':', $_SERVER['HTTP_HOST'])[0];
//
//    $environments = [
//        'localhost' => "../config/host.local.json",
//        'monitorteste.taxireturn.com.br' => "../config/host.local.json",
//        'monitor.fabrica704.com.br' => "../config/host.production.json",
//    ];
//
//    return $environments[$url];
//}
