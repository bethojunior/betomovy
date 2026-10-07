<?php

error_reporting(E_ALL);

ini_set('display_errors', 0);
ini_set('session.gc_probality', 0);
setlocale(LC_ALL, 'pt_BR', 'pt_BR.utf-8', 'pt_BR.utf-8', 'portuguese');
date_default_timezone_set('America/Fortaleza');

define('PROJECT_PUBLIC_DIR', realpath('./'));
define('ROOT_DIR', realpath('../'));

session_start();
startIncludes('../services');
startIncludes('../src/controllers');
startIncludes('../src/model');

if (file_exists(ROOT_DIR . '/.env')) {
    (new DotEnv(ROOT_DIR . '/.env'))->load();
}

$route = new Route();

$path = $_SERVER['REQUEST_URI'];

$route->get($path);

function startIncludes($path)
{
    foreach (scandir($path) as $filename) {
        $file = $path . '/' . $filename;
        $extension = explode('.', $file);
        if (is_file($file) && end($extension) == "php") {
            require $file;
        }
    }
}