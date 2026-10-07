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