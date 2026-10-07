<?php

namespace app\utils;

use app\traits\RedisTrait;
use app\traits\SqlTrait;

/**
 * Created by PhpStorm.
 * User: Eassesso
 * Date: 22/05/2018
 * Time: 09:40
 */
abstract class BaseDao
{
    protected $model;
    use SqlTrait, RedisTrait;

    /**
     * BaseDao constructor.
     * @param null $conn
     * @param string $dbtype
     */
    public function __construct($conn = null, string $dbtype = Connection::DB_MYSQL)
    {
        $this->dbType = $dbtype;

        $this->databaseName = Connection::getDatabaseName(Connection::DB_MYSQL);
        $this->model = $this->setModel();
        $this->table = $this->setTableName();
    }

    private function setModel()
    {
        if (empty($this->model)) {
            $className = explode("\\", get_class($this));
            $class = end($className);
            return str_replace('Dao', '', "app\\model\\$class");
        }

        return null;
    }

    private function setTableName()
    {
        if (empty($this->table)) {
            $className = explode("\\", get_class($this));
            $class = end($className);
            return str_replace('dao', '', strtolower($class));
        }

        return $this->table;
    }

    public function create($data = null, $model = null): BaseModel
    {
        if (empty($model)) {
            $className = explode("\\", get_class($this));
            $class = end($className);
            $model = str_replace('Dao', '', "app\\model\\$class");
        }

        /** @var BaseModel $obj */
        $obj = new $model($data);
        $setMethod = "set" . ucfirst($obj->getPrimaryKey());
        $obj->$setMethod($this->sqlInsert($obj));
        return $obj;
    }
}
