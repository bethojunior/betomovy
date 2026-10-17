<?php

namespace app\dao;

use app\constant\AppConst;
use app\constant\PlatformConst;
use app\utils\BaseDao;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 07/03/2019
 * Time: 13:39
 */
class AppVersionDao extends BaseDao
{
    protected $table = 'appVersion';

    public function findVersions($version, $app, $platform = PlatformConst::ANDROID)
    {
        $sql = "
            SELECT
                *
            FROM {$this->table} av
              WHERE
                av.version = :version AND
                av.appId = :appId AND
                av.platform = :platform AND
                av.statusId = :statusId
        ";

        $bind = [
            ':version' => $version,
            ':appId' => $app,
            ':platform' => $platform,
            ':statusId' => Status::ATIVO,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }

    public function cleanInvalidVersions($app, $platform = PlatformConst::ANDROID)
    {
        try {
            // 1. Deactivate any unreleased/future version like 8.3.1 that is not on stores
            $sqlDeactivate = "UPDATE {$this->table} SET statusId = 0 WHERE appId = :appId AND version = '8.3.1'";
            $this->sqlRawExecute($sqlDeactivate, [':appId' => $app]);

            // 2. Fix store links per platform: iOS MUST point to Apple App Store, Android to Google Play
            $appStoreLink = 'https://apps.apple.com/app/id1549594459';
            $playStoreLink = 'https://play.google.com/store/apps/details?id=br.com.client.rota101';

            $this->sqlRawExecute(
                "UPDATE {$this->table} SET link = :link WHERE appId = :appId AND platform = 'ios'",
                [':link' => $appStoreLink, ':appId' => $app]
            );

            $this->sqlRawExecute(
                "UPDATE {$this->table} SET link = :link WHERE appId = :appId AND platform = 'android'",
                [':link' => $playStoreLink, ':appId' => $app]
            );

            // 3. Ensure version 8.1 exists and is active for the requested platform
            $targetLink = ($platform === PlatformConst::IOS) ? $appStoreLink : $playStoreLink;
            $sqlCheck = "SELECT id, statusId, version FROM {$this->table} WHERE appId = :appId AND platform = :platform AND version IN ('8.1', '8.1.0', '8.1.2') ORDER BY id DESC LIMIT 1";
            $res = $this->sqlRawSelect($sqlCheck, [':appId' => $app, ':platform' => $platform]);
            $existing = $res ? $res->first() : null;

            if ($existing && isset($existing->id)) {
                $this->sqlRawExecute("UPDATE {$this->table} SET statusId = :statusId, link = :link, version = '8.1' WHERE id = :id", [
                    ':statusId' => Status::ATIVO,
                    ':link' => $targetLink,
                    ':id' => $existing->id
                ]);
            } else {
                $this->sqlRawExecute(
                    "INSERT INTO {$this->table} (appId, version, statusId, platform, link, created_at, updated_at) 
                     VALUES (:appId, '8.1', :statusId, :platform, :link, NOW(), NOW())",
                    [
                        ':appId' => $app,
                        ':statusId' => Status::ATIVO,
                        ':platform' => $platform,
                        ':link' => $targetLink
                    ]
                );
            }
        } catch (\Throwable $e) {
            // Log or ignore failure
        }
    }

    public function findActual($app, $platform = PlatformConst::ANDROID)
    {
        $sql = "
            SELECT
                *
            FROM {$this->table} av
              WHERE
                av.appId = :appId AND
                av.platform = :platform AND
                av.statusId = :statusId
              ORDER BY av.id DESC LIMIT 1
        ";

        $bind = [
            ':appId' => $app,
            ':platform' => $platform,
            ':statusId' => Status::ATIVO,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }

    public function findAppClientVersions($platform = PlatformConst::ANDROID)
    {
        $sql = "
            SELECT
                *
            FROM {$this->table} av
              WHERE
                av.appId = :appId AND
                av.platform = :platform AND
                av.statusId = :statusId
              ORDER BY av.id DESC LIMIT 1
        ";

        $bind = [
            ':appId' => AppConst::CUSTOMER,
            ':platform' => $platform,
            ':statusId' => Status::ATIVO,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }

    public function findAppDriverVersions($platform = PlatformConst::ANDROID)
    {
        $sql = "
            SELECT
                *
            FROM {$this->table} av
              WHERE
                av.appId = :appId AND
                av.platform = :platform AND
                av.statusId = :statusId
              ORDER BY av.id DESC LIMIT 1
        ";

        $bind = [
            ':appId' => AppConst::DRIVER,
            ':platform' => $platform,
            ':statusId' => Status::ATIVO,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }

    public function findAppIOSClientVersions($platform = PlatformConst::IOS)
    {
        $sql = "
            SELECT
                *
            FROM {$this->table} av
              WHERE
                av.appId = :appId AND
                av.platform = :platform AND
                av.statusId = :statusId
              ORDER BY av.id DESC LIMIT 1
        ";

        $bind = [
            ':appId' => AppConst::CUSTOMER,
            ':platform' => $platform,
            ':statusId' => Status::ATIVO,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }
}