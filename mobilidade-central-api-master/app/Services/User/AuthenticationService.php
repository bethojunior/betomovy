<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/06/2019
 * Time: 10:52
 */

namespace App\Services\User;


use App\Exceptions\User\AuthenticationException;
use App\Models\User\User;
use App\Repositories\User\PartnerRepository;
use App\Repositories\User\UserRepository;
use App\Utils\TokenApi;
use Illuminate\Support\Facades\Cache;

class AuthenticationService
{
    /**
     * @var UserRepository
     */
    private $repository;
    /**
     * @var TokenApi
     */
    private $tokenApi;
    /**
     * @var PartnerRepository
     */
    private $partnerRepository;

    public function __construct(UserRepository $repository,
                                PartnerRepository $partnerRepository,
                                TokenApi $tokenApi)
    {
        $this->repository = $repository;
        $this->tokenApi = $tokenApi;
        $this->partnerRepository = $partnerRepository;
    }

    /**
     * @param $request
     * @return User
     * @throws AuthenticationException
     */
    public function authenticate($request)
    {
        /** @var User $user */
        $user = $this->repository->findByAuth(
            $request['email'], base64_encode($request['password']));

        if (!$user) {
            throw new AuthenticationException("Usuário ou Senha inválida");
        }

        $isAppPartner = filter_var(env('APP_PARTNER', false), FILTER_VALIDATE_BOOLEAN);
        $hasAppPartnerUser = !is_null($user->key_app_partner);

        if (!$isAppPartner && $hasAppPartnerUser) {
            throw new AuthenticationException("Usuário ou Senha inválida");
        }

        $partner = $this->partnerRepository
            ->findByUser($user->idUser);

        $partner->api_token = $this->tokenApi
            ->generate($user->idUser);

        $this->partnerRepository
            ->save($partner);

        $user->api_token = $this->tokenApi
            ->encrypt($partner->api_token);

        Cache::forget("user-{$user->idUser}");

        return $user;
    }

    public function getCredentials($userId)
    {
        /** @var User $user */
        $user = $this->repository->findById($userId);

        $partner = $this->partnerRepository
            ->findByUser($user->idUser);

        $partner->api_token = $this->tokenApi
            ->generate($user->idUser);

        $this->partnerRepository
            ->save($partner);

        $user->api_token = $this->tokenApi
            ->encrypt($partner->api_token);

        return $user;
    }
}
