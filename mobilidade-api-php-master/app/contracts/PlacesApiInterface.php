<?php

namespace app\contracts;
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 31/07/2019
 * Time: 16:30
 */
interface PlacesApiInterface
{
    public function search($query, $proximity_string = null, bool $retry = false): array;

    public function getApiKey(): string;
}