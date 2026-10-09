<?php

namespace app\validator;

use app\exceptions\ApiTokenException;
use app\model\Partner;
use app\model\Status;
use app\model\User;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 03/11/2018
 * Time: 12:28
 */
class RequestHeaderValidator
{
    /**
     * @param array $data
     * @return bool
     * @throws ApiTokenException
     */
    public function validateRequestHeader(array $data)
    {
        $this->tokenIsValid($data['token'] ?? null);

        $this->userIdIsValid($data['userId'] ?? null);

        return true;
    }

    /**
     * @param User $user
     * @param $token
     * @param Partner|null $partnerToken
     * @return bool
     * @throws ApiTokenException
     */
    public function verifyUserToken(User $user, $token, ?Partner $partnerToken = null)
    {
        if ($user->getStatusId() == Status::EXCLUIDO || $user->isBlocked())
            throw new ApiTokenException("Usuário não autorizado");

        $tokenIsValid = true;

        if (!password_verify($user->getApiToken(), $token))
            $tokenIsValid = false;

        if (!$tokenIsValid && $partnerToken && password_verify($partnerToken->getApiToken(), $token))
            $tokenIsValid = true;

        if (!$tokenIsValid)
            throw new ApiTokenException("Token inválido", [
                'user' => $user->toArray(),
                'partner' => $partnerToken ? $partnerToken->toArray() : null,
                'token' => $token
            ]);

        return true;
    }

    /**
     * @param $token
     * @throws ApiTokenException
     */
    private function tokenIsValid($token)
    {
        if (empty($token) || $token === 'undefined' || $token === 'null')
            throw new ApiTokenException("Token não enviado", $token);

        if (password_get_info($token)['algo'] != PASSWORD_BCRYPT)
            throw new ApiTokenException("Token não possui o formato válido", $token);
    }

    /**
     * @param $userId
     * @throws ApiTokenException
     */
    private function userIdIsValid($userId)
    {
        if (empty($userId) || $userId === 'undefined' || $userId === 'null')
            throw new ApiTokenException("Usuário inválido");
    }
}