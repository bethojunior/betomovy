<?php

namespace Tests\Feature\Authenticate;

use App\Services\User\AuthenticationService;
use Tests\TestCase;

class AuthenticateControllerTest extends TestCase
{
    public function testShoudReturnedStructureLoginAdmin()
    {
        $response = $this->post('/auth/admin');
        $response->assertJsonStructure([
            'response' => [
                'token'
            ],
            'message',
            'status'
        ]);
    }
}