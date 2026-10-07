<?php

namespace app\helpers;

use stdClass;

class MapperHelper
{
    public static function decodeJsonFields(array $rows, array $keys): array
    {
        foreach ($rows as &$row) {
            if (!($row instanceof stdClass)) {
                $row = (object) $row;
            }

            foreach ($keys as $key) {
                if (isset($row->$key) && is_string($row->$key)) {
                    $decoded = json_decode($row->$key);

                    if (json_last_error() === JSON_ERROR_NONE) {
                        $row->$key = $decoded;
                    }
                }
            }
        }
        unset($row);

        return $rows;
    }
}
