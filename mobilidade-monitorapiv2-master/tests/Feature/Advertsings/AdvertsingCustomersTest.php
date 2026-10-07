<?php

namespace Tests\Feature\Advertsings;

use App\Models\User\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AdvertsingCustomersTest extends TestCase
{
    /**
     *
     * @return void
     */
    public function testGetPublicityCustomer()
    {

        $user = User::find(32);

        $project_name = 'nortecar';

        $response = $this->actingAs($user, 'api')
        ->withHeader('User-Agent', 'Test')
        ->get('/publicity/advertising/customer/' . env("APP_NAME", ""));

        $response->assertStatus(200);

        $response->assertJsonStructure([
            'status',
            'response' => [
                '*' => [
                    'id',
                    'title',
                    'description',
                    'phone',
                    'link',
                    'banner_link',
                    'enabled',
                    'created_at',
                    'updated_at',
                    'advertising_customers' => [
                        '*' => [
                            'id',
                            'advertising_id',
                            'customer_id',
                            'created_at',
                            'updated_at'
                        ]
                    ]
                ]
            ],
            'message',
        ]);
    }
}
