<?php

namespace Tests\Feature\HelpersVideos;

use App\Models\User\User;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class HelpersVideosControllerTest extends TestCase
{
    /**
     *
     * @return void
     */
    public function testGetHelpersVideos()
    {
        $user = User::find(32);

        $response = $this->actingAs($user, 'api')
            ->withHeader('User-Agent', 'Test')
            ->get('/helpersVideos');

        $response->assertStatus(200);

        $response->assertJsonStructure([
            'status',
            'response' => [
                '*' => [
                    'id',
                    'title',
                    'url_video',
                    'url_application',
                    'created_at',
                    'updated_at',
                    'url_redirect'
                ]
            ],
            'message',
        ]);
    }
}
