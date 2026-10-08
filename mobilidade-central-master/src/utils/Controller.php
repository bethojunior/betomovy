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

        $apiAppHost = getenv('APIAPP_HOST') ?: 'https://api.movymob.com/';
        $apiSocketHost = getenv('API_SOCKET_HOST') ?: 'https://movymob.com/ws/';
        $apiHost = getenv('API_HOST') ?: 'https://api.movymob.com/';
        $appPartner = getenv('APP_PARTNER') ?: 'true';
        $bucketName = getenv('BUCKET_NAME') ?: 'voutehomologar';
        $storageHost = getenv('STORAGE_PRIMARY_HOST') ?: 'https://s3-sa-east-1.amazonaws.com';

        $hostUtils = str_replace("<APIAPP_HOST>", $apiAppHost, $hostUtils);
        $hostUtils = str_replace("<API_SOCKET_HOST>", $apiSocketHost, $hostUtils);
        $hostUtils = str_replace("<API_HOST>", $apiHost, $hostUtils);
        $hostUtils = str_replace("<APP_PARTNER>", $appPartner, $hostUtils);
        $hostUtils = str_replace("<BUCKET_NAME>", $bucketName, $hostUtils);
        $hostUtils = str_replace("<S3_BUCKET_REGION>", $region, $hostUtils);
        $hostUtils = str_replace("<STORAGE_PRIMARY_HOST>", $storageHost, $hostUtils);

        $socketUrl = getenv('ROUTE_HOST_TRIP_SHARE_URL');
        $socketUrl = ($socketUrl && $socketUrl !== false && trim($socketUrl) !== '') 
            ? trim($socketUrl) 
            : 'https://realtime.704apps.com.br';
        $hostUtils = str_replace("<ROUTE_HOST_TRIP_SHARE_URL>", $socketUrl, $hostUtils);
        file_put_contents(PROJECT_PUBLIC_DIR . "/webfiles/js/config/host.js", $hostUtils);
    }
}
