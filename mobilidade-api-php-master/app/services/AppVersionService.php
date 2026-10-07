<?php

namespace app\services;

use app\constant\AppConst;
use app\dao\AppVersionDao;
use app\model\Config;
use app\utils\Headers;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 07/03/2019
 * Time: 13:40
 */
class AppVersionService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new AppVersionDao;
    }

    public function checkVersion($appId)
    {
        $platform = Headers::getPlatform();

        $version = $this->dao
            ->findVersions(
                Headers::getAppVersion(),
                $appId,
                $platform
            );

        $update = !$version ?: false;
        $version = $version ? $version : $this->getActualVersion($appId, $platform);

        return compact('update', 'version');
    }

    private function getActualVersion($appId, $platform)
    {
        $newVersion = $this->dao->findActual($appId, $platform);

        if (!$newVersion)
            return null;

        $data = [
            'action' => AppConst::ACTION_AUTO_LOGIN,
            'userId' => Headers::getUserId(),
        ];

        if ($newVersion->link)
            $newVersion->link .= "?referrer=" . base64_encode(json_encode($data));

        return $newVersion;
    }

    public function getAppClientVersions()
    {
        return $this->dao->findAppClientVersions();
    }

    public function findAppIOSClientVersions()
    {
        return $this->dao->findAppIOSClientVersions();
    }

    public function getAppDriverVersions()
    {
        return $this->dao->findAppDriverVersions();
    }

    public function getDefaultAppLogo()
    {
        return Config::get('logo_default');
    }
}