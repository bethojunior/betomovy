<?php
/**
 * Created by PhpStorm.
 * User: Usuario
 * Date: 10/03/2019
 * Time: 12:31
 */

class GoogleServiceController
{
    public function actionDirection()
    {
        $request = json_decode(file_get_contents('php://input'));

        $key = $request->key;
        $origin = $request->origin;
        $destination = $request->destination;

        $url = "https://maps.googleapis.com/maps/api/directions/json?origin=$origin&destination=$destination&sensor=false&key=$key";

        // create curl resource
        $ch = curl_init();
        // set url
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER,true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER,false);
        $output = curl_exec($ch);
        curl_close($ch);

        echo $output;
    }
}