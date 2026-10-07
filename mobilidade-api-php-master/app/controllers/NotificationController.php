<?php

namespace app\controllers;
use app\services\NotificationService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 18/03/2019
 * Time: 14:32
 */
class NotificationController extends ApiController
{
    public function actionList()
    {
        try {
            $request = $this->request(false);

            $page = 1;

            if (isset($request->page))
                $page = $request->page;

            echo $this->returnSuccess("Notificações do usuario",
                (new NotificationService)
                    ->list($request->userId, $page)
            );

        } catch (Exception $exception) {
            echo $this->returnError($exception, "Erro ao listar notificações");

        }
    }

    public function actionToView()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess("Notificações do usuario",
                (new NotificationService)
                    ->toView($request->idNotification, $request->userId)
            );

        } catch (Exception $exception) {
            echo $this->returnError($exception, "Erro ao gravar vizualização da notificação");

        }
    }

    public function actionFindByUser()
    {
        try {
            $id = $_GET['idUser'];
            $page = $_GET['page'] ?? 1;
            $per_page = $_GET['per_page'] ?? 20;

            echo $this->returnSuccess('Notificações do Usuário', (new NotificationService)->findByUser($id, $page, $per_page));
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar notificações");
        }
    }

    public function actionViewed()
    {
        try {
            $request = $this->request(false);
            echo $this->returnSuccess('Notificações visualizadas com sucesso', (new NotificationService)->viewed($request));
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao gravar vizualização da notificação");
        }
    }
}