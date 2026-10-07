<?php

/**
 * Class Controller
 * @package services
 */

class Controller
{
    public function __construct()
    {
        // if PROJECT_PUBLIC_DIR . "/config/host.css" file not exists, then create it based on ROOT_DIR . "/examples/host.css"
        if (!file_exists(PROJECT_PUBLIC_DIR . "/config/host.css")) {
            $this->createHostCssFile();
        }

        // if PROJECT_PUBLIC_DIR . "/config/host.js" file not exists, then create it based on ROOT_DIR . "/examples/host.js"
        if (!file_exists(PROJECT_PUBLIC_DIR . "/config/host.js")) {
            $this->createHostJsFile();
        }
    }

    /**
     * Função exebição
     * @param $view
     */
    public function renderView($view) {
        require_once "../src/views/{$view}.php";
    }

    /**
     * Função controlador de redirecionamento
     * @param $class
     */
    public function redirectController($class) {
        header('Location: '.Host::getLocal().$class);
    }

    /**
     * Função redirecionar controlador
     * @param $class
     * @param $action
     */
    public function redirectControllerAction($class,$action) {
        header('Location: '.Host::getLocal().$class."/".$action);
    }

    private function createHostCssFile(): void
    {
        $hostCss = file_get_contents(ROOT_DIR . "/examples/host.css");
        $hostCss = str_replace("<CUSTOMER_NAME>", getenv('CUSTOMER_NAME'), $hostCss);
        file_put_contents(PROJECT_PUBLIC_DIR . "/config/host.css", $hostCss);
    }

    private function createHostJsFile(): void
    {
        $hostJs = file_get_contents(ROOT_DIR . "/examples/host.js");
        $hostJs = str_replace("<PROJECT_NAME>", getenv('PROJECT_NAME'), $hostJs);
        $hostJs = str_replace("<APIAPP_HOST>", getenv('APIAPP_HOST'), $hostJs);
        $hostJs = str_replace("<ROUTE_HOST_TRIP_SHARE_URL>", getenv('ROUTE_HOST_TRIP_SHARE_URL') ?: 'https://realtime.704apps.com.br', $hostJs);
        file_put_contents(PROJECT_PUBLIC_DIR . "/config/host.js", $hostJs);
    }
}