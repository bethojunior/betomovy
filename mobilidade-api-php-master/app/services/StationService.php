<?php

namespace app\services;
use app\model\Station;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 08/10/2018
 * Time: 10:13
 */
class StationService
{
    /**
     * Returns a array with one key called 'sql' and another called 'bind'
     * @param Station $station
     * @return array
     */
    public function mountSqlToUpdateStation(Station $station)
    {
        $fields = array_keys($station->toArray());
        unset($fields[0]);

        $sql = "UPDATE {$station->getTableName()} SET ";

        foreach ($fields as $field) {
            $sql .= $field . " = :" . $field;
            if (end($fields) != $field)
                $sql .= ", ";
        }

        $sql .= " WHERE idStation = :idStation";
        $bind = array();

        foreach (array_keys($station->toArray()) as $key) {
            $method = 'get' . ucfirst(str_replace('_', '', $key));
            $bind[':' . $key] = $station->$method();
        }

        return ['sql' => $sql, 'bind' => $bind];
    }
}