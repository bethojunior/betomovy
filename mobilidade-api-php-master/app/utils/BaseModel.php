<?php

namespace app\utils;

use stdClass;
/**
 * Created by PhpStorm.
 * User: Eassesso
 * Date: 07/06/2018
 * Time: 12:21
 */
class BaseModel
{
    protected $primaryKey;
    protected $table;

    const ATIVO = 1;

    /**
     * BaseModel constructor.
     * @param null $obj
     */
    public function __construct($obj = null)
    {
        if (!empty($obj)) {
            foreach ($obj as $key => $value) {
                if (property_exists($this, $key) && $value !== "") {
                    if (is_bool($value)) {
                        $this->$key = $value ? 1 : 0;
                    } else {
                        $this->$key = $value;
                    }
                }
            }
        }
    }

    public function toStdClass()
    {
        $obj = new stdClass();
        foreach ($this as $key => $value) {
            if ($this->$key !== null && $key != "table")
                $obj->$key = $this->$key;
        }
        return $obj;
    }

    public function toArray()
    {
        $obj = [];
        foreach ($this as $key => $value) {
            if ($this->$key !== null && $key !== 'primaryKey')
                $obj[$key] = $this->$key;
        }
        return $obj;
    }

    public function getPrimaryKey()
    {
        // remove namespace
        $className = explode("\\", get_class($this));
        $className = end($className);
        return empty($this->primaryKey) ? "id" . $className : $this->primaryKey;
    }

    public function getTableName()
    {
        // remove namespace
        $className = explode("\\", get_class($this));
        $className = end($className);
        return empty($this->table) ? strtolower($className) : $this->table;
    }
}