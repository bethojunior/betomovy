<?php

namespace app\utils;
/**
 * Class Restrictions
 * @package utils
 */
class Restrictions
{
    /**
     * Função para add condição
     * @param $condition
     * @param $object
     * @param String[] ...$columns
     * @return string
     */
    public static function addCondition($condition, $object, string ...$columns)
    {
        $i = 0;
        $query = "(";
        foreach ($columns as $column) {
            if ($i > 0) {
                $query .= " " . $condition . " ";
            }
            $query .= $column;
            $query .= " = ";
            $method = "get" . $column;
            if (gettype($object->$method()) == "string") {
                $query .= "'" . $object->$method() . "'";
            } else {
                $query .= $object->$method();
            }
            $i++;
        }
        $query .= ")";
        return $query;
        //return $query;
    }
}