<?php

namespace app\controllers;

use app\dao\UserDao;
use app\dao\UserTypeDao;
use app\services\UserDuplicateCheckService;
use app\services\UserService;
use app\utils\Headers;
use Exception;
use app\model\User;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 13/07/2018
 * Time: 15:52
 */
class UserController extends ApiController
{
    protected $userDao;

    public function __construct()
    {
        $this->userDao = new UserDao;
    }

    public function actionAuthenticate()
    {
        $user = new User($this->request());

        try {
            echo $this->returnSuccess("Sucesso", $this->userDao->authenticate($user));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionLogin()
    {
        $this->actionAuthenticate();
    }

    public function actionRegister()
    {
        try {
            $data = !empty($_POST) ? (object)$_POST : $this->request();
            if (empty($data->nickname) && !empty($data->name)) {
                $parts = explode(' ', trim($data->name));
                $data->nickname = $parts[0];
            }
            if (empty($data->password)) {
                $data->password = 'Movy@' . rand(1000, 9999);
            }
            if (empty($data->registered_in)) {
                $data->registered_in = \app\constant\CustomerConst::REGISTERED_IN_MOBILITY;
            }

            $user = (new \app\dao\CustomerDao)->register($data, $_FILES ?? null);

            echo $this->returnSuccess("Cadastrado com sucesso", [
                'user' => $user ? (is_object($user) && method_exists($user, 'toStdClass') ? $user->toStdClass() : $user) : true
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionCheckAccountAppPartner()
    {
        try {
            $email = $this->request()->email;

            echo $this->returnSuccess("Sucesso", $this->userDao->checkAccountAppPartner($email));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionCheckEmail()
    {
        try {
            echo $this->returnSuccess("Email existe", $this->userDao->checkEmail($this->request()->email));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionCheckPhone()
    {
        try {
            $request = $this->request() ?? (object) $this->requestQuery();
            $userTypeIds = (new UserDuplicateCheckService)->resolveUserTypeIdsFromRequest($request);
            $phone = $request->phone ?? null;

            echo $this->returnSuccess(
                "Telefone já cadastrado",
                $this->userDao->checkPhone($phone, $userTypeIds)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionCheckDocument()
    {
        try {
            $request = $this->request() ?? (object) $this->requestQuery();
            $userTypeIds = (new UserDuplicateCheckService)->resolveUserTypeIdsFromRequest($request);
            $document = $request->document ?? null;

            echo $this->returnSuccess(
                "Documento existe",
                $this->userDao->checkDocument($document, $userTypeIds)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionUpdateCustomerDocs()
    {
        try {
            $photos = $_FILES;
            $request = $_POST;

            $result = (new UserService)
                ->updateCustomerDocs(Headers::getUserId(), $photos, $request);

            echo $this->returnSuccess("Sucesso", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao reenviar os documentos");
        }
    }

    public function actionUpdateCustomerPhotosRG()
    {
        try {
            $photos = $_FILES;
            $result = (new UserService)
                ->updateCustomerPhotosRG(Headers::getUserId(), $photos);

            echo $this->returnSuccess("Sucesso", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao reenviar os documentos");
        }
    }

    public function actionGetUserTypes()
    {
        try {
            echo $this->returnSuccess("Tipos de Usuários",
                (new UserTypeDao)->getAll()
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionChangeProfile()
    {
        try {
            $userId = $_POST['userId'];
            $photo = $_FILES['photo'];
            $result = (new UserService)
                ->changeProfile($userId, $photo);

            echo $this->returnSuccess("Sucesso", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao reenviar os documentos");
        }
    }

    public function actionRemoveAccountRequest()
    {
        try {
            $request = $this->request(false);
            $userId = Headers::getUserId();

            $result = (new UserService)
                ->removeAccountRequest($userId, $request);

            echo $this->returnSuccess("Sucesso", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao remover dados da conta");
        }
    }
}