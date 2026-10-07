<?php

/**
 * Class Controller
 * @package services
 */

class Controller
{
    public function __construct()
    {
        // if PROJECT_PUBLIC_DIR . "/webfiles/js/utils/Host.js" file not exists, then create it based on ROOT_DIR . "/examples/HostUtils.js"
        if (!file_exists(PROJECT_PUBLIC_DIR . "/webfiles/js/utils/Host.js")) {
            $this->createHostUtilsJsFile();
        }

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
        $s3BucketRegion = getenv('S3_BUCKET_REGION') == 'us-east-1' ? '' : '-sa-east-1';

        $hostUtils = file_get_contents(ROOT_DIR . "/examples/HostUtils.js");
        $storagePrimaryHost = getenv('STORAGE_PRIMARY_HOST');
        $storagePrimaryHost = rtrim($storagePrimaryHost, '/');
        $hostUtils = str_replace("<APIAPP_HOST>", getenv('APIAPP_HOST'), $hostUtils);
        $hostUtils = str_replace("<API_HOST>", getenv('API_HOST'), $hostUtils);
        $hostUtils = str_replace("<API_V2_HOST>", getenv('API_V2_HOST'), $hostUtils);
        $hostUtils = str_replace("<SITE_HOST>", getenv('SITE_HOST'), $hostUtils);
        $hostUtils = str_replace("<BUCKET_NAME>", getenv('BUCKET_NAME'), $hostUtils);
        $hostUtils = str_replace("<GLOBAL_HOST>", getenv('GLOBAL_HOST'), $hostUtils);
        $hostUtils = str_replace("<STORAGE_PRIMARY_HOST>", $storagePrimaryHost, $hostUtils);
        $hostUtils = str_replace("<S3_BUCKET_REGION>", $s3BucketRegion, $hostUtils);
        file_put_contents(PROJECT_PUBLIC_DIR . "/webfiles/js/utils/Host.js", $hostUtils);
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
        $hostJs = str_replace("<CUSTOMER_NAME>", getenv('CUSTOMER_NAME'), $hostJs);
        file_put_contents(PROJECT_PUBLIC_DIR . "/config/host.js", $hostJs);
    }

    protected function deleteGeneratedHostFiles(): void
    {
        if (file_exists(PROJECT_PUBLIC_DIR . "/webfiles/js/utils/Host.js")) {
            unlink(PROJECT_PUBLIC_DIR . "/webfiles/js/utils/Host.js");
        }

        if (file_exists(PROJECT_PUBLIC_DIR . "/config/host.css")) {
            unlink(PROJECT_PUBLIC_DIR . "/config/host.css");
        }

        if (file_exists(PROJECT_PUBLIC_DIR . "/config/host.js")) {
            unlink(PROJECT_PUBLIC_DIR . "/config/host.js");
        }
    }
}
