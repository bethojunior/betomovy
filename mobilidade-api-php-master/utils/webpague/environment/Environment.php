<?php
/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 23/08/2018
 * Time: 09:48
 */

class Environment
{
    private $api;
    private static $BASE_URL = "http://localhost/webpagueapi/";
    private static $SANDBOX = "sandbox";
    private static $PRODUCTION = "production";

    public function __construct($api)
    {
        $this->api = $api;
    }

    static function sandbox()
    {
        $api = self::$BASE_URL."sandbox/";

        return new self($api);
    }

    static function production()
    {
        $api = self::$BASE_URL;

        return new self($api);
    }

    /**
     * @param $env
     * @return Environment
     * @throws Exception
     */
    static function getEnv($env)
    {
        switch ($env){
            case self::$SANDBOX:
                return self::sandbox();
            case self::$PRODUCTION:
                return self::production();
            default:
                throw new Exception("WebPague environment invalid");
        }
    }

    public function getApi()
    {
        return $this->api;
    }
}