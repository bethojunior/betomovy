<?php

namespace Tests\Feature\QuantityTripsCancelled;

use App\Models\User\User;
use Tests\TestCase;

class QuantityTripsCancelledControllerTest extends TestCase
{
    /**
     *
     * @return void
     */
    public function testFindKeyObjectQuantityTripsCancelled()
    {

        $user = User::find(32);
        
        $response = $this->actingAs($user, 'api')->withHeader('User-Agent', 'Test')
        ->get('/customer?page=1&customerRegisterStatusId=&name=&militaryForceId=&militaryGraduationId=');

        $response->assertStatus(200);

        $response->assertJsonStructure([
            'status',
            'response' => [
                'current_page',
                'data' => [
                    '*' => [
                        "idCustomer",
                        "idUser",
                        "name",
                        "nickname",
                        "phone",
                        "email",
                        "document",
                        "dateOfBirth",
                        "gender",
                        "rg",
                        "rgFrontPicture",
                        "rgBackPicture",
                        "status",
                        "cityId",
                        "city",
                        "balanceId",
                        "comission",
                        "voucherBalance",
                        "profileImage",
                        "appVersion",
                        "platform",
                        "quantityTripsFinished",
                        "created_at",
                        "observation",
                        "latitude",
                        "longitude",
                        "om",
                        "militaryStatus",
                        "militaryForce",
                        "patent",
                        "patentPicture",
                        "quantityTripsCancelled"
                    ],
                ],
            ],
        ]);
    }
}
