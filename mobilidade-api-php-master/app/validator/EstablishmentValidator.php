<?php

namespace app\validator;

use app\exceptions\InvalidFieldEstablishmentException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/09/2018
 * Time: 16:13
 */
class EstablishmentValidator
{
    /**
     * @param $request
     * @return bool
     * @throws InvalidFieldEstablishmentException
     */
    public function validateEstablishment($request)
    {
        if (count(get_object_vars($request)) < 1)
            throw new InvalidFieldEstablishmentException("A requisição não pode ser vazia");

        $this->fantasyNameIsValid($request->fantasyName ?? '');
        $this->documentIsValid($request->document ?? '');
        $this->addressIsValid($request->address ?? '');
        $this->numberIsValid($request->number ?? '');
        $this->zipCodeIsValid($request->zipcode ?? '');
        $this->neighborhoodIsValid($request->neighborhood ?? '');
        $this->cityIdIsValid($request->cityId ?? '');
        $this->estateIdIsValid($request->estateId ?? '');
        $this->ratingIsValid($request->rating ?? '');
        $this->maxDailyRateIsValid($request->maxDailyRate ?? '');
        $this->minDailyRateIsValid($request->minDailyRate ?? '');
        $this->administratorEmailIsValid($request->administratorEmail ?? '');
        $this->commercialEmailIsValid($request->commercialEmail ?? '');
        $this->commercialPhoneIsValid($request->commercialPhone ?? '');
        $this->administratorPhoneIsValid($request->administratorPhone ?? '');
        $this->latitudeIsValid($request->latitude ?? '');
        $this->longitudeIsValid($request->longitude ?? '');
        $this->indicationDiscountIsValid($request->indicationDiscount ?? '');
        $this->indicationCommissionTypeIdIsValid($request->indicationCommissionTypeId ?? '');
        $this->indicationValueIsValid($request->indicationValue ?? '');

        return true;
    }

    /**
     * @param $request
     * @return bool
     * @throws InvalidFieldEstablishmentException
     */
    public function validatePreRegisterEstablishment($request)
    {
        if (count(get_object_vars($request)) < 1)
            throw new InvalidFieldEstablishmentException("A requisição não pode ser vazia");

        $this->fantasyNameIsValid($request->fantasyName ?? '');
        $this->addressIsValid($request->address ?? '');
        $this->numberIsValid($request->number ?? '');
        $this->neighborhoodIsValid($request->neighborhood ?? '');
        $this->cityIdIsValid($request->cityId ?? '');
        $this->estateIdIsValid($request->estateId ?? '');
        $this->latitudeIsValid($request->latitude ?? '');
        $this->longitudeIsValid($request->longitude ?? '');

        return true;
    }

    /**
     * @param string $fantasyName
     * @throws InvalidFieldEstablishmentException
     */
    private function fantasyNameIsValid(string $fantasyName)
    {
        if (strlen($fantasyName) < 3) {
            throw new InvalidFieldEstablishmentException('Nome fantasia dever ter mais que 3 letras', 'fantasyName');
        }
    }

    /***
     * @param string $document
     * @throws InvalidFieldEstablishmentException
     */
    private function documentIsValid(string $document)
    {
        if (strlen($document) < 14) {
            throw new InvalidFieldEstablishmentException('CNPJ dever ter mais que 14 numeros', 'document');
        }
    }

    /**
     * @param string $address
     * @throws InvalidFieldEstablishmentException
     */
    private function addressIsValid(string $address)
    {
        if (strlen($address) < 3) {
            throw new InvalidFieldEstablishmentException('Endereço inválido.', 'address');
        }
    }

    /**
     * @param string $number
     * @throws InvalidFieldEstablishmentException
     */
    private function numberIsValid(string $number)
    {
        if (strlen($number) < 1) {
            throw new InvalidFieldEstablishmentException('Numero dever ter mais que 1 numero', 'number');
        }
    }

    /**
     * @param string $zipCode
     * @throws InvalidFieldEstablishmentException
     */
    private function zipCodeIsValid(string $zipCode)
    {
        if (strlen($zipCode) < 8) {
            throw new InvalidFieldEstablishmentException('O CEP dever ter mais que 8 caracteres', 'zipCode');
        }
    }

    /**
     * @param string $neighborhood
     * @throws InvalidFieldEstablishmentException
     */
    private function neighborhoodIsValid(string $neighborhood)
    {
        if (strlen($neighborhood) < 2) {
            throw new InvalidFieldEstablishmentException('Bairro dever ter mais que 1 letra', 'neighborhood');
        }
    }

    /**
     * @param $cityId
     * @throws InvalidFieldEstablishmentException
     */
    private function cityIdIsValid($cityId)
    {
        if ($cityId < 1 || !is_int($cityId)) {
            throw new InvalidFieldEstablishmentException('ID da cidade é Inválido', 'cityId');
        }
    }

    /**
     * @param $estateId
     * @throws InvalidFieldEstablishmentException
     */
    private function estateIdIsValid($estateId)
    {
        if ($estateId < 1 || !is_int($estateId)) {
            throw new InvalidFieldEstablishmentException('ID do estado é inválido', 'estateId');
        }
    }

    /**
     * @param $rating
     * @throws InvalidFieldEstablishmentException
     */
    private function ratingIsValid($rating)
    {
        if ($rating < 1 || $rating > 5 || !is_int($rating)) {
            throw new InvalidFieldEstablishmentException('Quando de estrelas deve ser um número inteiro de 1 a 5', 'rating');
        }
    }

    /**
     * @param string $maxDailyRate
     * @throws InvalidFieldEstablishmentException
     */
    private function maxDailyRateIsValid(string $maxDailyRate)
    {
        if (strlen($maxDailyRate) < 1) {
            throw new InvalidFieldEstablishmentException('Valor máximo da diária dever ser maior que 1', 'maxDailyRate');
        }
    }

    /**
     * @param string $minDailyRate
     * @throws InvalidFieldEstablishmentException
     */
    private function minDailyRateIsValid(string $minDailyRate)
    {
        if (strlen($minDailyRate) < 1) {
            throw new InvalidFieldEstablishmentException('Valor mínimo da diária dever ser maior que 1', 'minDailyRate');
        }
    }

    /**
     * @param string $administratorEmail
     * @throws InvalidFieldEstablishmentException
     */
    private function administratorEmailIsValid(string $administratorEmail)
    {
        if (!filter_var($administratorEmail, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidFieldEstablishmentException('Email da administração não é válido', 'administratorEmail');
        }
    }

    /**
     * @param string $commercialEmail
     * @throws InvalidFieldEstablishmentException
     */
    private function commercialEmailIsValid(string $commercialEmail)
    {
        if (!filter_var($commercialEmail, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidFieldEstablishmentException('Email comercial não é válido', 'commercialEmail');
        }
    }

    /**
     * @param string $commercialPhone
     * @throws InvalidFieldEstablishmentException
     */
    private function commercialPhoneIsValid(string $commercialPhone)
    {
        if (strlen($commercialPhone) < 11) {
            throw new InvalidFieldEstablishmentException('Telefone comercial não é válido', 'commercialPhone');
        }
    }

    /**
     * @param string $administratorPhone
     * @throws InvalidFieldEstablishmentException
     */
    private function administratorPhoneIsValid(string $administratorPhone)
    {
        if (strlen($administratorPhone) < 10) {
            throw new InvalidFieldEstablishmentException('Telefone da administração não é válido', 'administratorPhone');
        }
    }

    /**
     * @param string $latitude
     * @throws InvalidFieldEstablishmentException
     */
    private function latitudeIsValid(string $latitude)
    {
        if (strlen($latitude) < 0) {
            throw new InvalidFieldEstablishmentException('latitude não pode ser nula', 'latitude');
        }
    }

    /**
     * @param string $longitude
     * @throws InvalidFieldEstablishmentException
     */
    private function longitudeIsValid(string $longitude)
    {
        if (strlen($longitude) < 0) {
            throw new InvalidFieldEstablishmentException('longitude não pode ser nula', 'longitude');
        }
    }

    /**
     * @param $indicationDiscount
     * @throws InvalidFieldEstablishmentException
     */

    private function indicationDiscountIsValid($indicationDiscount)
    {
        if ($indicationDiscount < 0) {
            throw new InvalidFieldEstablishmentException('Desconto por indicação inválido, não pode ser negativo', 'indicationDiscount');
        }
    }

    /**
     * @param $indicationCommissionTypeId
     * @throws \app\exceptions\InvalidFieldEstablishmentException
     */
    private function indicationCommissionTypeIdIsValid($indicationCommissionTypeId)
    {
        if ($indicationCommissionTypeId < 0)
            throw new InvalidFieldEstablishmentException('Tipo de comissão por indicação não é valido', 'indicationCommissionTypeId');
    }

    /**
     * @param $indicationValue
     * @throws \app\exceptions\InvalidFieldEstablishmentException
     */
    private function indicationValueIsValid($indicationValue)
    {
        if ($indicationValue < 0)
            throw new InvalidFieldEstablishmentException('Valor por indicação não é valido', 'indicationValue');
    }
}