<?php

namespace Tests;

use GuzzleHttp\Client;
use PHPUnit\Framework\TestCase;

class WebTestCase extends TestCase
{
    public function client()
    {
        return new Client();
    }
}