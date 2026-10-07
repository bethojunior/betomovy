<?php

namespace app\services;

use app\dao\UserDao;
use app\dao\UserTypeDao;
use app\model\UserType;

/**
 * Validação de identidade (telefone/documento) escopada por tipo de perfil.
 */
class UserDuplicateCheckService
{
    private UserDao $userDao;

    public function __construct(?UserDao $userDao = null)
    {
        $this->userDao = $userDao ?? new UserDao();
    }

    /**
     * @param int[] $userTypeIds
     */
    public function phoneExistsForUserTypes($phone, array $userTypeIds, $ignorePhone = null)
    {
        return $this->userDao->existsActivePhoneForUserTypes($phone, $userTypeIds, $ignorePhone);
    }

    /**
     * @param int[] $userTypeIds
     */
    public function documentExistsForUserTypes($document, array $userTypeIds, $ignoreDocument = null)
    {
        return $this->userDao->existsActiveDocumentForUserTypes($document, $userTypeIds, $ignoreDocument);
    }

    /**
     * @param int[]|null $userTypeIds null = qualquer perfil ativo (retrocompat login)
     */
    public function findActiveUserByPhone($phone, ?array $userTypeIds = null)
    {
        return $this->userDao->findActiveUserByPhone($phone, $userTypeIds);
    }

    /**
     * @param int[]|null $userTypeIds
     */
    public function findActiveUserByDocument($document, ?array $userTypeIds = null)
    {
        return $this->userDao->findActiveUserByDocument($document, $userTypeIds);
    }

    /**
     * @param object $request
     * @return int[]|null
     */
    public function resolveUserTypeIdsFromRequest($request): ?array
    {
        if (isset($request->userTypeIds) && is_array($request->userTypeIds)) {
            return array_map('intval', $request->userTypeIds);
        }

        if (isset($request->userTypeId) && is_numeric($request->userTypeId)) {
            return [(int) $request->userTypeId];
        }

        $profileScope = $request->profileScope ?? $request->registerScope ?? null;

        if ($profileScope === 'customer') {
            return $this->getCustomerRegisterUserTypeIds();
        }

        if ($profileScope === 'driver') {
            return $this->getDriverRegisterUserTypeIds();
        }

        return null;
    }

    /**
     * @return int[]
     */
    public function getCustomerRegisterUserTypeIds(): array
    {
        $ids = (new UserTypeDao)->getIdsTypeCustomer();

        if (!empty($ids)) {
            return $ids;
        }

        return [UserType::CLIENTE_FINAL, UserType::CLIENTE_FINAL_PARCEIRO];
    }

    /**
     * @return int[]
     */
    public function getDriverRegisterUserTypeIds(): array
    {
        $ids = (new UserTypeDao)->getIdsTypeDriver();

        if (!empty($ids)) {
            return $ids;
        }

        return UserType::DRIVERS_TYPE;
    }
}
