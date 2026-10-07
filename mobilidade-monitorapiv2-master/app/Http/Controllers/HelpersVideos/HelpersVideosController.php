<?php

namespace App\Http\Controllers\HelpersVideos;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use GuzzleHttp\Client;
use Exception;

class HelpersVideosController extends Controller
{
    public function getHelpers() 
    {
        $client = new Client();

        $apiUrl = env('ADMIN704APPS_API_URL', '') . '/helperMonitor/allHelpers';

        try{
            $responseHelpersVideos = $client->request('GET', $apiUrl, [
                'headers' => [
                    'id' => env('ADMIN704APPS_API_ID', ''),
                    'secret' => env('ADMIN704APPS_API_SECRET', '')
                ]
            ]);

            $responseJson = json_decode($responseHelpersVideos->getBody(), true);

            return $responseJson;
        }catch(Exception $error){
            return ApiResponse::error($error, "Erro ao capturar helpers");
        }
    }
}
