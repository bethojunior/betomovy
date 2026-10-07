<?php

namespace app\controllers;

use Exception;
use app\services\ListContactsService;

class ListContactsController extends ApiController
{
    public function actionSaveListContact()
    {
        try {
            $payload = $this->request(false);

            $endpoint = 'list_contacts/insertContacts';

            $responseJson = (new ListContactsService())->insertContacts($endpoint, $payload->stdObject);

            echo $this->returnSuccess("Contatos inseridos com sucesso", $responseJson);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao inserir contatos");
        }
    }

    public function actionSaveListContactGeneral()
    {
        try {
            $payload = $this->request(false);

            $endpoint = 'list_contacts_general/insertContacts';

            $responseJson = (new ListContactsService())->insertContacts($endpoint, $payload->stdObject);

            echo $this->returnSuccess("Contatos inseridos com sucesso", $responseJson);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao inserir contatos");
        }
    }
}
