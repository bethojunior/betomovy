<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/06/2019
 * Time: 10:52
 */

namespace App\Services\User;

use App\Audit\InternalAudit;
use App\Constants\Config\StatusPayConfig;
use App\Exceptions\User\AuthenticationException;
use App\Helpers\Role\RoleHelper;
use App\Models\User\User;
use App\Repositories\Config\SystemConfigRepository;
use App\Repositories\InternalAudit\InternalAuditRepository;
use App\Repositories\User\PartnerRepository;
use App\Repositories\User\UserRepository;
use App\Utils\TokenApi;
use Illuminate\Http\Request;


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
    /**
     * @var RoleHelper
     */
    private $roleHelper;
    /**
     * @var InternalAuditRepository
     */
    private $internalAuditRepository;

    public function __construct(UserRepository $repository,
                                PartnerRepository $partnerRepository,
                                RoleHelper $roleHelper,
                                TokenApi $tokenApi,
                                InternalAuditRepository $internalAuditRepository)
    {
        $this->repository = $repository;
        $this->tokenApi = $tokenApi;
        $this->partnerRepository = $partnerRepository;
        $this->roleHelper = $roleHelper;
        $this->internalAuditRepository = $internalAuditRepository;
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
            $request['email'],
            base64_encode($request['password'])
        );

        if (!$user) {
            throw new AuthenticationException("Usuário ou Senha inválida");
        }

        $statusPay = (new SystemConfigRepository())->getStatusPay();

        $matches = [];
        $latitude = null;
        $longitude = null;
        if(!empty($request['localization'])) {
            preg_match('/q=([-0-9.]+),([-0-9.]+)/', $request['localization'], $matches);
            $latitude = $matches[1] ?? null;
            $longitude = $matches[2] ?? null;
        }
        // Verifica se o e-mail não é suporte@fabrica704.com.br, se é Perfil Admin e se as coordenadas não estão dentro de Fortaleza
        if (!($request['email'] == 'suporte@fabrica704.com.br' &&
            $user->roleId == 1 &&
            $latitude && $longitude &&
            $this->isWithinFortaleza($latitude, $longitude))) {
            // Lança a exceção somente se as condições não forem atendidas
            if ($statusPay && (int)$statusPay->id == StatusPayConfig::BLOCKED) {
                throw new AuthenticationException($statusPay->message);
            }
        }

        $user->api_token = $this->tokenApi
            ->generate($user->idUser);

        $this->repository
            ->save($user);

        try {
            $this->internalAuditRepository
                ->createRegisterLog($request, $user->idUser);
        } catch (\Throwable $t) {
            \Log::warning('Falha ao registrar auditoria de login: ' . $t->getMessage());
        }

        $user->api_token = $this->tokenApi
            ->encrypt($user->api_token);

        $user = $user->toArray();
        $user['role'] = $this->roleHelper
            ->findFully($user['roleId']);

        $user['statusPay'] = $statusPay ?: null;

        return $user;
    }

    /**
     * @param $request
     * @return User
     * @throws AuthenticationException
     */
    public function authenticateCompany($request)
    {

        /** @var User $user */
        $user = $this->repository->findByAuthCompany(
            $request['email'], base64_encode($request['password']));

        if (!$user)
            throw new AuthenticationException("Usuário ou Senha inválida");

        $user->api_token = $this->tokenApi
            ->generate($user->idUser);

        $this->repository
            ->save($user);

        $user->api_token = $this->tokenApi
            ->encrypt($user->api_token);

        return $user;
    }

    /**
     * @param $latitude
     * @param $longitude
     * @return bool
     */
    private function isWithinFortaleza($latitude, $longitude)
    {
        // Limites aproximados de Fortaleza
        $fortalezaBounds = [
            'minLatitude' => -3.9440,
            'maxLatitude' => -3.7184,
            'minLongitude' => -38.6216,
            'maxLongitude' => -38.4396,
        ];

        // Verifica se as coordenadas estão dentro dos limites
        if (
            $latitude >= $fortalezaBounds['minLatitude'] &&
            $latitude <= $fortalezaBounds['maxLatitude'] &&
            $longitude >= $fortalezaBounds['minLongitude'] &&
            $longitude <= $fortalezaBounds['maxLongitude']
        ) {
            return true;
        }

        return false;
    }

}
