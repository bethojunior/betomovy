<?php

namespace app\controllers;
use app\dao\EstablishmentDao;
use app\services\EstablishmentService;
use app\model\Establishment;
use Exception;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 10/07/2018
 * Time: 15:38
 */
class EstablishmentController extends ApiController
{
    protected $establishmentDao;

    public function __construct()
    {
        $this->establishmentDao = new EstablishmentDao;
    }

    public function actionInsert()
    {
        $request = $this->postRequest('stdObject');
        $files = $_FILES;

        try {
            echo $this->returnSuccess("Estabelecimento inserido com sucesso",
                $this->establishmentDao->register($request, $files));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionRoutePrice()
    {
        try {
            echo $this->returnSuccess("Lista de precos para as estacoes",
                $this->establishmentDao->routePrice($this->request()->establishmentId));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionFilter()
    {
        $request = $this->request();
        try {
            echo $this->returnSuccess("Listando estabelecimentos",
                $this->establishmentDao->getByFilter($request->cityId, $request->neighborhood, $request->prices));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGet()
    {
        $id = $_GET['establishmentId'] ?? $this->request()->establishmentId;

        try {
            echo $this->returnSuccess("Estabelecimento encontrado", $this->establishmentDao->find($id));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionSendSms()
    {
        $request = $this->request();

        try {
            echo $this->returnSuccess("Mensagem enviada",
                (new Establishment)->sendPromotionSms($request->number, $request->message, getallheaders()['cityid'] ?? null));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionSendIndicationEmail()
    {
        $request = $this->request();

        try {
            echo $this->returnSuccess("Email enviado",
                (new Establishment)->sendPromotionEmail($request->email, $request->message));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetCities()
    {
        $estateId = $_GET['estate'] ?? null;
        try {
            echo $this->returnSuccess("Listando cidades onde possui estabelecimentos",
                $this->establishmentDao->getCities($estateId));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionRecharge()
    {
        $request = $this->request();

        try {
            echo $this->returnSuccess("Recarga efetuada",
                $this->establishmentDao->rechargeBalance($request->userId, $request->rechargeValue, $request->price, $request->cardId)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionRequestBalance()
    {
        try {
            echo $this->returnSuccess("Recarga de Voucher solicitada",
                (new EstablishmentService)->sendRequestBalance($this->request())
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetCurrentTrips()
    {
        try {
            echo $this->returnSuccess("Listando corridas atuais",
                $this->establishmentDao->getCurrentTrips($this->request()->establishmentId));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetTrips()
    {
        try {
            echo $this->returnSuccess('Viagens encontradas',
                $this->establishmentDao->getTrips($this->request())
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetByCommissionValue()
    {
        try {
            echo $this->returnSuccess("Estabelecimentos ordenados por valor da comissão",
                $this->establishmentDao->getByCommissionValue($this->request()->cityId)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}