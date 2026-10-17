<?php

namespace app\services;

use app\constant\AppConst;
use app\constant\PlatformConst;
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
        $platform = Headers::getPlatform() ?: PlatformConst::ANDROID;
        $clientVersion = Headers::getAppVersion();

        // Self-heal: ensure obsolete/unreleased version 8.3.1 does not block clients running 8.1.2
        $this->dao->cleanInvalidVersions($appId, $platform);

        $actualVersion = $this->getActualVersion($appId, $platform);

        // If client sends no version or there is no actual version registered, do not force update
        if (empty($clientVersion) || empty($actualVersion) || empty($actualVersion->version)) {
            return [
                'update' => false,
                'version' => $actualVersion
            ];
        }

        $cleanClient = preg_replace('/[^0-9.]/', '', $clientVersion);
        $cleanActual = preg_replace('/[^0-9.]/', '', $actualVersion->version);

        // If client is running actualVersion or newer, update is false
        if (version_compare($cleanClient, $cleanActual, '>=')) {
            return [
                'update' => false,
                'version' => $actualVersion
            ];
        }

        // 8.1 is the official current production release (8.1, 8.1.0, 8.1.2) - never force update on 8.1+
        if (version_compare($cleanClient, '8.1', '>=') || strpos($cleanClient, '8.1') === 0) {
            return [
                'update' => false,
                'version' => $actualVersion
            ];
        }

        // Check if the client's current version is permitted in the database
        $version = $this->dao
            ->findVersions(
                $clientVersion,
                $appId,
                $platform
            );

        if ($version) {
            return [
                'update' => false,
                'version' => $version
            ];
        }

        // Only require update if actual is strictly newer and client is older than 8.1
        $update = version_compare($cleanActual, $cleanClient, '>') && version_compare($cleanClient, '8.1', '<');
        $version = $actualVersion;

        return compact('update', 'version');
    }

    private function getActualVersion($appId, $platform)
    {
        $newVersion = $this->dao->findActual($appId, $platform);

        if (!$newVersion)
            return null;

        // Force correct store link per platform: iOS App Store vs Android Google Play
        if ($platform === PlatformConst::IOS) {
            if (empty($newVersion->link) || strpos($newVersion->link, 'play.google.com') !== false) {
                $newVersion->link = 'https://apps.apple.com/app/id1549594459';
            }
        } else {
            if (empty($newVersion->link) || strpos($newVersion->link, 'apple.com') !== false) {
                $newVersion->link = 'https://play.google.com/store/apps/details?id=br.com.client.rota101';
            }
        }

        $data = [
            'action' => AppConst::ACTION_AUTO_LOGIN,
            'userId' => Headers::getUserId(),
        ];

        // Only append referrer for Android Google Play (Apple App Store links do not accept ?referrer=)
        if ($platform !== PlatformConst::IOS && $newVersion->link) {
            $newVersion->link .= (strpos($newVersion->link, '?') !== false ? '&' : '?') . "referrer=" . base64_encode(json_encode($data));
        }

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