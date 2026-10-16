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
            // Deactivate any unreleased/future version like 8.3.1 that is not on Google Play Store
            $sqlDeactivate = "UPDATE {$this->table} SET statusId = 0 WHERE appId = :appId AND version = '8.3.1'";
            $this->sqlRawExecute($sqlDeactivate, [':appId' => $app]);

            // Ensure 8.1.2 exists and is active (statusId = 1)
            $sqlCheck = "SELECT id, statusId FROM {$this->table} WHERE appId = :appId AND platform = :platform AND version = '8.1.2' LIMIT 1";
            $res = $this->sqlRawSelect($sqlCheck, [':appId' => $app, ':platform' => $platform]);
            $existing = $res ? $res->first() : null;

            if ($existing && isset($existing->id)) {
                if ((int)$existing->statusId !== Status::ATIVO) {
                    $this->sqlRawExecute("UPDATE {$this->table} SET statusId = :statusId WHERE id = :id", [
                        ':statusId' => Status::ATIVO,
                        ':id' => $existing->id
                    ]);
                }
            } else {
                $this->sqlRawExecute(
                    "INSERT INTO {$this->table} (appId, version, statusId, platform, link, created_at, updated_at) 
                     VALUES (:appId, '8.1.2', :statusId, :platform, 'https://play.google.com/store/apps/details?id=br.com.client.rota101', NOW(), NOW())",
                    [
                        ':appId' => $app,
                        ':statusId' => Status::ATIVO,
                        ':platform' => $platform
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