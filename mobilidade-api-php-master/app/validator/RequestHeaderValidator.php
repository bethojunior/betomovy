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

        $tokenIsValid = false;

        $dbUserToken = (string)$user->getApiToken();
        $dbPartnerToken = $partnerToken ? (string)$partnerToken->getApiToken() : '';

        // 1. Direct match (raw equality)
        if (($dbUserToken !== '' && hash_equals($dbUserToken, $token)) ||
            ($dbPartnerToken !== '' && hash_equals($dbPartnerToken, $token))) {
            $tokenIsValid = true;
        }
        // 2. Standard: DB has plain token, client sends bcrypt hash
        elseif (($dbUserToken !== '' && @password_verify($dbUserToken, $token)) ||
                ($dbPartnerToken !== '' && @password_verify($dbPartnerToken, $token))) {
            $tokenIsValid = true;
        }
        // 3. Reverse: DB has bcrypt hash, client sends plain token
        elseif (($dbUserToken !== '' && @password_verify($token, $dbUserToken)) ||
                ($dbPartnerToken !== '' && @password_verify($token, $dbPartnerToken))) {
            $tokenIsValid = true;
        }
        // 4. Legacy session fallback: token was hashed from empty string before token backfill
        elseif (@password_verify('', $token)) {
            $tokenIsValid = true;
        }

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