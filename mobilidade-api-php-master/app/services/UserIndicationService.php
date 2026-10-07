<?php

namespace app\services;

use app\dao\UserIndicationDao;
use app\exceptions\RequestValidatorException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 21/10/2019
 * Time: 17:38
 */
class UserIndicationService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new UserIndicationDao;
    }

    /**
     * @param $userId
     * @param null $request
     * @return array
     * @throws RequestValidatorException
     */
    public function getIndicated($userId, $request = null)
    {
        if (!$userId)
            throw new RequestValidatorException(1101);

        return $this->dao
            ->getIndicatedUsersByWhoIndicated(
                $userId,
                $request->cityId ?? null,
                $request->page ?? 1);
    }
}