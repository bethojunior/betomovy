<?php
/**
 * Created by PhpStorm.
 * User: Emerson
 * Date: 08/04/2018
 * Time: 07:42
 */

class View extends Controller
{

    public $clientData = [];
    public $user;
    public $permissions = [];
    public $filesJs;
    public $filesCss;
    public $titleGlobal = null;

    protected $params;
    protected $seo = null;

    /**
     * @param array $views
     * @param array $filesJs
     * @param array $filesCss
     * @param string $description
     * @param bool $infoClient
     */
    public function layoutBuilder($views = [], $filesJs = [], $filesCss = [], $seoObj = null)
    {
        $this->filesJs = $filesJs;
        $this->filesCss = $filesCss;
        $this->titlePage = ($seoObj->title != null) ? $seoObj->title : "Taxi Return";

        if (!is_null($seoObj)) {
            $this->seo = new Seo($seoObj);
        }

        $this->renderView("import/head");


        foreach ($views as $view) {
            $this->renderView($view);
        }

        $this->renderView("import/jsImport");

    }

    public function actionGet()
    {
        return $this->addEvents([
            'details' => 'details'
        ]);
    }

    protected function addEvents($events)
    {
        $event = explode("/", $_SERVER['REQUEST_URI']);

        array_splice($event, 0, 1);

        if (count($event) < 3)
            return false;

        $params = explode("/", $_SERVER['REQUEST_URI']);

        array_splice($params, 0, 2);

        $this->params = $params;

        $event = $event[count($event) - 1];

        if (isset($events[$event])) {
            $action = ($events[$event]);
            call_user_func(array($this, $action));
            return true;
        }

        return false;
    }

}
 