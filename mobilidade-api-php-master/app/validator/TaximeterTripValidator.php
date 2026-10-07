<?php

namespace app\validator;

use app\validator\contracts\Validator;

use Exception;
use stdClass;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 23/06/2020
 * Time: 14:20
 */
class TaximeterTripValidator extends Validator
{
    /**
     * @param stdClass|null $request
     * @return bool
     * @throws Exception
     */
    public function validateInit(?stdClass $request)
    {
        $this->requestIsNotEmpty($request);

        $this->isNumber($request->tripTypeId ?? '', "Tipo de viagem não informado");
        $this->latitudeIsValid($request->latitude ?? '');
        $this->longitudeIsValid($request->longitude ?? '');
        $this->isNumber($request->priceId ?? '', "Tabela de preço não informado");

        if (isset($request->multiplierDynamic))
            $this->isNumber($request->multiplierDynamic ?? '', 'Valor da dinâmica está inválido');

        return true;
    }

    public function validateUpdate(?stdClass $request)
    {
        $this->requestIsNotEmpty($request);

        $this->stringIsValid($request->tripReference ?? '', 'tripReference');
        $this->isNumber($request->distance ?? '', 'distancia enviada está inválida');
        $this->isNumber($request->estimatedTripTime ?? '', 'tempo enviado está inválido');
        $this->isNumber($request->price ?? '', 'preço enviado está inválido');

        return true;
    }
}