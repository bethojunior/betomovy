<?php

namespace Tests\Feature\FinancialMirror;

use App\Models\User\User;
use Tests\TestCase;

class FinancialMirrorTest extends TestCase
{
    /**
     *
     * @return void
     */
    public function testGetFinancialMirrors()
    {
        $user = User::find(32);

        $response = $this->actingAs($user, 'api')
        ->withHeader('User-Agent', 'Test')
        ->get("trip/financialMirror?startDate=2023-12-11&endDate=2024-2-6&analizy=0&isToday=0");

        $response->assertStatus(200);

        $response->assertJsonStructure([
            'status',
            'response' => [
                'totalTrips',
                'finishedTrips',
                'totalPrice',
                'canceledByCustomer',
                'canceledByDriver',
                'cardRefused',
                'numUniqueCustomer',
                'uniqueDriverIds',
                'firstTrip'
            ],
            'message',
        ]);
    }
}
