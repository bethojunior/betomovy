<?php

namespace app\traits;

use app\utils\BaseModel;
use app\utils\Connection;
use Exception;
use PDO;
use PDOStatement;

/**
 * Created by BETHO`S BRAIN.
 * User: Eassesso
 * Date: 12/06/2018
 * Updated: 06/03/2026
 * Time: 08:57
 */
trait SqlTrait
{
    /** @var Manager|PDO $conn */
    protected $conn;
    /** @var PDOStatement $stmt */
    protected $stmt;
    protected $table;

    protected $dbType;

    protected $bind;

    protected function checkConnection()
    {
        if (empty($this->conn)) {
            if ($this->dbType == Connection::DB_MYSQL) {
                $this->conn = Connection::open();
            }

            if ($this->dbType == Connection::DB_MYSQL_RO) {
                $this->conn = Connection::open($this->dbType);
            }
        }
        if (!empty($this->conn) && $this->conn instanceof PDO) {
            try {
                $this->conn->exec("SET SESSION sql_mode='NO_AUTO_VALUE_ON_ZERO,STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION'");
            } catch (\Throwable $t) {}
        }
    }

    /**
     * @param BaseModel $model
     * @return string
     */
    public function sqlInsert(BaseModel $model)
    {
        $this->checkConnection();

        $inputs = $this->getModelWithoutPrimaryKey($model);

        $inputsForQuery = array_map(function ($key) {
            return "`{$key}`";
        }, array_keys($inputs));
        $inputsForQuery = implode(',', $inputsForQuery);

        $fields = implode(',', array_keys($inputs));
        $values = ':' . str_replace(',', ',:', $fields);

        $query = $this->conn
            ->prepare("INSERT INTO {$this->getTableName()} ({$inputsForQuery}) VALUES ({$values})");

        foreach (explode(',', $values) as $key => $value) {
            $fieldKey = explode(',', $fields)[$key];
            $val = $inputs[$fieldKey];
            if (is_bool($val)) {
                $query->bindValue($value, $val ? 1 : 0, \PDO::PARAM_INT);
            } elseif (in_array($fieldKey, ['estimatedTripTime', 'estimatedTimeDriverArrival', 'distance', 'price', 'multiplierDynamic'])) {
                if (is_string($val)) {
                    if (preg_match('/([0-9]+(?:\.[0-9]+)?)/', str_replace(',', '.', $val), $matches)) {
                        $val = (float)$matches[1];
                    } else {
                        $val = null;
                    }
                }
                $query->bindValue($value, $val);
            } else {
                $query->bindValue($value, $val);
            }
        }

        $query->execute();
        $query->closeCursor();
        return $this->conn->lastInsertId();
    }

    /**
     * @param array $models
     * @return bool
     */
    public function sqlInsertMany(array $models)
    {
        $this->checkConnection();

        $inputs = $this->getModelWithoutPrimaryKey($models[0]);
        $fields = implode(',', array_keys($inputs));

        $sql = "INSERT INTO {$this->getTableName()} ({$fields}) VALUES ";
        $sql .= $this->mountValues($fields, count($models));

        $stmt = $this->conn->prepare($sql);

        $bind = 1;
        foreach ($models as $model) {
            $values = $this->removeNullValues($model->toArray());

            foreach (array_keys($inputs) as $key) {
                $val = $values[$key] ?? null;
                if (is_bool($val)) {
                    $stmt->bindValue($bind, $val ? 1 : 0, \PDO::PARAM_INT);
                } else {
                    $stmt->bindValue($bind, $val);
                }
                $bind++;
            }
        }

        return $stmt->execute();
    }

    /**
     * @param array $select
     * @param array $where
     * @param array $order
     * @param null $limit
     * @param null $groupBy
     * @return $this
     */
    public function sqlSelect($select = [], $where = [], $order = [], $limit = null, $groupBy = null, $distinct = false)
    {
        $this->checkConnection();

        if (empty($select))
            $select = "*";
        else
            $select = implode(',', $select);

        if ($distinct) {
            $select = "DISTINCT {$select}";
        }

        $sql = "SELECT {$select} FROM {$this->table} ";

        if (!empty($where))
            $sql .= $this->where($where);

        if (!empty($order))
            $sql .= $this->order($order);

        if (!empty($limit)) {
            $sql .= "LIMIT {$limit} ";
        }

        if (!empty($groupBy)) {
            $sql .= "GROUP BY {$groupBy}";
        }

        $this->stmt = $this->conn->prepare($sql);

        return $this;
    }

    public function dd()
    {
        dd([
            $this->stmt->queryString,
            $this->bind
        ]);
    }

    /**
     * @param bool $likeArray
     * @return array|mixed
     */
    public function get(bool $likeArray = true)
    {
        $this->stmt->execute();

        if ($this->stmt->rowCount() === 1 && !$likeArray) {
            $result = $this->stmt->fetchObject();
            $this->stmt->closeCursor();
            return $result;
        }

        if ($this->stmt->rowCount() === 0 && !$likeArray) {
            $this->stmt->closeCursor();
            return null;
        }

        $result = $this->stmt->fetchAll(PDO::FETCH_OBJ);
        $this->stmt->closeCursor();

        return $result;
    }

    /**
     * @return mixed
     */
    public function first()
    {
        $this->stmt->execute();

        $result = $this->stmt->fetchObject();

        $this->stmt->closeCursor();

        return $result;
    }
    /**
     * @param $set
     * @param $where
     * @param $bind
     * @param $throwEmpty
     * @return bool
     * @throws Exception
     */
    public function sqlUpdate($set, $where, $bind = [], $throwEmpty = true)
    {
        $this->checkConnection();

        $sql = "UPDATE {$this->getTableName()} SET ";

        if (empty($set)) {
            throw new Exception("You passed a wrong statement to SET statement");
        }

        foreach ($set as $key => $value) {
            $sql .= $key . " = " . $value . ", ";
        }

        $sql = substr($sql, 0, strlen($sql) - 2);

        if (!empty($where))
            $sql .= $this->where($where);

        $this->stmt = $this->conn->prepare($sql);

        $this->bindValues($bind);

        $this->stmt->execute();

        if ($this->stmt->rowCount() <= 0 && $throwEmpty) {
            throw new Exception("Row not Found, query: \"" . $sql . "\"");
        }

        return true;
    }

    public function sqlDelete($where)
    {
        $this->checkConnection();

        $sql = "DELETE FROM {$this->table} " . $this->where($where);

        $stmt = $this->conn->prepare($sql);

        return $stmt->execute();
    }

    public function where(array $where)
    {
        $sql = " WHERE ";
        foreach ($where as $statement) {
            $continue = isset($statement[3]) ? " " . $statement[3] : "";
            $sql .= $statement[0] . " " . $statement[1] . " " . $statement[2] . $continue . " ";
        }
        return $sql;
    }

    public function sqlRawSelect($sql, $bind = [], $dd = false)
    {
        $this->checkConnection();
        $this->stmt = $this->conn->prepare($sql);

        $this->bindValues($bind);

        if ($dd)
            dd([
                $this->stmt->queryString,
                $bind
            ]);

        $this->stmt->execute();

        return $this;
    }

    public function sqlRawExecute($sql, $bind = [], $dd = false)
    {
        $this->checkConnection();
        $this->stmt = $this->conn->prepare($sql);

        $this->bindValues($bind);

        if ($dd) {
            dd([
                $this->stmt->queryString,
                $bind
            ]);
        }

        $success = $this->stmt->execute();

        return $success; // true/false
    }


    /**
     * @param $sql
     * @param array $bind
     * @param bool $throwEmpty
     * @return bool
     * @throws Exception
     */
    public function sqlRawUpdate($sql, array $bind = [], bool $throwEmpty = true): bool
    {
        $this->checkConnection();
        $this->stmt = $this->conn->prepare($sql);

        $this->bindValues($bind);

        $this->stmt->execute();

        if ($this->stmt->rowCount() <= 0 && $throwEmpty) {
            throw new Exception("Row not Found, query: \"" . $sql . "\"");
        }

        return true;
    }

    public function order(array $order): string
    {
        return " ORDER BY " . $order[0] . " " . $order[1] . " ";
    }

    public function bind(array $bind)
    {
        $this->bindValues($bind);

        $this->bind = $bind;

        return $this;
    }

    private function getPdoType($varType)
    {
        if (is_string($varType) || is_float($varType) || is_double($varType))
            return PDO::PARAM_STR;

        if (is_int($varType))
            return PDO::PARAM_INT;

        if (is_bool($varType))
            return PDO::PARAM_BOOL;
    }

    /**
     * @return string
     */
    private function getTableName()
    {
        if (empty($this->table)) {
            $className = explode("\\", get_class($this));
            $class = end($className);
            return strtolower($class);
        }
        return $this->table;
    }

    /**
     * @param BaseModel $model
     * @return array|BaseModel
     */
    private function getModelWithoutPrimaryKey(BaseModel $model)
    {
        $arrayModel = $this->removeNullValues($model->toArray());
        unset($arrayModel['table']);

        return $arrayModel;
    }

    /**
     * @param $array
     * @return mixed
     */
    private function removeNullValues($array)
    {
        foreach ($array as $key => $value) {
            if ($value === null) {
                unset($array[$key]);
            }
        }

        return $array;
    }

    private function bindValues($bind)
    {
        if (!empty($bind)) {
            foreach ($bind as $key => $value) {
                if (is_bool($value)) {
                    $this->stmt->bindValue($key, $value ? 1 : 0, \PDO::PARAM_INT);
                } else {
                    $this->stmt->bindValue($key, $value);
                }
            }
        }
    }

    private function mountValues($fields, $quantityValues)
    {
        $values = [];
        $countFields = count(explode(',', $fields));
        for ($i = 0; $i < $quantityValues; $i++) {
            $sql = "(";
            for ($j = 0; $j < $countFields; $j++) {
                $sql .= "?";
                if ($j != $countFields - 1)
                    $sql .= ",";
            }
            $sql .= ")";
            $values[] = $sql;
        }

        return implode(',', $values);
    }

    protected function beginTransaction()
    {
        $this->checkConnection();
        return $this->conn->beginTransaction();
    }

    protected function commit()
    {
        return $this->conn->commit();
    }

    protected function rollback()
    {
        $this->checkConnection();

        if ($this->conn->inTransaction())
            return $this->conn->rollBack();

        return true;
    }
}
