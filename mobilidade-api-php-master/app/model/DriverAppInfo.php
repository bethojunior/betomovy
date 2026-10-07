<?php


namespace app\model;

use app\utils\BaseModel;

class DriverAppInfo extends BaseModel
{
    protected $table = 'menuApp';
    protected $id;
    protected $version;
    protected $permissionLocationBackground;
    protected $permissionGps;
    protected $permissionWriteExternalStorage;
    protected $permissionSystemOverlay;
    protected $permissionIgnoreBatteryOptimization;
    protected $driverId;
    protected $created_at;

    public function __construct($obj = null)
    {
        parent::__construct($obj);
        $this->created_at = now();
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     * @return DriverAppInfo
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getVersion()
    {
        return $this->version;
    }

    /**
     * @param mixed $version
     * @return DriverAppInfo
     */
    public function setVersion($version)
    {
        $this->version = $version;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPermissionLocationBackground()
    {
        return $this->permissionLocationBackground;
    }

    /**
     * @param mixed $permissionLocationBackground
     * @return DriverAppInfo
     */
    public function setPermissionLocationBackground($permissionLocationBackground)
    {
        $this->permissionLocationBackground = $permissionLocationBackground;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPermissionGps()
    {
        return $this->permissionGps;
    }

    /**
     * @param mixed $permissionGps
     * @return DriverAppInfo
     */
    public function setPermissionGps($permissionGps)
    {
        $this->permissionGps = $permissionGps;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPermissionWriteExternalStorage()
    {
        return $this->permissionWriteExternalStorage;
    }

    /**
     * @param mixed $permissionWriteExternalStorage
     * @return DriverAppInfo
     */
    public function setPermissionWriteExternalStorage($permissionWriteExternalStorage)
    {
        $this->permissionWriteExternalStorage = $permissionWriteExternalStorage;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPermissionSystemOverlay()
    {
        return $this->permissionSystemOverlay;
    }

    /**
     * @param mixed $permissionSystemOverlay
     * @return DriverAppInfo
     */
    public function setPermissionSystemOverlay($permissionSystemOverlay)
    {
        $this->permissionSystemOverlay = $permissionSystemOverlay;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPermissionIgnoreBatteryOptimization()
    {
        return $this->permissionIgnoreBatteryOptimization;
    }

    /**
     * @param mixed $permissionIgnoreBatteryOptimization
     * @return DriverAppInfo
     */
    public function setPermissionIgnoreBatteryOptimization($permissionIgnoreBatteryOptimization)
    {
        $this->permissionIgnoreBatteryOptimization = $permissionIgnoreBatteryOptimization;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDriverId()
    {
        return $this->driverId;
    }

    /**
     * @param mixed $driverId
     * @return DriverAppInfo
     */
    public function setDriverId($driverId)
    {
        $this->driverId = $driverId;
        return $this;
    }


}