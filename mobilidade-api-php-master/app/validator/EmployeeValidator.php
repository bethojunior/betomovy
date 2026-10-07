<?php

namespace app\validator;

use app\exceptions\InvalidFieldEmployeeException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/09/2018
 * Time: 17:13
 */
class EmployeeValidator
{
    /**
     * @param $request
     * @return bool
     * @throws InvalidFieldEmployeeException
     */
    public function validateEmployee($request)
    {
        if (!$request || count(get_object_vars($request)) < 1)
            throw new InvalidFieldEmployeeException("Nenhum dado foi enviado para criacao de employee");

        $this->nameIsValid($request->name ?? '');
        $this->nicknameIsValid($request->nickname ?? '');
        $this->documentIsValid($request->document ?? '');
        $this->emailIsValid($request->email ?? '');
        $this->phoneIsValid($request->phone ?? '');

        return true;
    }

    /**
     * @param string $name
     * @throws InvalidFieldEmployeeException
     */
    private function nameIsValid(string $name)
    {
        if (strlen($name) < 3)
            throw new InvalidFieldEmployeeException('Nome Inválido', 'name');
    }

    /**
     * @param string $nickname
     * @throws InvalidFieldEmployeeException
     */
    private function nicknameIsValid(string $nickname)
    {
        if (strlen($nickname) < 2)
            throw new InvalidFieldEmployeeException("Apelido inválido", 'nickname');
    }

    /**
     * @param string $document
     * @throws InvalidFieldEmployeeException
     */
    private function documentIsValid(string $document)
    {
        if (strlen($document) < 11)
            throw new InvalidFieldEmployeeException("Documento é inválido", 'document');
    }

    /**
     * @param string $email
     * @throws InvalidFieldEmployeeException
     */
    private function emailIsValid(string $email)
    {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL))
            throw new InvalidFieldEmployeeException("Email inválido", 'email');
    }

    /**
     * @param $phone
     * @throws InvalidFieldEmployeeException
     */
    private function phoneIsValid($phone)
    {
        if (strlen($phone) < 5)
            throw new InvalidFieldEmployeeException("Telefone inválido", 'phone');
    }

    /**
     * @param $occupation
     * @throws InvalidFieldEmployeeException
     */
    private function occupationIsValid($occupation)
    {
        if (strlen($occupation) < 2)
            throw new InvalidFieldEmployeeException("Cargo Inválido", 'occupation');
    }

    /**
     * @param $userTypeId
     * @throws InvalidFieldEmployeeException
     */
    private function userTypeIdIsValid($userTypeId)
    {
        if (!$userTypeId || strlen($userTypeId) < 1)
            throw new InvalidFieldEmployeeException("Tipo de usuário inválido", 'userTypeId');
    }

    /**
     * @param $commission
     * @throws InvalidFieldEmployeeException
     */
    private function commissionIsValid($commission)
    {
        if (is_string($commission) || $commission < 0)
            throw new InvalidFieldEmployeeException("Comissão é inválida", 'comission');
    }
}