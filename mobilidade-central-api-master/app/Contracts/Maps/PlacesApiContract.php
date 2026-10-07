<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/10/2019
 * Time: 08:24
 */

namespace App\Contracts\Maps;


interface PlacesApiContract
{
    public function search($query, $proximity_string = null): array;
}
