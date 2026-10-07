<?php

namespace Tests\Trip;

include 'tests/WebTestCase.php';

use Tests\WebTestCase;

final class BankControllerTest extends WebTestCase
{
    public function testFindAllBanksIsSuccessfully()
    {
        $response = $this->client()->get('http://localhost:8000/bank/getall');

        echo "Testing - Find All Banks";

        $this->assertEquals(200, $response->getStatusCode());
    }
}