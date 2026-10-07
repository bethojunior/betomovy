<?php

/**
 * Created by PhpStorm.
 * User: Emerson
 * Date: 08/04/2018
 * Time: 07:42
 */


class View extends Controller
{
    public $accessRelease;
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
        $this->filesJs = array_merge($this->filesJs, $filesJs);
        $this->filesCss = array_merge($this->filesCss, $filesCss);
        $this->filesView = array_merge($this->filesView, $views);

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

    public function JoinListRoles()
    {
        $cookieNames = [];
        $lengthRoles = Session::get("roles-length");

        for ($i = 0; $i <= $lengthRoles; $i++) {
            $cookieNames[] = 'roles-' . $i;
        }

        $listRoles = [];

        foreach ($cookieNames as $cookieName) {
            $roles = Session::get($cookieName);
            if (is_array($roles)) {
                $listRoles = array_merge($listRoles, $roles);
            }
        }
        return $listRoles;
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
            call_user_func(array($this, $action), $params[0]);
            return true;
        }

        return false;
    }

    /**
     * @param $nameGroup
     * @param $namePermission
     * @return bool
     * @throws Exception
     */
    protected function verifyPermission($nameGroup, $namePermission)
    {
        if (!$this->hasPermission($nameGroup, $namePermission)) {
            $this->layoutBuilder([
                "menu/index",
                'permission/forbid'
            ], [
                "modulos/menu/index",
            ], [
                "menu/index",
                "menu/index", 'permission/forbid'
            ]);
            throw new Exception("Não possui permissão");
        }

        return true;
    }

    /**
     * @param $nameGroup
     * @param $namePermission
     * @return bool
     */

    protected function hasPermission($nameGroup, $namePermission)
    {
        $roles = $this->JoinListRoles();

        if (!$roles)
            return false;
        $hasPermission = false;

        foreach ($roles as $group) {
            if ($group->name != $nameGroup)
                continue;

            foreach ($group->permissions as $permission) {
                if ($permission == $namePermission) {
                    $hasPermission = true;
                    break;
                }
            }

            if ($hasPermission)
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

        $roles = $this->JoinListRoles();

        if (!$roles)
            return false;

        $hasPermission = false;

        foreach ($roles as $group) {
            if ($group->name != $nameGroup)
                continue;

            if (count($group->permissions) > 0)
                $hasPermission = true;

            if ($hasPermission)
                break;
        }

        return $hasPermission;
    }

    protected function dashboardBIEnabled(): bool
    {
        $config = Session::get('power_bi_url');

        return !empty($config);
    }

    /**
     * @param $template
     */
    public function setTemplate($template)
    {
        $this->filesJs = $template->js;
        $this->filesCss = $template->css;
        $this->filesView = $template->view;
    }
}
