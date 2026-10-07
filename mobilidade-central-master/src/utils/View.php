<?php
/**
 * Created by PhpStorm.
 * User: Emerson nego lindo >.<
 * Date: 08/04/2018
 * Time: 07:42
 */

class View extends Controller
{

    public $clientData = [];
    public $user;
    public $permissions = [];
    public $description;
    public $filesJs = array();
    public $filesCss = array();
    private $filesView = array();
    protected $nameView = "";
    protected $params;
    protected $seo = null;

    /**
     * @param array $views
     * @param array $filesJs
     * @param array $filesCss
     */
    public function layoutBuilder($views = [], $filesJs = [], $filesCss = [])
    {
        $this->filesJs = array_merge($this->filesJs,$filesJs);
        $this->filesCss = array_merge($this->filesCss,$filesCss);
        $this->filesView = array_merge($this->filesView,$views);

        $this->rendererView("import/head");

        foreach ($this->filesView as $view) {
            $this->rendererView($view);
        }

        $this->rendererView("import/footer");
    }


    public function rendererViews($views = [])
    {

        $this->rendererView("import/head");

        foreach ($views as $view) {
            $this->rendererView($view);
        }

        $this->rendererView("import/footer");

    }


    protected function addEvents($events)
    {
        $event = explode("/", $_SERVER['REQUEST_URI']);

        array_splice($event, 0, 1);

        if (count($event) < 3) {
            $this->renderView("404");
            return false;
        }

        $params = explode("/", $_SERVER['REQUEST_URI']);

        array_splice($params, 0, 2);

        $this->params = $params;

        $event = $event[count($event) - 1];

        if (isset($events[$event])) {
            $action = ($events[$event]);
            call_user_func(array($this, $action));
            return true;
        }

        $this->renderView("404");
        return false;
    }

    /**
     * @param $nameGroup
     * @param $namePermission
     * @return bool
     * @throws Exception
     */
    protected function verifyPermission($nameGroup,$namePermission){
        if(!$this->hasPermission($nameGroup,$namePermission)) {
            $this->layoutBuilder(['permission/forbid'],[],['permission/forbid']);
            throw new Exception("Não possui permissão");
        }

        return true;
    }


    /**
     * @param $nameGroup
     * @param $namePermission
     * @return bool
     */
    protected function hasPermission($nameGroup,$namePermission)
    {

        $user = Session::get('user');

        if(!$user)
            return false;

        $hasPermission = false;

        foreach($user->role->groups as $group){
            if($group->name != $nameGroup)
                continue;

            foreach ($group->permissions as $permission){
                if($permission == $namePermission) {
                    $hasPermission = true;
                    break;
                }
            }

            if($hasPermission)
                break;
        }

        return $hasPermission;
    }

    /**
     * @param $nameGroup
     * @return bool
     */
    protected function hasPermissionGroup($nameGroup)
    {

        $user = Session::get('user');

        if(!$user)
            return false;

        $hasPermission = false;

        foreach($user->role->groups as $group){
            if($group->name != $nameGroup)
                continue;

            if(count($group->permissions) > 0)
                    $hasPermission = true;

            if($hasPermission)
                break;
        }

        return $hasPermission;
    }

    /**
     * @param $template
     */
    public function setTemplate($template){
        $this->filesJs = $template->js;
        $this->filesCss = $template->css;
        $this->filesView= $template->view;
    }
}