<?php

namespace App\Http\Controllers\Publicities;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Exception;
use GuzzleHttp\Client;
use Illuminate\Http\Request;

class PublicityController extends Controller
{
    public function getPublicities()
    {
        $client = new Client();

        $apiUrl = env('ADMIN704APPS_API_URL', '') . '/advertising/customer/' . env('APP_NAME', '');
        

        try{
            $responsePublicities = $client->request('GET', $apiUrl, [
                'headers' => [
                    'id' => env('ADMIN704APPS_API_ID'),
                    'secret' => env('ADMIN704APPS_API_SECRET')
                ]
            ]);

            $responseJson = json_decode($responsePublicities->getBody(), true);

            return $responseJson;

        }catch(Exception $error){
            return ApiResponse::error($error, "Erro ao capturar publicidades");
        }
    }
}
