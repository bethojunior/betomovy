<?php

namespace app\utils;

use GuzzleHttp\Psr7\Uri;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 29/01/2019
 * Time: 14:58
 */
class WebSocketRequest
{
    public function getQuery(Uri $uri)
    {
        return $this->clearQuery($uri->getQuery());
    }

    public function getQueryKey()
    {

    }

    private function clearQuery(string $queryString): array
    {
        $queryArray = explode('&', $queryString);

        $results = [];

        foreach ($queryArray as $key => $value) {
            $result = explode('=', $value);
            $results[$result[0]] = $result[1];
        }

        return $results;
    }
}