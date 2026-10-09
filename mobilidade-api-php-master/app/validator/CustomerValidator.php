<?php

namespace app\validator;

use app\constant\CustomerConst;
use app\exceptions\InvalidFieldCustomerException;
use app\model\User;
use DateTime;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 16/10/2018
 * Time: 01:11
 */
class CustomerValidator
{
    /**
     * @param $request
     * @param bool $requireDocumentAndDateOfBirth
     * @return bool
     * @throws InvalidFieldCustomerException
     */
    public function validateInsertCustomer($request, bool $requireDocumentAndDateOfBirth = true)
    {
        if (!$request || (is_object($request) && count(get_object_vars($request)) < 1))
            throw new InvalidFieldCustomerException("Nenhum dado foi enviado para criacao do cliente");

        $data = (isset($request->user) && (is_object($request->user) || is_array($request->user)))
            ? (object)$request->user
            : $request;

        $name = $data->name ?? ($request->name ?? '');
        $nickname = $data->nickname ?? ($request->nickname ?? '');
        if (empty($nickname) && !empty($name)) {
            $parts = explode(' ', trim($name));
            $nickname = $parts[0];
            $data->nickname = $nickname;
            $request->nickname = $nickname;
        }

        $this->nameIsValid($name);
        $this->nicknameIsValid($nickname);

        $doc = $data->document ?? ($request->document ?? '');
        $dob = $data->dateOfBirth ?? ($request->dateOfBirth ?? '');

        if ($requireDocumentAndDateOfBirth) {
            $this->documentIsValid($doc);
            $this->dateOfBirthIsValid($dob);
        } else {
            if (!empty($doc)) {
                $this->documentIsValid($doc);
            }
            if (!empty($dob)) {
                $this->dateOfBirthIsValid($dob);
            }
        }

        $this->emailIsValid($data->email ?? ($request->email ?? ''));
        $this->phoneIsValid($data->phone ?? ($request->phone ?? ''));
        if (isset($data->password) || isset($request->password))
            $this->passwordIsValid($data->password ?? $request->password);
        if (isset($data->driverId) || isset($request->driverId))
            $this->driverIdIsValid($data->driverId ?? $request->driverId);
        $regIn = $data->registered_in ?? ($request->registered_in ?? null);
        if (isset($regIn) && !in_array($regIn, [CustomerConst::REGISTERED_IN_MOBILITY, CustomerConst::REGISTERED_IN_DELIVERY]))
            throw new InvalidFieldCustomerException('Valor de registro inválido');

        return true;
    }

    /**
     * @param $request
     * @return bool
     * @throws InvalidFieldCustomerException
     */
    public function validateInsertCustomerBySocial($request)
    {
        if (!$request || count(get_object_vars($request)) < 1)
            throw new InvalidFieldCustomerException("Nenhum dado foi enviado para criacao do cliente");

        $this->nameIsValid($request->name ?? '');
        $this->nicknameIsValid($request->nickname ?? '');
        
        // Validação de identificadores sociais
        $this->validateSocialIdentifiers(
            $request->email ?? null,
            $request->phone ?? null,
            $request->facebook_id ?? null,
            $request->google_id ?? null
        );

        return true;
    }

    /**
     * @param $password
     * @return bool
     * @throws InvalidFieldCustomerException
     */
    public function validateChangePassword($password)
    {
        $this->passwordIsValid($password);

        return true;
    }

    /**
     * @param \app\model\User $user
     * @return bool
     * @throws InvalidFieldCustomerException
     */
    public function validateLogin(User $user, $withoutDeviceToken = false)
    {
        $this->emailIsValid($user->getEmail());
        $this->passwordIsValid($user->getPassword());
        if (!$withoutDeviceToken)
            $this->deviceToken($user->getDeviceToken());

        return true;
    }

    /**
     * @param \app\model\User $user
     * @return bool
     * @throws InvalidFieldCustomerException
     */
    public function validateLoginPartner(User $user)
    {
        $this->emailIsValid($user->getEmail());
        $this->passwordIsValid($user->getPassword());

        return true;
    }

    /**
     * @param User $user
     * @return bool
     * @throws InvalidFieldCustomerException
     */
    public function validateSocialLogin(User $user)
    {
        return $this->validateSocialIdentifiers($user->getEmail(), $user->getPhone(), $user->getFacebookId(), $user->getGoogleId());
    }

    /**
     * @param string $name
     * @throws InvalidFieldCustomerException
     */
    private function nameIsValid(string $name)
    {
        if (strlen($name) < 3)
            throw new InvalidFieldCustomerException('Nome Inválido', 'name');
    }

    /**
     * @param string $nickname
     * @throws InvalidFieldCustomerException
     */
    private function nicknameIsValid(string $nickname)
    {
        if (strlen($nickname) < 2)
            throw new InvalidFieldCustomerException("Apelido inválido", 'nickname');
    }

    /**
     * @param string $document
     * @throws InvalidFieldCustomerException
     */
    private function documentIsValid(string $document)
    {
        if (strlen($document) < 11)
            throw new InvalidFieldCustomerException("Documento é inválido", 'document');
    }

    /**
     * @param string $dateOfBirth
     * @throws InvalidFieldCustomerException
     */
    private function dateOfBirthIsValid(string $dateOfBirth)
    {
        if (!$dateOfBirth)
            throw new InvalidFieldCustomerException("Data de nascimento não enviada", 'dateOfBirth');

        $parsed = DateTime::createFromFormat('Y-m-d', $dateOfBirth);

        if (!$parsed || $parsed->format('Y-m-d') !== $dateOfBirth)
            throw new InvalidFieldCustomerException("Data de nascimento é inválida", 'dateOfBirth');
    }

    /**
     * @param string $email
     * @throws InvalidFieldCustomerException
     */
    private function emailIsValid($email)
    {
        if (!$email)
            throw new InvalidFieldCustomerException(
                "Não foi possível capturar seu email, por favor, tente o formulário de cadastro!"
            );

        if (!filter_var($email, FILTER_VALIDATE_EMAIL))
            throw new InvalidFieldCustomerException("Email inválido", 'email');
    }

    /**
     * @param $phone
     * @throws InvalidFieldCustomerException
     */
    private function phoneIsValid($phone)
    {
        if (strlen($phone) < 5)
            throw new InvalidFieldCustomerException("Número de telefone não enviado", 'phone');
    }

    /**
     * @param $password
     * @throws InvalidFieldCustomerException
     */
    private function passwordIsValid($password)
    {
        if (!$password)
            throw new InvalidFieldCustomerException("A senha não pode ser vazia", 'password');

        if (strlen($password) < 5)
            throw new InvalidFieldCustomerException("A senha deve ter pelo menos 5 caracteres", 'password');
    }

    /**
     * @param $deviceToken
     * @throws InvalidFieldCustomerException
     */
    private function deviceToken($deviceToken)
    {
        if (!$deviceToken)
            throw new InvalidFieldCustomerException("O token do dispositivo não pode ser vazio", 'deviceToken');
    }

    /**
     * @param $facebook_id
     * @throws InvalidFieldCustomerException
     */
    private function facebookIdIsValid($facebook_id)
    {
        if (strlen($facebook_id) < 2)
            throw new InvalidFieldCustomerException(
                "Não foi possível autenticar através do facebook, tente o cadastro",
                'facebook_id'
            );
    }

    /**
     * @param $driverId
     * @throws InvalidFieldCustomerException
     */
    private function driverIdIsValid($driverId)
    {
        if (strlen($driverId) < 1)
            throw new InvalidFieldCustomerException("ID do motorista inválido", 'driverId');
    }

    /**
     * @param $google_id
     * @throws InvalidFieldCustomerException
     */
    private function googleIdIsValid($google_id)
    {
        if (strlen($google_id) < 2)
            throw new InvalidFieldCustomerException(
                "Não foi possível autenticar através do Google, tente o cadastro",
                'google_id'
            );
    }

    /**
     * Valida identificadores sociais de forma centralizada
     * @param string|null $email
     * @param string|null $phone
     * @param string|null $facebookId
     * @param string|null $googleId
     * @return bool
     * @throws InvalidFieldCustomerException
     */
    private function validateSocialIdentifiers($email = null, $phone = null, $facebookId = null, $googleId = null)
    {
        if ($email) {
            $this->emailIsValid($email);
            return true;
        }

        if ($phone) {
            $this->phoneIsValid($phone);
            return true;
        }

        if ($facebookId) {
            $this->facebookIdIsValid($facebookId);
            return true;
        }

        if ($googleId) {
            $this->googleIdIsValid($googleId);
            return true;
        }

        throw new InvalidFieldCustomerException(
            "É necessário pelo menos um identificador válido (email, telefone, Facebook ID ou Google ID)",
            'social_login'
        );
    }
}