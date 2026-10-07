<?php
// import consts
require_once WebPague::path() . "const/Action.php";
require_once WebPague::path() . "const/WebPagueCardBrand.php";
require_once WebPague::path() . "const/WebPagueCardType.php";

//import card classes
require_once WebPague::path() . "card/WebPagueCard.php";

// import environment
require_once WebPague::path() . "environment/Environment.php";

/** @Deprecated */
class WebPague
{
    private $environment;
    private $card;
    private $paymentId;

    protected static $path = null;

    public function __construct(Environment $environment)
    {
        $this->environment = $environment;
    }

    /**
     * @param mixed $card
     */
    public function setCard(WebPagueCard $card): void
    {
        $this->card = $card;
    }

    /**
     * @return WebPagueCard
     */
    public function getCard() : WebPagueCard
    {
        return $this->card;
    }

    /**
     * @return mixed
     */
    public function getPaymentId()
    {
        return $this->paymentId;
    }

    public function credit(WebPagueCard $webPagueCard, $value, $app)
    {
        $response = $this->request($this->environment->getApi().Action::CREDIT, [
            "value" => $value, "app" => $app, "card" => $webPagueCard
        ]);

        $this->paymentId = $response->data->paymentId;
    }

    private function request($url, array $arrayData)
    {
        $curl = curl_init($url);

        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $this->mountObject($arrayData));

        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($curl);

        curl_close($curl);

        return json_decode($response);
    }

    private function mountObject(array $arrayData, $stdObject = true)
    {
        return $stdObject ?
            json_encode(["stdObject" => [$arrayData]]) :
            json_encode($arrayData);
    }

    static function path()
    {
        if (self::$path === null)
            self::$path = dirname(__FILE__) . DIRECTORY_SEPARATOR;
        return self::$path;
    }
}