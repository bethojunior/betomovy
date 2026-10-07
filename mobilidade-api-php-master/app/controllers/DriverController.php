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
}
