<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * Date: 01/11/2018
 * Time: 14:57
 */

class App extends BaseModel
{
    protected $idApp;
    protected $name;
    protected $version;
    protected $schema;

    /**
     * @return mixed
     */
    public function getIdApp()
    {
        return $this->idApp;
    }

    /**
     * @param mixed $idApp
     * @return App
     */
    public function setIdApp($idApp)
    {
        $this->idApp = $idApp;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param mixed $name
     * @return App
     */
    public function setName($name)
    {
        $this->name = $name;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getSchema()
    {
        return $this->schema;
    }

    /**
     * @param mixed $schema
     * @return App
     */
    public function setSchema($schema)
    {
        $this->schema = $schema;
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
     * @return App
     */
    public function setVersion($version)
    {
        $this->version = $version;
        return $this;
    }
}
