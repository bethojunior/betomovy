<?php

namespace app\controllers;

use app\constant\TripCallTypeConst;
use app\dao\DriverDao;
use app\dao\DriverDaoV2;
use app\dao\TripDao;
use app\model\Driver;
use app\model\Location;
use app\model\User;
use app\services\DriverBalanceService;
use app\services\DriverDataSheetService;
use app\services\DriverIndicationService;
use app\services\DriverPreAvailableService;
use app\services\DriverService;
use app\services\DriverTripScheduled;
use app\queue\Jobs\DriverRegisterJob;
use app\queue\Queue;
use app\services\RefusedDriverService;
use PDO;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 12/07/2018
 * Time: 09:41.
 */
class DriverController extends ApiController
{
    protected $driverDao;
    protected $driverDaoV2;
    protected $driverBalanceService;

    public function __construct()
    {
        $this->driverDao = new DriverDao();
        $this->driverDaoV2 = new DriverDaoV2();
        $this->driverBalanceService = new DriverBalanceService();
    }

    public function actionSendConfirmationCode()
    {
        try {
            //            $number = $this->request()->number;
            $driver = new Driver();

            echo $this->returnSuccess('Mensagem', $driver->sendConfirmationCode($this->request()));
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionRegister()
    {
        $object = json_decode($_POST['stdObject']);
        $photos = $_FILES;
        $registerByManager = filter_var($_POST['registerByManager'] ?? false, FILTER_VALIDATE_BOOLEAN);
        $userLoggedManagerId = $_POST['userLoggedManagerId'] ?? null;

        try {
            $this->driverDao->validateRegister($object);
            $persistedPhotos = $this->driverDao->persistRegisterPhotos($photos);

            Queue::dispatch(DriverRegisterJob::class, [
                'data' => $object,
                'photos' => $persistedPhotos,
                'registerByManager' => $registerByManager,
                'userLoggedManagerId' => $userLoggedManagerId,
            ]);

            echo $this->returnSuccess('Success', ['queued' => true]);
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionRegisterV2()
    {
        $object = json_decode($_POST['stdObject']);
        $registerByManager = $_POST['registerByManager'] ?? false;
        $userLoggedManagerId = $_POST['userLoggedManagerId'] ?? null;

        $images = (array) $object->image ?? [];
        $photos = array_merge($images, $_POST);
        unset($photos['stdObject'], $photos['registerByManager'], $photos['userLoggedManagerId']);

        try {
            echo $this->returnSuccess('Success', $this->driverDaoV2->register($object, $photos, $registerByManager, $userLoggedManagerId));
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionAuthenticate()
    {
        $user = new User($this->request());
        try {
            $user = $this->driverDao->authenticate($user, $this->request()->keyAppPartner ?? null);
            if ($user->status != Driver::IN_TRIP) {
                $this->driverDao->toggleStatus($user->idDriver,
                getallheaders()['Cityid'] ?? null, Driver::OFF);
                $user->status = Driver::OFF;
            }

            echo $this->returnSuccess('Sucesso', $user);
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionAutoLogin()
    {
        try {
            echo $this->returnSuccess(
                'Sucesso',
                $this->driverDao
                    ->autoLogin($this->request(false)));
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionCheckEmail()
    {
        try {
            echo $this->returnSuccess('Email existe',
                $this->driverDao->checkEmail($this->request()->email));
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }
    
    public function actionCheckPhone()
    {
        try {
            echo $this->returnSuccess('Telefone existe',
                $this->driverDao->checkPhone($this->request()->phone));
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    // Nome alinhado ao RouteListener: ucfirst('checkphoneavailable') => actionCheckphoneavailable
    public function actionCheckphoneavailable()
    {
        try {
            $request = $this->request() ?? (object) $this->requestQuery();
            $phone = $request->phone ?? null;

            echo $this->returnSuccess(
                'Telefone disponível',
                $this->driverDao->checkPhoneAvailableForRegister($phone)
            );
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }
    
    public function actionCheckEmailAppPartner()
    {
        try {
            echo $this->returnSuccess(
                'Email existe',
                $this->driverDao->checkEmailAppPartner($this->request()->email, $this->request()->keyAppPartner)
            );
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionCheckDocument()
    {
        try {
            echo $this->returnSuccess('Documento existe',
                $this->driverDao->checkDocument($this->request(false)->document));
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionCheckDocumentAppPartner()
    {
        try {
            echo $this->returnSuccess('Documento existe',
                $this->driverDao->checkDocumentAppPartner($this->request(false)->document, $this->request(false)->keyAppPartner));
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionFind()
    {
        try {
            $request = $this->request();

            echo $this->returnSuccess(
                'Dados do motorista',
                (new DriverService())
                    ->findFully($request->driverId, $request->showStatistics ?? true)
            );
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionFindPosition()
    {
        try {
            echo $this->returnSuccess('Posição do motorista encontrada',
                (new DriverService())
                    ->findPosition($this->requestQuery())
            );
        } catch (\Exception $e) {
            echo $this->returnError($e, 'Erro ao buscar a localização do motorista');
        }
    }

    public function actionToggleStatus()
    {
        try {
            $request = $this->request();
            $cityId = $request->cityId ?? null;

            echo $this->returnSuccess('Status Alterado',
                $this->driverDao->toggleStatus($request->driverId,
                    $cityId,
                    $request->status ?? null,
                    $request->location ?? null)
            );
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionSearchTrip()
    {
        $request = $this->request();

        $location = isset($request->location) ? new Location((array) $request->location) : null;

        try {
            echo $this->returnSuccess('Listando viagens',
                $this->driverDao->searchTrip($request->driverId, $location, $request->listTripsDenied)
            );
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionAcceptTrip()
    {
        try {
            $request = $this->request();

            echo $this->returnSuccess('Corrida Aceita',
                $this->driverDao->acceptTrip($request));
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    
    public function actionAcceptScheduled()
    {
        try {
            echo $this->returnSuccess('Viagem agendada com sucesso',
                (new DriverTripScheduled())->accept($this->request(false))
            );
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionRefuseTrip()
    {
        $request = $this->request();
        try {
            echo $this->returnSuccess('Corrida Recusada', $this->driverDao->refuseTrip($request->driverId, $request->tripReference));
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionCancelTrip()
    {
        try {
            $request = $this->request();

            // Verificar se é uma corrida do tipo "maçaneta manual"
            $tripDao = new TripDao();
            $trip = $tripDao->find($request->tripReference);

            $generateFee = $request->generateCancellationFee ?? true;
            if (isset($trip->tripCallTypeId) && $trip->tripCallTypeId == TripCallTypeConst::MACANETA) {
                $generateFee = false;
            }

            echo $this->returnSuccess('Corrida Cancelada',
                $this->driverDao->cancelTrip(
                    $request->driverId, $request->tripReference,
                    $request->cancellationReasonsId ?? null,
                    $generateFee));
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionInformArrival()
    {
        try {
            echo $this->returnSuccess('Sucesso', $this->driverDao->informArrival($this->request()->tripReference));
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionInitTrip()
    {
        try {
            echo $this->returnSuccess('Corrida Iniciada', $this->driverDao->initTrip($this->request()->tripReference));
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionPutTripInWaiting()
    {
        try {
            echo $this->returnSuccess('Corrida em espera', $this->driverDao->waitingTrip($this->request()->tripReference));
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionFinishWaitingTime()
    {
        try {
            echo $this->returnSuccess('Tempo de espera encerrado.', $this->driverDao->finishWaitingTime($this->request()->tripReference));
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionSaveTimeWaiting()
    {
        try {
            echo $this->returnSuccess('Tempo de espera salvo', $this->driverDao->insertWaitingTime($this->request(false)));
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionConfirmWayPoint()
    {
        try {
            echo $this->returnSuccess('Ponto de parada confirmado',
                $this->driverDao->confirmWayPoint($this->request(false)->idWayPoint)
            );
        } catch (\Exception $e) {
            echo $this->returnError($e, 'Erro ao confirmar parada');
        }
    }

    public function actionFinishTrip()
    {
        try {
            $request = $this->request();

            echo $this->returnSuccess('Corrida Finalizada',
                $this->driverDao->finishTrip($request->tripReference, $request->data ?? null)
            );
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetTrips()
    {
        try {
            echo $this->returnSuccess('Listando viagens do motorista',
                $this->driverDao->getTrips(
                    $this->request()
                )
            );
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetTripsActives()
    {
        try {
            echo $this->returnSuccess('Listando viagens ativas',
                $this->driverDao->getTripsActives(
                    $this->request()
                )
            );
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionForgotPassword()
    {
        try {
            echo $this->returnSuccess('Código de Recuperação de senha enviado',
                $this->driverDao->forgotPassword($this->request()->email)
            );
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionChangePassword()
    {
        try {
            $request = $this->request();

            echo $this->returnSuccess('Senha alterada',
                $this->driverDao->changePassword($request->email, $request->password)
            );
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionEdit()
    {
        try {
            echo $this->returnSuccess('Motorista alterado',
                $this->driverDao->edit($this->request())
            );
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionEditProfileImage()
    {
        try {
            $driverId = $_POST['driverId'];
            $photo = $_FILES['photo'];

            echo $this->returnSuccess('Foto de perfil alterada',
                $this->driverDao->editProfileImage($driverId, $photo)
            );
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionFindWithAccountInfo()
    {
        try {
            echo $this->returnSuccess('Informações bancarias do motorista',
                $this->driverBalanceService->findWithAccountInfo($this->request())
            );
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionDefaultStation()
    {
        try {
            $request = $this->request();

            echo $this->returnSuccess('Posto ativo atualizado',
                $this->driverDao->updateDefaultStation($request->driverId, $request->stationId ?? null)
            );
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionEditDocsImage()
    {
        $object = json_decode($_POST['stdObject']);
        $photos = $_FILES;

        try {
            echo $this->returnSuccess('Imagens do documento atualizados',
                $this->driverDao->editDocsImage($object->driverId, $photos)
            );
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionFindWithPendencies()
    {
        try {
            echo $this->returnSuccess('Motorista encontrado',
                $this->driverDao->findWithPendencies($this->request(false)->driverId)
            );
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionUpdateVersion()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess('Versão atualizada',
                (new DriverService())
                    ->updateAppVersion($request)
            );
        } catch (\Exception $e) {
            echo $this->returnError($e, 'Erro ao atualizar a versão do app no motorista');
        }
    }

    public function actionStatusApp()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess('Status do app atualizado',
                (new DriverService())
                    ->updateStatusApp($request->appIsOpen)
            );
        } catch (\Exception $e) {
            echo $this->returnError($e, 'Erro ao atualizar o status do app');
        }
    }

    public function actionPutPreAvailable()
    {
        try {
            echo $this->returnSuccess('Motorista disponível para receber viagens',
                (new DriverPreAvailableService())->putPreAvailable()
            );
        } catch (\Exception $e) {
            echo $this->returnError($e, 'Erro ao colocar o motorista disponível para receber viagens');
        }
    }

    public function actionCheckPassword()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess('Senha correta',
                (new DriverService())
                    ->checkPassword($request->password ?? null)
            );
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionIndication()
    {
        try {
            echo $this->returnSuccess(
                'Motorista indicado com sucesso',
                (new DriverIndicationService())
                    ->insert($this->request(false)));
        } catch (\Exception $e) {
            if ($e->getCode() != 0) {
                echo $this->returnError($e, $e->getMessage());
            } else {
                echo $this->returnError($e, 'Erro ao inserir indicação para isenção de comissões');
            }
        }
    }

    public function actionWeeklyEarnings()
    {
        try {
            echo $this->returnSuccess(
                'Ganhos semanais encontrados',
                (new DriverService())
                    ->weeklyEarnings($this->request(false)));
        } catch (\Exception $e) {
            echo $this->returnError($e, 'Erro ao buscar os ganhos semanais dos motoristas');
        }
    }

    public function actionDataSheet()
    {
        try {
            echo $this->returnSuccess(
                'Ficha técnica do motorista',
                (new DriverDataSheetService())
                    ->show($this->requestQuery()));
        } catch (\Exception $e) {
            echo $this->returnError($e, 'Erro ao buscar a ficha técnica do motorista');
        }
    }

    public function actionValidateAccountConfianceBank()
    {
        try {
            echo $this->returnSuccess(
                'Validado com sucesso',
                (new DriverDao())
                    ->validateDocumentConfianceBank($this->request(false)->idDriver));
        } catch (\Exception $e) {
            echo $this->returnError($e, 'Erro fazer validação');
        }
    }

    public function actionRequestUpdateDriverLocation()
    {
        try {
            echo $this->returnSuccess('Solicitação de atualização de localização do motorista',
                (new DriverService())->requestUpdateDriverLocation($this->request(false))
            );
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionFindCustomersBlockedMe()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess(
                'Clientes que me bloquearam',
                (new RefusedDriverService())
                    ->findCustomersBlockedMe($request->driverId));
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetAvaliations()
    {
        try {
            $request = $this->request();
            echo $this->returnSuccess(
                'Avaliação do motorista com sucesso',
                (new DriverDao())
                    ->findAvaliations($request->driverId));
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetDriverHours() {
        try {
            $request = $this->request();
            echo $this->returnSuccess(
                'Listagem de horas do motorista',
                (new DriverDao())
                    ->getDriverHours($request->driverId));
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionTripsSummary()
    {
        try {
            echo $this->returnSuccess(
                'Resumo de viagens',
                (new DriverDao())->getDriverTripSummary($this->request())
            );
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionTripsAvailable()
    {
        try {
            echo $this->returnSuccess(
                'Viagens ativas',
                (new DriverDao())->findTripsAvailable($this->request())
            );
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionTripsAccepted()
    {
        try {
            echo $this->returnSuccess(
                'Viagens aceitas',
                (new DriverDao())->findTripsAccepted($this->request())
            );
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    /**
     * GET /driver?page=1&...
     * Called by Monitor web panel
     */
    public function actionIndex()
    {
        try {
            $pdo = \app\utils\Connection::open();

            // If a specific ID is requested in route (e.g. /driver/123)
            $driverId = $_GET['id'] ?? null;
            if ($driverId && is_numeric($driverId)) {
                $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
                if ($method === 'PUT') {
                    $this->handleUpdateDriver($pdo, (int)$driverId);
                    return;
                }
                $driver = $this->findDriverDetail($pdo, (int)$driverId);
                echo $this->returnSuccess('Motorista encontrado', $driver);
                return;
            }

            $page = max(1, (int)($_GET['page'] ?? 1));
            $limit = max(1, min(100, (int)($_GET['per_page'] ?? $_GET['limit'] ?? 10)));
            $offset = ($page - 1) * $limit;

            $headers = function_exists('getallheaders') ? getallheaders() : [];
            $cityId = $headers['cityid'] ?? $headers['cityId'] ?? $_SERVER['HTTP_CITYID'] ?? $_GET['cityId'] ?? null;

            if (isset($_GET['allCities']) && ($_GET['allCities'] === '1' || $_GET['allCities'] === 'true')) {
                $cityId = null;
            }
            if ($cityId === 'all' || $cityId === '0' || $cityId === 0 || $cityId === '') {
                $cityId = null;
            }

            $where = ["user.statusId = 1"];
            $params = [];

            if ($cityId) {
                $where[] = "driver.cityId = :cityId";
                $params[':cityId'] = (int)$cityId;
            }

            if (!empty($_GET['driverRegisterStatusId'])) {
                $where[] = "driver.driverRegisterStatusId = :statusId";
                $params[':statusId'] = (int)$_GET['driverRegisterStatusId'];
            }

            if (!empty($_GET['driverType'])) {
                $where[] = "levelAccess.userTypeId = :driverType";
                $params[':driverType'] = (int)$_GET['driverType'];
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

            if (!empty($_GET['carPlate'])) {
                $cleanPlate = preg_replace('/[^A-Za-z0-9]/', '', $_GET['carPlate']);
                $where[] = "car.plate LIKE :plate";
                $params[':plate'] = '%' . $cleanPlate . '%';
            }

            $whereSql = implode(' AND ', $where);

            // Count total
            $countSql = "
                SELECT count(DISTINCT driver.idDriver)
                FROM driver
                JOIN user ON driver.userId = user.idUser
                LEFT JOIN levelAccess ON user.idUser = levelAccess.userId
                LEFT JOIN car ON driver.idDriver = car.driverId AND car.deleted_at IS NULL
                WHERE {$whereSql}
            ";
            $countStmt = $pdo->prepare($countSql);
            $countStmt->execute($params);
            $total = (int)$countStmt->fetchColumn();

            // Query items
            $sql = "
                SELECT
                    driver.idDriver,
                    user.idUser,
                    user.name,
                    coalesce(user.nickname, '') as nickname,
                    coalesce(user.document, '') as document,
                    coalesce(user.phone, '') as phone,
                    coalesce(user.email, '') as email,
                    coalesce(user.rg, '') as rg,
                    coalesce(user.gender, '') as gender,
                    coalesce(user.created_at, '') as created_at,
                    coalesce(user.observation, '') as observation,
                    user.platform,
                    coalesce(user.zafiraValidated, 0) as zafiraValidated,
                    coalesce(user.rating, 5) as rating,
                    driver.driverRegisterStatusId,
                    coalesce(drs.name, 'Pendente') as registerStatus,
                    coalesce(driver.alvara, '') as alvara,
                    driver.balanceId,
                    coalesce(driver.prepaid, 0) as prepaid,
                    coalesce(driver.profileImage, user.profilePhoto, '') as profileImage,
                    driver.cityId,
                    coalesce(city.nome, '') as city,
                    coalesce(car.brand, '') as carBrand,
                    coalesce(car.model, '') as carModel,
                    coalesce(car.plate, '') as carPlate,
                    coalesce(car.color, '') as carColor,
                    coalesce(car.year, '') as carYear,
                    coalesce(userType.name, 'Comum') as userType,
                    coalesce(levelAccess.userTypeId, 0) as userTypeId,
                    coalesce(balance.balance, 0) as balance,
                    coalesce(balance.blockedBalance, 0) as blockedBalance,
                    driver.last_lat,
                    driver.last_lon,
                    driver.appVersion,
                    null as militaryForce,
                    null as militaryPatent,
                    null as militaryPatentPicture,
                    null as militaryStatus,
                    null as om,
                    null as hours_worked,
                    null as hours_open
                FROM driver
                JOIN user ON driver.userId = user.idUser
                LEFT JOIN driverRegisterStatus drs ON driver.driverRegisterStatusId = drs.idDriverRegisterStatus
                LEFT JOIN levelAccess ON user.idUser = levelAccess.userId
                LEFT JOIN userType ON levelAccess.userTypeId = userType.idUserType
                LEFT JOIN car ON driver.idDriver = car.driverId AND car.deleted_at IS NULL
                LEFT JOIN city ON driver.cityId = city.id
                LEFT JOIN balance ON driver.balanceId = balance.idBalance
                WHERE {$whereSql}
                GROUP BY driver.idDriver
                ORDER BY driver.idDriver DESC
                LIMIT {$limit} OFFSET {$offset}
            ";

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $drivers = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Format monetary and numeric fields
            $formatted = array_map(function ($d) {
                $d['idDriver'] = (int)$d['idDriver'];
                $d['idUser'] = (int)$d['idUser'];
                $d['cityId'] = $d['cityId'] ? (int)$d['cityId'] : null;
                $d['driverRegisterStatusId'] = (int)$d['driverRegisterStatusId'];
                $d['userTypeId'] = (int)$d['userTypeId'];
                $d['balance'] = (float)$d['balance'];
                $d['blockedBalance'] = (float)$d['blockedBalance'];
                $d['rating'] = (float)$d['rating'];
                $d['prepaid'] = (int)$d['prepaid'];
                $d['zafiraValidated'] = (int)$d['zafiraValidated'];
                return $d;
            }, $drivers);

            $lastPage = $total > 0 ? (int)ceil($total / $limit) : 1;

            $response = [
                'current_page' => $page,
                'data' => $formatted,
                'first_page_url' => "/driver?page=1",
                'from' => $offset + 1,
                'last_page' => $lastPage,
                'next_page_url' => $page < $lastPage ? "/driver?page=" . ($page + 1) : null,
                'path' => "/driver",
                'per_page' => $limit,
                'prev_page_url' => $page > 1 ? "/driver?page=" . ($page - 1) : null,
                'to' => min($offset + $limit, $total),
                'total' => $total,
            ];

            echo json_encode([
                'status' => true,
                'message' => 'Lista de motoristas',
                'response' => $response,
                'data' => $response,
            ]);
            return;
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    /**
     * Helper to load full driver details
     */
    private function findDriverDetail(PDO $pdo, int $driverId): array
    {
        $sql = "
            SELECT
                driver.*,
                user.name, user.nickname, user.document, user.phone, user.email,
                user.dateOfBirth, user.gender, user.rg, user.created_at, user.observation,
                user.zafiraValidated,
                coalesce(car.idCar, 0) as idCar,
                coalesce(car.brand, '') as brand,
                coalesce(car.model, '') as model,
                coalesce(car.plate, '') as plate,
                coalesce(car.color, '') as color,
                coalesce(car.year, '') as year,
                coalesce(car.renavam, '') as renavam,
                coalesce(driver.crlv, '') as crlv,
                coalesce(driver.crlvPicture, '') as crlvPicture,
                coalesce(balance.balance, 0) as balance,
                coalesce(balance.blockedBalance, 0) as blockedBalance,
                coalesce(city.nome, '') as city,
                coalesce(drs.name, 'Pendente') as registerStatus,
                coalesce(levelAccess.userTypeId, 7) as userTypeId,
                coalesce(userType.name, 'MOTORISTA PARTICULAR') as userType
            FROM driver
            JOIN user ON driver.userId = user.idUser
            LEFT JOIN levelAccess ON user.idUser = levelAccess.userId
            LEFT JOIN userType ON levelAccess.userTypeId = userType.idUserType
            LEFT JOIN car ON driver.idDriver = car.driverId AND car.deleted_at IS NULL
            LEFT JOIN balance ON driver.balanceId = balance.idBalance
            LEFT JOIN city ON driver.cityId = city.id
            LEFT JOIN driverRegisterStatus drs ON driver.driverRegisterStatusId = drs.idDriverRegisterStatus
            WHERE driver.idDriver = :id
            LIMIT 1
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':id' => $driverId]);
        $driver = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$driver) {
            throw new \Exception("Motorista não encontrado");
        }

        $driver['userTypeId'] = (int)($driver['userTypeId'] ?? 7);

        // Buscar endereço do motorista
        $stmtAddr = $pdo->prepare("SELECT * FROM driverAddress WHERE driverId = :driverId AND deleted_at IS NULL ORDER BY id DESC LIMIT 1");
        $stmtAddr->execute([':driverId' => $driverId]);
        $addr = $stmtAddr->fetch(PDO::FETCH_ASSOC);

        if ($addr) {
            $driver['driver_address'] = [
                'id' => (int)$addr['id'],
                'zipCode' => $addr['zipCode'] ?? '',
                'street' => $addr['street'] ?? '',
                'number' => $addr['number'] ?? '',
                'neighborhood' => $addr['neighborhood'] ?? '',
                'complement' => $addr['complement'] ?? '',
                'city' => $addr['city'] ?? '',
                'state' => $addr['state'] ?? '',
            ];
            $driver['zipCode'] = $addr['zipCode'] ?? '';
            $driver['street'] = $addr['street'] ?? '';
            $driver['number'] = $addr['number'] ?? '';
            $driver['neighborhood'] = $addr['neighborhood'] ?? '';
            $driver['complement'] = $addr['complement'] ?? '';
        } else {
            $driver['driver_address'] = null;
        }

        // Buscar documentos fornecidos do motorista
        $stmtDocs = $pdo->prepare("
            SELECT
                du.id,
                du.docId,
                du.userId,
                coalesce(du.text, '') as text,
                coalesce(du.image, '') as image,
                coalesce(du.pdf, '') as pdf,
                coalesce(du.docStatusId, 2) as docStatusId,
                coalesce(ds.name, 'EM ANÁLISE') as docStatus,
                coalesce(d.label, 'Documento') as label,
                coalesce(d.description, '') as description,
                coalesce(d.image, 1) as isImage,
                coalesce(d.text, 0) as isText,
                coalesce(d.pdf, 0) as isPdf
            FROM docUser du
            INNER JOIN doc d ON du.docId = d.id
            LEFT JOIN docStatus ds ON du.docStatusId = ds.id
            WHERE du.userId = :userId AND du.statusId = 1 AND du.deleted_at IS NULL
            ORDER BY du.id DESC
        ");
        $stmtDocs->execute([':userId' => $driver['userId']]);
        $docs = $stmtDocs->fetchAll(PDO::FETCH_ASSOC);

        $storageUrl = 'https://minio.704app.com.br/rota101fb704/';
        foreach ($docs as &$docItem) {
            $docItem['id'] = (int)$docItem['id'];
            $docItem['docId'] = (int)$docItem['docId'];
            $docItem['userId'] = (int)$docItem['userId'];
            $docItem['docStatusId'] = (int)$docItem['docStatusId'];
            $docItem['isImage'] = (int)$docItem['isImage'];
            $docItem['isText'] = (int)$docItem['isText'];
            $docItem['isPdf'] = (int)$docItem['isPdf'];

            if (!empty($docItem['image'])) {
                if (!preg_match('/^https?:\/\//i', $docItem['image'])) {
                    $docItem['image'] = $storageUrl . 'user/' . $docItem['userId'] . '/docs/' . $docItem['image'];
                }
            } else {
                $docItem['image'] = '';
            }

            if (!empty($docItem['pdf'])) {
                if (!preg_match('/^https?:\/\//i', $docItem['pdf'])) {
                    $docItem['pdf'] = $storageUrl . 'user/' . $docItem['userId'] . '/docs/' . $docItem['pdf'];
                }
            } else {
                $docItem['pdf'] = '';
            }
        }
        unset($docItem);

        $driver['docs_user'] = $docs;
        $driver['idUser'] = (int)$driver['userId'];

        return $driver;
    }

    /**
     * Atualiza dados cadastrais do motorista e usuário associado
     */
    private function handleUpdateDriver(PDO $pdo, int $driverId)
    {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true) ?: [];

        $stmtDriver = $pdo->prepare("SELECT idDriver, userId, cityId FROM driver WHERE idDriver = :id LIMIT 1");
        $stmtDriver->execute([':id' => $driverId]);
        $currDriver = $stmtDriver->fetch(PDO::FETCH_ASSOC);

        if (!$currDriver) {
            throw new \Exception("Motorista não encontrado");
        }

        $userId = (int)$currDriver['userId'];

        // Atualizar driver
        $driverUpdates = [];
        $driverParams = [':id' => $driverId];

        if (array_key_exists('cnh', $data)) {
            $driverUpdates[] = "cnh = :cnh";
            $driverParams[':cnh'] = $data['cnh'];
        }
        if (!empty($data['cityId'])) {
            $driverUpdates[] = "cityId = :cityId";
            $driverParams[':cityId'] = (int)$data['cityId'];
        }

        if (!empty($driverUpdates)) {
            $sqlD = "UPDATE driver SET " . implode(', ', $driverUpdates) . " WHERE idDriver = :id";
            $stmtD = $pdo->prepare($sqlD);
            $stmtD->execute($driverParams);
        }

        // Atualizar user
        $userUpdates = ["updated_at = NOW()"];
        $userParams = [':userId' => $userId];

        if (isset($data['name'])) {
            $userUpdates[] = "name = :name";
            $userParams[':name'] = trim((string)$data['name']);
        }
        if (isset($data['nickname'])) {
            $userUpdates[] = "nickname = :nickname";
            $userParams[':nickname'] = trim((string)$data['nickname']);
        }
        if (isset($data['email'])) {
            $userUpdates[] = "email = :email";
            $userParams[':email'] = trim((string)$data['email']);
        }
        if (isset($data['phone'])) {
            $cleanPhone = preg_replace('/\D/', '', (string)$data['phone']);
            $userUpdates[] = "phone = :phone";
            $userUpdates[] = "phone_digits = :phoneDig";
            $userParams[':phone'] = trim((string)$data['phone']);
            $userParams[':phoneDig'] = $cleanPhone;
        }
        if (isset($data['document'])) {
            $cleanDoc = preg_replace('/\D/', '', (string)$data['document']);
            $userUpdates[] = "document = :doc";
            $userUpdates[] = "document_digits = :docDig";
            $userParams[':doc'] = trim((string)$data['document']);
            $userParams[':docDig'] = $cleanDoc;
        }
        if (isset($data['gender'])) {
            $userUpdates[] = "gender = :gender";
            $userParams[':gender'] = $data['gender'];
        }
        if (isset($data['dateOfBirth'])) {
            $userUpdates[] = "dateOfBirth = :dob";
            $userParams[':dob'] = $data['dateOfBirth'] ? date('Y-m-d', strtotime($data['dateOfBirth'])) : null;
        }
        if (!empty($data['cityId'])) {
            $userUpdates[] = "cityId = :userCityId";
            $userParams[':userCityId'] = (int)$data['cityId'];
        }

        $sqlU = "UPDATE user SET " . implode(', ', $userUpdates) . " WHERE idUser = :userId";
        $stmtU = $pdo->prepare($sqlU);
        $stmtU->execute($userParams);

        // Se veio userTypeId, atualiza levelAccess
        if (!empty($data['userTypeId'])) {
            $uTypeId = (int)$data['userTypeId'];
            $stmtChkLa = $pdo->prepare("SELECT idLevelAccess FROM levelAccess WHERE userId = :userId LIMIT 1");
            $stmtChkLa->execute([':userId' => $userId]);
            $laId = $stmtChkLa->fetchColumn();

            if ($laId) {
                $pdo->prepare("UPDATE levelAccess SET userTypeId = :ut WHERE idLevelAccess = :id")
                    ->execute([':ut' => $uTypeId, ':id' => $laId]);
            } else {
                $pdo->prepare("INSERT INTO levelAccess (userId, userTypeId) VALUES (:userId, :ut)")
                    ->execute([':userId' => $userId, ':ut' => $uTypeId]);
            }
        }

        echo $this->returnSuccess('Dados do motorista atualizados com sucesso', $this->findDriverDetail($pdo, $driverId));
    }

    /**
     * POST /driver/:id/address
     */
    public function actionAddress()
    {
        try {
            $pdo = \app\utils\Connection::open();
            $driverId = (int)($_GET['id'] ?? 0);
            if (!$driverId) {
                throw new \Exception("ID do motorista não informado");
            }

            $raw = file_get_contents('php://input');
            $data = json_decode($raw, true) ?: [];

            $zipCode = preg_replace('/\D/', '', (string)($data['zipCode'] ?? ''));
            $street = trim((string)($data['street'] ?? ''));
            $number = trim((string)($data['number'] ?? ''));
            $neighborhood = trim((string)($data['neighborhood'] ?? ''));
            $complement = trim((string)($data['complement'] ?? ''));
            $cityId = !empty($data['cityId']) ? (int)$data['cityId'] : null;

            $cityName = '';
            $state = '';
            if ($cityId) {
                $stmtCity = $pdo->prepare("SELECT c.nome, e.sigla FROM city c LEFT JOIN estate e ON c.estado = e.id WHERE c.id = :id LIMIT 1");
                $stmtCity->execute([':id' => $cityId]);
                $cRow = $stmtCity->fetch(PDO::FETCH_ASSOC);
                if ($cRow) {
                    $cityName = $cRow['nome'];
                    $state = $cRow['sigla'] ?? '';
                }
            }

            $stmtCheck = $pdo->prepare("SELECT id FROM driverAddress WHERE driverId = :driverId AND deleted_at IS NULL LIMIT 1");
            $stmtCheck->execute([':driverId' => $driverId]);
            $addrId = $stmtCheck->fetchColumn();

            if ($addrId) {
                $stmtUp = $pdo->prepare("
                    UPDATE driverAddress 
                    SET zipCode = :zipCode,
                        street = :street,
                        number = :number,
                        neighborhood = :neighborhood,
                        complement = :complement,
                        city = COALESCE(NULLIF(:city, ''), city),
                        state = COALESCE(NULLIF(:state, ''), state),
                        updated_at = NOW()
                    WHERE id = :id
                ");
                $stmtUp->execute([
                    ':zipCode' => $zipCode,
                    ':street' => $street,
                    ':number' => $number,
                    ':neighborhood' => $neighborhood,
                    ':complement' => $complement,
                    ':city' => $cityName,
                    ':state' => $state,
                    ':id' => $addrId
                ]);
            } else {
                $stmtIns = $pdo->prepare("
                    INSERT INTO driverAddress (driverId, zipCode, street, number, neighborhood, complement, city, state, created_at, updated_at)
                    VALUES (:driverId, :zipCode, :street, :number, :neighborhood, :complement, :city, :state, NOW(), NOW())
                ");
                $stmtIns->execute([
                    ':driverId' => $driverId,
                    ':zipCode' => $zipCode,
                    ':street' => $street,
                    ':number' => $number,
                    ':neighborhood' => $neighborhood,
                    ':complement' => $complement,
                    ':city' => $cityName,
                    ':state' => $state
                ]);
            }

            if ($cityId) {
                $pdo->prepare("UPDATE driver SET cityId = :cityId WHERE idDriver = :driverId")
                    ->execute([':cityId' => $cityId, ':driverId' => $driverId]);
            }

            echo $this->returnSuccess('Endereço atualizado com sucesso');
        } catch (\Throwable $e) {
            echo $this->returnError($e, 'Erro ao atualizar endereço');
        }
    }

    /**
     * GET /driver/positions
     */
    public function actionPositions()
    {
        try {
            $pdo = \app\utils\Connection::open();
            $headers = function_exists('getallheaders') ? getallheaders() : [];
            $cityId = $_GET['cityId'] ?? $_GET['cityid'] ?? $headers['cityid'] ?? $headers['cityId'] ?? $_SERVER['HTTP_CITYID'] ?? null;
            $statusParam = $_GET['status'] ?? null;

            $whereParts = [
                "(user.statusId = 1 OR user.statusId IS NULL)",
                "driver.last_lat IS NOT NULL",
                "driver.last_lat != ''",
                "driver.last_lat != 0",
                "driver.last_lon IS NOT NULL",
                "driver.last_lon != ''",
                "driver.last_lon != 0"
            ];

            if (!empty($cityId) && is_numeric($cityId) && (int)$cityId > 0) {
                $cid = (int)$cityId;
                $whereParts[] = "(driver.cityId = {$cid} OR driver.cityId IS NULL OR driver.cityId = 0)";
            }

            if (!empty($statusParam)) {
                $statusList = array_filter(array_map('trim', explode(',', $statusParam)));
                if (!empty($statusList)) {
                    $expandedStatuses = [];
                    foreach ($statusList as $st) {
                        $expandedStatuses[] = addslashes($st);
                        if ($st === 'disponivel') {
                            $expandedStatuses[] = 'online';
                            $expandedStatuses[] = 'available';
                        } elseif ($st === 'online') {
                            $expandedStatuses[] = 'disponivel';
                        } elseif ($st === 'corrida') {
                            $expandedStatuses[] = 'busy';
                            $expandedStatuses[] = 'in_progress';
                            $expandedStatuses[] = 'boarding';
                            $expandedStatuses[] = 'accepted';
                        }
                    }
                    $expandedStatuses = array_unique($expandedStatuses);
                    $inClause = "'" . implode("','", $expandedStatuses) . "'";
                    $whereParts[] = "driver.status IN ({$inClause})";
                }
            }

            $whereSql = implode(" AND ", $whereParts);

            $sql = "
                SELECT driver.idDriver, driver.userId, driver.cityId,
                       driver.last_lat as latitude, driver.last_lon as longitude,
                       user.name, user.phone,
                       driver.status,
                       driver.profileImage,
                       IFNULL(user.updated_at, NOW()) as updated_at,
                       IFNULL(user.updated_at, NOW()) as last_position_update,
                       car.plate, car.model, car.color
                FROM driver
                JOIN user ON driver.userId = user.idUser
                LEFT JOIN car ON driver.idDriver = car.driverId AND car.deleted_at IS NULL
                WHERE {$whereSql}
                ORDER BY driver.idDriver DESC
                LIMIT 300
            ";
            $stmt = $pdo->query($sql);
            $positions = $stmt ? $stmt->fetchAll(PDO::FETCH_ASSOC) : [];

            $formatted = array_map(function($row) {
                $status = $row['status'];
                if ($status === 'online') {
                    $status = 'disponivel';
                }
                return [
                    'idDriver' => (int)$row['idDriver'],
                    'userId' => (int)$row['userId'],
                    'cityId' => $row['cityId'] ? (int)$row['cityId'] : null,
                    'latitude' => (float)$row['latitude'],
                    'longitude' => (float)$row['longitude'],
                    'name' => $row['name'],
                    'userName' => $row['name'],
                    'nickname' => $row['name'],
                    'userNickname' => $row['name'],
                    'phone' => $row['phone'],
                    'userPhone' => $row['phone'],
                    'status' => $status,
                    'profileImage' => $row['profileImage'],
                    'userType' => 'Motorista',
                    'updated_at' => $row['updated_at'],
                    'last_position_update' => $row['last_position_update'],
                    'car' => [
                        'plate' => $row['plate'],
                        'model' => $row['model'],
                        'color' => $row['color'],
                    ]
                ];
            }, $positions);

            echo $this->returnSuccess('Posições dos motoristas', $formatted);
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    /**
     * GET /driver/{id}/stations
     */
    public function actionStations()
    {
        try {
            echo $this->returnSuccess('Estações do motorista', []);
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    /**
     * GET /driver/{id}/driverAppInfo
     */
    public function actionDriverAppInfo()
    {
        try {
            $id = $_GET['id'] ?? null;
            $pdo = \app\utils\Connection::open();
            $stmt = $pdo->prepare("SELECT appVersion, platform, last_lat, last_lon FROM driver JOIN user ON driver.userId = user.idUser WHERE driver.idDriver = :id");
            $stmt->execute([':id' => $id]);
            $info = $stmt->fetch(PDO::FETCH_ASSOC) ?: [];
            echo $this->returnSuccess('App info do motorista', $info);
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    /**
     * PUT/POST /driver/activateRegister or /driver/changeStatus/{id}
     */
    public function actionActivateRegister()
    {
        try {
            $id = $_GET['id'] ?? null;
            if (!$id) {
                throw new \Exception("ID do motorista não informado");
            }
            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
            $stmt = $pdo->prepare("UPDATE driver SET driverRegisterStatusId = 1 WHERE idDriver = :id");
            $stmt->execute([':id' => $id]);

            // Desbloqueia o usuário e desativa registros em blockReasons
            $stmtUser = $pdo->prepare("UPDATE user JOIN driver ON user.idUser = driver.userId SET user.blocked = 0 WHERE driver.idDriver = :id");
            $stmtUser->execute([':id' => $id]);

            $stmtBlock = $pdo->prepare("UPDATE blockReasons SET statusId = 0 WHERE driverId = :id");
            $stmtBlock->execute([':id' => $id]);

            echo $this->returnSuccess('Cadastro ativado com sucesso');
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionChangeStatus()
    {
        try {
            $id = $_GET['id'] ?? null;
            $statusId = $_POST['statusId'] ?? $_GET['statusId'] ?? 1;
            if (!$id) {
                throw new \Exception("ID do motorista não informado");
            }
            $pdo = \app\utils\Connection::open();
            $stmt = $pdo->prepare("UPDATE driver SET driverRegisterStatusId = :statusId WHERE idDriver = :id");
            $stmt->execute([':statusId' => $statusId, ':id' => $id]);

            echo $this->returnSuccess('Status alterado com sucesso');
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionBalance()
    {
        try {
            $data = $this->request(false);
            $balanceFlowTypeId = isset($data->balanceFlowTypeId) ? (int)$data->balanceFlowTypeId : null;
            $userTypeId = !empty($data->userTypeDriverSelected) ? (int)$data->userTypeDriverSelected : null;
            $billingDay = isset($data->billingDay) && $data->billingDay !== '' ? (int)$data->billingDay : null;
            
            $rawVal = $data->value ?? '0';
            $cleanVal = (float)str_replace(['R$', ' ', '.'], ['', '', ''], str_replace(',', '.', $rawVal));

            if (!$balanceFlowTypeId) {
                throw new \Exception("Tipo de movimentação é obrigatório.");
            }

            // Se for lançamento com dia de faturamento, grava em balancePosting
            if ($billingDay !== null) {
                \app\dao\GenericDao::execute("INSERT INTO balancePosting (userTypeId, balanceFlowTypeId, value, billingDay, active, created_at, updated_at) 
                                    VALUES (:userTypeId, :balanceFlowTypeId, :value, :billingDay, 1, NOW(), NOW())", [
                    ':userTypeId' => $userTypeId,
                    ':balanceFlowTypeId' => $balanceFlowTypeId,
                    ':value' => $cleanVal,
                    ':billingDay' => $billingDay
                ]);
            } else {
                // Lançamento avulso: buscar flow (entrada/saida)
                $flowType = \app\dao\GenericDao::first("SELECT * FROM balanceFlowType WHERE idBalanceFlowType = :id", [':id' => $balanceFlowTypeId]);
                $isCredit = $flowType && strtolower($flowType['flow']) === 'entrada';

                $where = ["d.driverRegisterStatusId = 1"];
                $params = [];
                if ($userTypeId) {
                    $where[] = "d.userTypeId = :userTypeId";
                    $params[':userTypeId'] = $userTypeId;
                }

                $drivers = \app\dao\GenericDao::query("SELECT d.idDriver, d.userId FROM driver d WHERE " . implode(" AND ", $where), $params);
                foreach ($drivers as $dr) {
                    $balRow = \app\dao\GenericDao::first("SELECT idBalance, value FROM balance WHERE userId = :userId", [':userId' => $dr['userId']]);
                    if ($balRow) {
                        $newVal = $isCredit ? ((float)$balRow['value'] + $cleanVal) : ((float)$balRow['value'] - $cleanVal);
                        \app\dao\GenericDao::execute("UPDATE balance SET value = :val, updated_at = NOW() WHERE idBalance = :id", [
                            ':val' => $newVal,
                            ':id' => $balRow['idBalance']
                        ]);

                        \app\dao\GenericDao::execute("INSERT INTO balanceFlow (balanceId, balanceFlowTypeId, value, created_at) 
                                            VALUES (:balanceId, :typeId, :value, NOW())", [
                            ':balanceId' => $balRow['idBalance'],
                            ':typeId' => $balanceFlowTypeId,
                            ':value' => $cleanVal
                        ]);
                    }
                }
            }

            echo $this->returnSuccess('Lançamento efetuado com sucesso');
        } catch (\Exception $e) {
            echo $this->returnError($e, "Erro ao alterar saldo de motoristas");
        }
    }
}


