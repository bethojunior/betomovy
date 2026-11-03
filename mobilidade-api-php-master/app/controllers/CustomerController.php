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
            $customerId = $_POST['customerId'] ?? $_GET['id'] ?? null;
            $photo = $_FILES['photo'] ?? $_FILES['image'] ?? $_FILES['imageCompressed'] ?? null;

            $photoName = (new CustomerDao)
                ->updateProfileImage($customerId, $photo);

            $storageUrl = \app\model\Config::get('link_storage_pictures') ?: 'https://minio.704app.com.br/rota101fb704/';
            $fullUrl = rtrim($storageUrl, '/') . '/customer/profile/compressed/' . $photoName;

            echo $this->returnSuccess("Foto de perfil atualizada", [
                'profileImage' => $photoName,
                'url' => $fullUrl,
                'filename' => $photoName
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao atualizar foto de perfil");
        }
    }

    public function actionProfileImage()
    {
        return $this->actionUpdateProfileImage();
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

    /**
     * GET /customer?page=1&...
     * Called by Monitor web panel (Physical client list)
     */
    public function actionIndex()
    {
        try {
            $pdo = \app\utils\Connection::open();

            // If a specific ID is requested in route (e.g. /customer/123)
            $customerId = $_GET['id'] ?? null;
            if ($customerId && is_numeric($customerId)) {
                $customer = $this->findCustomerDetail($pdo, (int)$customerId);
                echo $this->returnSuccess('Cliente encontrado', $customer);
                return;
            }

            $page = max(1, (int)($_GET['page'] ?? 1));
            $limit = max(1, min(100, (int)($_GET['per_page'] ?? $_GET['limit'] ?? 10)));
            $offset = ($page - 1) * $limit;

            // Clientes são exibidos de forma global no monitor, a menos que haja filtro explícito via query param
            $explicitCityId = !empty($_GET['cityId']) && is_numeric($_GET['cityId']) ? (int)$_GET['cityId'] : null;

            $where = ["(user.statusId IS NULL OR user.statusId != 0)"];
            $params = [];

            if ($explicitCityId) {
                $where[] = "user.cityId = :cityId";
                $params[':cityId'] = $explicitCityId;
            }

            if (!empty($_GET['customerRegisterStatusId'])) {
                $where[] = "customer.customerRegisterStatusId = :statusId";
                $params[':statusId'] = (int)$_GET['customerRegisterStatusId'];
            }

            if (!empty($_GET['name'])) {
                $where[] = "user.name LIKE :name";
                $params[':name'] = '%' . trim($_GET['name']) . '%';
            }

            if (!empty($_GET['email'])) {
                $where[] = "user.email LIKE :email";
                $params[':email'] = '%' . trim($_GET['email']) . '%';
            }

            if (!empty($_GET['document'])) {
                $digits = preg_replace('/\D/', '', $_GET['document']);
                $where[] = "(user.document LIKE :doc OR user.document_digits LIKE :docDig)";
                $params[':doc'] = '%' . trim($_GET['document']) . '%';
                $params[':docDig'] = $digits . '%';
            }

            if (!empty($_GET['phone'])) {
                $phoneDigits = preg_replace('/\D/', '', $_GET['phone']);
                $where[] = "(user.phone LIKE :phone OR user.phone_digits LIKE :phoneDig)";
                $params[':phone'] = '%' . trim($_GET['phone']) . '%';
                $params[':phoneDig'] = $phoneDigits . '%';
            }

            $whereSql = implode(' AND ', $where);

            // Count total
            $countSql = "
                SELECT count(DISTINCT customer.idCustomer)
                FROM customer
                JOIN user ON customer.userId = user.idUser
                WHERE {$whereSql}
            ";
            $countStmt = $pdo->prepare($countSql);
            $countStmt->execute($params);
            $total = (int)$countStmt->fetchColumn();

            // Query items
            $sql = "
                SELECT
                    customer.idCustomer,
                    user.idUser,
                    user.name,
                    coalesce(user.nickname, '') as nickname,
                    coalesce(user.phone, '') as phone,
                    coalesce(user.email, '') as email,
                    coalesce(user.document, '') as document,
                    coalesce(user.dateOfBirth, '') as dateOfBirth,
                    coalesce(user.gender, '') as gender,
                    coalesce(user.rg, '') as rg,
                    user.rgFrontPicture,
                    user.rgBackPicture,
                    coalesce(crs.name, 'Aprovado') as status,
                    customer.customerRegisterStatusId,
                    user.cityId,
                    coalesce(city.nome, '') as city,
                    customer.balanceId,
                    coalesce(balance.balance, 0) as comission,
                    coalesce(balance.tripBalance, 0) as voucherBalance,
                    CASE
                        WHEN customer.profileImage IS NOT NULL
                             AND TRIM(customer.profileImage) != ''
                             AND customer.profileImage != 'user.png'
                        THEN customer.profileImage
                        WHEN user.profilePhoto IS NOT NULL
                             AND TRIM(user.profilePhoto) != ''
                             AND user.profilePhoto != 'user.png'
                        THEN user.profilePhoto
                        ELSE coalesce(nullif(customer.profileImage, ''), nullif(user.profilePhoto, ''), 'user.png')
                    END as profileImage,
                    customer.appVersion,
                    user.platform,
                    coalesce(user.quantityTrips, 0) as quantityTripsFinished,
                    coalesce(user.created_at, '') as created_at,
                    coalesce(user.observation, '') as observation,
                    user.last_lat as latitude,
                    user.last_lon as longitude,
                    coalesce(user.zafiraValidated, 0) as zafiraValidated,
                    null as om,
                    null as militaryStatus,
                    null as militaryForce,
                    null as patent,
                    null as patentPicture,
                    null as docLabels,
                    null as docTexts,
                    null as docStatuses
                FROM customer
                JOIN user ON customer.userId = user.idUser
                LEFT JOIN customerRegisterStatus crs ON customer.customerRegisterStatusId = crs.idCustomerRegisterStatus
                LEFT JOIN city ON user.cityId = city.id
                LEFT JOIN balance ON customer.balanceId = balance.idBalance
                WHERE {$whereSql}
                GROUP BY customer.idCustomer
                ORDER BY customer.idCustomer DESC
                LIMIT {$limit} OFFSET {$offset}
            ";

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $customers = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $storageBase = rtrim((string)(\app\model\Config::get('link_storage_pictures') ?: 'https://minio.704app.com.br/rota101fb704/'), '/') . '/';

            $formatted = array_map(function ($c) use ($storageBase) {
                $c['idCustomer'] = (int)$c['idCustomer'];
                $c['idUser'] = (int)$c['idUser'];
                $c['cityId'] = $c['cityId'] ? (int)$c['cityId'] : null;
                $c['customerRegisterStatusId'] = (int)$c['customerRegisterStatusId'];
                $c['comission'] = (float)$c['comission'];
                $c['voucherBalance'] = (float)$c['voucherBalance'];
                $c['quantityTripsFinished'] = (int)$c['quantityTripsFinished'];
                $c['zafiraValidated'] = (int)$c['zafiraValidated'];

                $photo = trim((string)($c['profileImage'] ?? ''));
                if ($photo !== '' && $photo !== 'user.png') {
                    if (stripos($photo, 'http://') === 0 || stripos($photo, 'https://') === 0) {
                        $c['profileImageLink'] = $photo;
                    } elseif (stripos($photo, 'customer/profile/') === 0) {
                        $c['profileImageLink'] = $storageBase . ltrim($photo, '/');
                    } else {
                        $c['profileImageLink'] = $storageBase . 'customer/profile/compressed/' . ltrim($photo, '/');
                    }
                } else {
                    $c['profileImageLink'] = null;
                }
                return $c;
            }, $customers);

            $lastPage = $total > 0 ? (int)ceil($total / $limit) : 1;

            $response = [
                'current_page' => $page,
                'data' => $formatted,
                'first_page_url' => "/customer?page=1",
                'from' => $offset + 1,
                'last_page' => $lastPage,
                'next_page_url' => $page < $lastPage ? "/customer?page=" . ($page + 1) : null,
                'path' => "/customer",
                'per_page' => $limit,
                'prev_page_url' => $page > 1 ? "/customer?page=" . ($page - 1) : null,
                'to' => min($offset + $limit, $total),
                'total' => $total,
            ];

            echo $this->returnSuccess('Lista de clientes', $response);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    /**
     * Helper to load customer detail
     */
    private function findCustomerDetail(PDO $pdo, int $customerId): array
    {
        $sql = "
            SELECT
                customer.*,
                user.name, user.nickname, user.document, user.phone, user.email,
                user.dateOfBirth, user.gender, user.rg, user.created_at, user.observation,
                user.zafiraValidated,
                coalesce(balance.balance, 0) as balance,
                coalesce(city.nome, '') as city,
                coalesce(crs.name, 'Aprovado') as status
            FROM customer
            JOIN user ON customer.userId = user.idUser
            LEFT JOIN balance ON customer.balanceId = balance.idBalance
            LEFT JOIN city ON user.cityId = city.id
            LEFT JOIN customerRegisterStatus crs ON customer.customerRegisterStatusId = crs.idCustomerRegisterStatus
            WHERE customer.idCustomer = :id
            LIMIT 1
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':id' => $customerId]);
        $customer = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$customer) {
            throw new Exception("Cliente não encontrado");
        }

        return $customer;
    }

    /**
     * GET /customer/{id}/locations
     */
    public function actionLocations()
    {
        try {
            echo $this->returnSuccess('Locais do cliente', []);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    /**
     * PUT/POST /customer/{id}/changeStatus or /customer/changeStatus
     */
    public function actionChangeStatus()
    {
        try {
            $id = $_GET['id'] ?? null;
            $statusId = $_POST['statusId'] ?? $_GET['statusId'] ?? 1;
            if (!$id) {
                throw new Exception("ID do cliente não informado");
            }
            $pdo = \app\utils\Connection::open();
            $stmt = $pdo->prepare("UPDATE customer SET customerRegisterStatusId = :statusId WHERE idCustomer = :id");
            $stmt->execute([':statusId' => $statusId, ':id' => $id]);

            echo $this->returnSuccess('Status do cliente alterado com sucesso');
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}

