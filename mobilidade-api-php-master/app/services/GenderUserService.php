<?php

namespace app\services;

use app\constant\GenderConst;
use app\dao\UserDao;
use app\exceptions\CpfCnpjApiException;
use app\utils\CpfCnpjApi;
use Exception;
use app\model\User;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 12/08/2019
 * Time: 11:03
 */
class GenderUserService
{
    private $dao;
    private $cpfCnpjApi;

    public function __construct()
    {
        $this->dao = new UserDao;
        $this->cpfCnpjApi = new CpfCnpjApi;
    }

    /**
     * @param $idUser
     * @return mixed
     * @throws Exception
     */
    public function checkAndUpdate($idUser)
    {
        $user = $this->dao
            ->find($idUser);

        if (!$user)
            throw new Exception("Usuário não encontrado");

        $user = new User($user);

        if (!$user->getGender())
            $user->setGender($this->updateGender($user));

        switch ($user->getGender()) {
            case GenderConst::DB_MALE:
                return GenderConst::MALE_ID;
            case GenderConst::DB_FEMALE:
                return GenderConst::FEMALE_ID;
            default:
                return null;
        }
    }

    /**
     * @param User $user
     * @return string
     * @throws CpfCnpjApiException
     * @throws Exception
     */
    private function updateGender(User $user)
    {
        if (!$user->getDocument())
            throw new Exception("Usuário está com o cpf vazio");

        $userData = $this->cpfCnpjApi
            ->cpfQuery($user->getDocument());

        if (!$userData)
            return null;

        switch ($userData->genero) {
            case GenderConst::MALE:
                $this->dao
                    ->update(['gender' => GenderConst::DB_MALE], $user->getIdUser());
                return
                    GenderConst::DB_MALE;
            case GenderConst::FEMALE:
                $this->dao
                    ->update(['gender' => GenderConst::DB_FEMALE], $user->getIdUser());
                return
                    GenderConst::DB_FEMALE;
            default:
                return null;
        }
    }
}