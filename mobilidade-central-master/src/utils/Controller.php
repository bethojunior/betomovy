<?php

/**
 * Class Controller
 * @package services
 */

class Controller
{
    public function __construct()
    {
        // if PROJECT_PUBLIC_DIR . "/webfiles/js/config/host.js" file not exists, then create it based on ROOT_DIR . "/examples/HostUtils.js"
        if (!file_exists(PROJECT_PUBLIC_DIR . "/webfiles/js/config/host.js")) {
            $this->createHostUtilsJsFile();
        }
    }

    /**
     * Função exebição
     * @param $view
     */
    public static function renderView($view)
    {
        require_once "../src/views/{$view}.php";
    }

    public function rendererView($view)
    {
        require_once "../src/views/{$view}.php";
    }
    /**
     * Função controlador de redirecionamento
     * @param $class
     */
    public static function redirectController($class)
    {
        header('Location: ' . Host::getLocal() . $class);
    }

    /**
     * Função redirecionar controlador
     * @param $class
     * @param $action
     */
    public static function redirectControllerAction($class, $action)
    {
        header('Location: ' . Host::getLocal() . $class . "/" . $action);
    }

    private function createHostUtilsJsFile(): void
    {
        $region = getenv('S3_BUCKET_REGION') ?: 'sa-east-1';
        $region = $region == 'us-east-1' ? '' : "-{$region}";
        $hostUtils = file_get_contents(ROOT_DIR . "/config/host.example.js");
        $hostUtils = str_replace("<APIAPP_HOST>", getenv('APIAPP_HOST'), $hostUtils);
        $hostUtils = str_replace("<API_SOCKET_HOST>", getenv('API_SOCKET_HOST'), $hostUtils);
        $hostUtils = str_replace("<API_HOST>", getenv('API_HOST'), $hostUtils);
        $hostUtils = str_replace("<APP_PARTNER>", getenv('APP_PARTNER'), $hostUtils);
        $hostUtils = str_replace("<BUCKET_NAME>", getenv('BUCKET_NAME'), $hostUtils);
        $hostUtils = str_replace("<S3_BUCKET_REGION>", $region, $hostUtils);
        $storageHost = getenv('STORAGE_PRIMARY_HOST');
        $hostUtils = str_replace("<STORAGE_PRIMARY_HOST>", $storageHost, $hostUtils);
        $socketUrl = getenv('ROUTE_HOST_TRIP_SHARE_URL');
        $socketUrl = ($socketUrl && $socketUrl !== false && trim($socketUrl) !== '') 
            ? trim($socketUrl) 
            : 'https://realtime.704apps.com.br';
        $hostUtils = str_replace("<ROUTE_HOST_TRIP_SHARE_URL>", $socketUrl, $hostUtils);
        file_put_contents(PROJECT_PUBLIC_DIR . "/webfiles/js/config/host.js", $hostUtils);
    }
}
