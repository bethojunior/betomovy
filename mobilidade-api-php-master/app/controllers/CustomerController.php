<?php

namespace app\controllers;
use app\dao\CustomerDao;
use app\dao\CustomerPartnerDao;
use app\constant\ZafiraConst;
use app\services\CustomerService;
use app\services\PriceCustomerService;
use app\services\RefusedDriverService;
use app\services\TripCancellationCustomerFeeService;
use app\services\Zafira\ZafiraRegistrationValidationService;
use app\services\UserDuplicateCheckService;
use Exception;
use app\model\Trip;
use app\model\User;
use app\utils\Headers;
use app\utils\Connection;
use PDO;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 16/10/2018
 * Time: 01:03
 */
class CustomerController extends ApiController
{
    public function actionLoginPartner()
    {
        try {
            $request = $this->request();

            echo $this->returnSuccess("Autenticação efetuada",
                (new CustomerDao)->loginPartner(new User($request))
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionSocialLoginPartner()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess("Autenticação efetuada",
                (new CustomerDao)->socialLoginPartner(new User($request))
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionLogin()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess("Autenticação efetuada",
                (new CustomerDao)->login(new User($request), $request->generateToken ?? true, $request->keyAppPartner ?? null)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionNewSocialLogin()
    {
       try {
        echo $this->returnSuccess("Código de login social gerado com sucesso",
        (new CustomerDao)->newSocialLogin()
    );
       } catch (Exception $e) {
        echo $this->returnError($e);
       }
    }

    public function actionGetSocialLogin()
    {
        try {
            $id = $_GET['id'] ?? null;
            echo $this->returnSuccess("Sucesso ao buscar o login social",
            (new CustomerDao)->getSocialLogin($id)
        );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionUpdateSocialLogin()
    {
        try {
            $request = $this->request(false);
            echo $this->returnSuccess("login social atualizado com sucesso",
            (new CustomerDao)->updateSocialLogin($request)
        );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionLoginSocial()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess("Autenticação efetuada",
                (new CustomerDao)->loginSocial(new User($request))
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionAutoLogin()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess("Autenticação efetuada",
                (new CustomerDao)->autoLoginById($request)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionLoginByPhone()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess("Autenticação efetuada",
                (new CustomerDao)->autoLoginByPhone($request));

        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionRegister()
    {
        try {
            echo $this->returnSuccess("Cadastrado com sucesso",
                (new CustomerDao)->register($this->request())
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionRegisterWithPictures()
    {
        $object = json_decode($_POST['stdObject']);
        $photos = $_FILES;

        try {
            echo $this->returnSuccess("Cadastrado com sucesso",
                (new CustomerDao)->register($object, $photos)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionRegisterPartner()
    {
        try {
            (new CustomerDao)->registerPartner($this->request());
            echo $this->returnSuccess("Cadastrado com sucesso", true);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionNewTrip()
    {
        try {
            echo $this->returnSuccess("Viagem inserida",
                (new CustomerDao)->newTrip($this->request())
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionCheckCancellationFee()
    {
        try {
            echo $this->returnSuccess("Resultado da taxa de cancelamento",
                (new TripCancellationCustomerFeeService)
                    ->check($this->request(false)->tripReference)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionCancelTrip()
    {
        try {
            $request = $this->request();

            $status = $request->status ?? Trip::CANCELED;

            echo $this->returnSuccess("Viagem cancelada",
                (new CustomerDao)->cancelTrip($request->tripReference, $request->dateEnd, $request->userId,
                    $status, $request->scheduledTrip ?? false, $request->cancellationReasonsId ?? null)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetCurrentTrips()
    {
        try {
            echo $this->returnSuccess("Listando corridas atuais",
                (new CustomerDao)->getCurrentPartnerTrips($this->request()->userId));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetPartnerTrips()
    {
        try {
            echo $this->returnSuccess("Listando corridas",
                (new CustomerPartnerDao)->getTrips($this->request())
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetTrips()
    {
        try {
            echo $this->returnSuccess("Listando corridas",
                (new CustomerDao)
                    ->getTrips($this->request(false))
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetBalance()
    {
        try {
            echo $this->returnSuccess("Saldo Encontrado",
                (new CustomerDao)->getPartnerBalance($this->request()->userId)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionFind()
    {
        try {
            echo $this->returnSuccess("Cliente encontrado",
                (new CustomerDao)->findWithTrip()
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionForgotPassword()
    {
        try {
            echo $this->returnSuccess("Código enviado com sucesso",
                (new CustomerDao)
                    ->forgotPassword($this->request(false)->email)
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao enviar código");
        }
    }

    public function actionForgotPasswordPro()
    {
        try {
            echo $this->returnSuccess("Código enviado com sucesso",
                (new CustomerDao)
                    ->forgotPasswordPro($this->request(false)->data, $this->request(false)->type)
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao enviar código");
        }
    }

    public function actionChangePassword()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess("Senha alterada",
                (new CustomerDao)
                    ->changePassword($request->email, $request->password, false, $request->is_pro, $request->code)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    // ATUALIZAÇÃO DE SENHA POR DENTRO DO APP (ROTA PRIVADA)
    public function actionUpdatePassword()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess(
                "Senha alterada",
                (new CustomerDao)
                    ->changePassword($request->email, $request->password, $request->withoutCode ?? false,false, null)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionHelpMeEmail()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess("Email enviado",
                (new CustomerService)->sendHelpMeEmail($request->userId, $request->message)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionUpdateProfileImage()
    {
        try {
            $customerId = $_POST['customerId'] ?? null;
            $photo = $_FILES['photo'] ?? null;

            echo $this->returnSuccess("Foto de perfil atualizada",
                (new CustomerDao)
                    ->updateProfileImage($customerId, $photo)
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao atualizar foto de perfil");
        }
    }

    public function actionEditProfile()
    {
        try {
            echo $this->returnSuccess("Perfil atualizado",
                (new CustomerDao)->editProfile($this->request(false))
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionCheckEmail()
    {
        try {
            echo $this->returnSuccess("Email existe",
                (new CustomerDao)->checkEmail($this->request()->email));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionCheckPhone()
    {
        try {
            $request = $this->request() ?? (object) $this->requestQuery();
            $duplicateCheck = new UserDuplicateCheckService;
            $userTypeIds = $duplicateCheck->resolveUserTypeIdsFromRequest($request);
            $phone = $request->phone ?? null;

            echo $this->returnSuccess(
                "Telefone disponível",
                (new CustomerDao)->checkPhoneAvailableForRegister($phone, $userTypeIds)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionCheckDocument()
    {
        try {
            echo $this->returnSuccess("Documento existe",
                (new CustomerDao)->checkDocument($this->request(false)->document)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionSendConfirmationCode()
    {
        try {
            echo $this->returnSuccess("SMS enviado",
                (new CustomerService)
                    ->sendConfirmationSms($this
                        ->request(false)));
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao enviar o código de confirmação");
        }
    }

    public function actionCheckPassword()
    {
        try {
            echo $this->returnSuccess("Senha correta",
                (new CustomerDao)
                    ->checkPassword($this->request(false)->password)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionSearchValueCancellationFee()
    {
        try {
            echo $this->returnSuccess("Valor de taxa de cancelamento",
                (new PriceCustomerService)
                    ->searchCancellationFree($this->request(false)->userId)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionRequestDeleteData()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess("Dados excluido com sucesso",
                (new CustomerService)->requestDeleteData($request)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionDriversBlockedByCustomer()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess("Motoristas recusados encontrados",
                (new RefusedDriverService)
                    ->listDriversBlockedByCustomer($request->driverId)
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao listar motoristas recusados");
        }
    }

    public function actionGetInformationsByProjectName()
    {
        $informationsCustomer = new Client();

        $projectName = $_GET["projectName"];

        $apiUrl = env('URL_ADMIN_ANA') . 'customerApp/external/'. $projectName;

        try{
            $responsePublicities = $informationsCustomer->request('GET', $apiUrl, [
                'headers' => [
                    'id' => env('ID_AUTH'),
                    'secret' => env("SECRET_AUTH")
                ]
            ]);

            $responseJson = json_decode($responsePublicities->getBody(), true);

            echo $this->returnSuccess("Informações do cliente capturadas com sucesso", $responseJson);
        }catch(Exception $error){
            echo $this->returnError($error, "Erro ao pegar informações do cliente");
        }
    }

    public function actionValidateRegistration()
    {
        try {
            $userId = Headers::getUserId();
            if (!$userId) {
                throw new Exception('Usuário não identificado. Faça login novamente.');
            }

            $payload = ZafiraRegistrationValidationService::resolvePayloadFromRequest();
            $cityId = Headers::getCityId() ? (int) Headers::getCityId() : null;

            $result = (new ZafiraRegistrationValidationService())->validateForDriver(
                (int) $userId,
                $cityId,
                $payload
            );

            echo $this->returnSuccess('Validação realizada com sucesso', $result);
        } catch (GuzzleException $e) {
            echo $this->returnError(new Exception(ZafiraConst::PUBLIC_ERROR), ZafiraConst::PUBLIC_ERROR);
        } catch (Exception $e) {
            $message = $e->getMessage() ?: 'Erro ao validar cadastro';
            echo $this->returnError($e, $message);
        }
    }

    public function actionCentral()
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL_RO);
            $page = isset($_GET['page']) && (int)$_GET['page'] > 0 ? (int)$_GET['page'] : 1;
            $name = isset($_GET['name']) ? trim($_GET['name']) : '';
            $perPage = 15;
            $offset = ($page - 1) * $perPage;

            $whereSql = "WHERE cu.statusId = 1";
            $params = [];
            if (!empty($name)) {
                $whereSql .= " AND (u.name LIKE :name OR u.email LIKE :name OR c.name LIKE :name)";
                $params[':name'] = "%{$name}%";
            }

            // Total count
            $countStmt = $pdo->prepare("
                SELECT COUNT(*) as total
                FROM centralUser cu
                INNER JOIN user u ON u.idUser = cu.userId
                INNER JOIN central c ON c.id = cu.centralId
                {$whereSql}
            ");
            $countStmt->execute($params);
            $total = (int)$countStmt->fetchColumn();

            // Data
            $dataStmt = $pdo->prepare("
                SELECT 
                    cu.userId AS idUser,
                    u.name,
                    u.email,
                    c.name AS centralName
                FROM centralUser cu
                INNER JOIN user u ON u.idUser = cu.userId
                INNER JOIN central c ON c.id = cu.centralId
                {$whereSql}
                ORDER BY cu.id DESC
                LIMIT {$perPage} OFFSET {$offset}
            ");
            $dataStmt->execute($params);
            $rows = $dataStmt->fetchAll(PDO::FETCH_ASSOC);

            $lastPage = ceil($total / $perPage);
            $nextPageUrl = ($page < $lastPage) ? "customer/central?page=" . ($page + 1) : null;
            $prevPageUrl = ($page > 1) ? "customer/central?page=" . ($page - 1) : null;

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Usuários da central listados com sucesso',
                'response' => [
                    'current_page' => $page,
                    'data' => $rows,
                    'total' => $total,
                    'per_page' => $perPage,
                    'last_page' => $lastPage,
                    'next_page_url' => $nextPageUrl,
                    'prev_page_url' => $prevPageUrl
                ]
            ]);
        } catch (Exception $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao carregar usuários da central: ' . $e->getMessage(),
                'response' => null
            ]);
        }
    }
}
