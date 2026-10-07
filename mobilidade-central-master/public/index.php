<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('session.gc_probality', 0);
date_default_timezone_set('America/Fortaleza');

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

define('PROJECT_PUBLIC_DIR', realpath('./'));
define('ROOT_DIR', realpath('../'));

session_start();
startIncludes('../src/const');
startIncludes('../src/utils');
startIncludes('../src/controller');

if (file_exists(ROOT_DIR . '/.env')) {
    (new DotEnv(ROOT_DIR . '/.env'))->load();
}

$route = new Route();

$path = $_SERVER['REQUEST_URI'];

if (!isset($path)) {
    if (Session::get('user')) {
        $route->redirectController('monitor');
        return;
    }
    $route->redirectController('');
    return;
}

$route->get($path);

/**
 * @param $path
 */
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
