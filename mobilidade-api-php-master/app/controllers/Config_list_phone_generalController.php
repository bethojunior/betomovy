<?php

namespace app\controllers;

use app\dao\GenericDao;
use Exception;

class Config_list_phone_generalController extends ApiController
{
    public function actionConfig()
    {
        try {
            $method = $_SERVER['REQUEST_METHOD'];

            if ($method === 'GET') {
                $row = GenericDao::first("SELECT id, messageContacts, created_at, updated_at FROM config_list_contacts_general ORDER BY id DESC LIMIT 1");
                if (!$row) {
                    $row = [
                        'id' => 1,
                        'messageContacts' => 'Olá! Baixe nosso aplicativo Movy e aproveite a melhor experiência em mobilidade.',
                        'created_at' => date('c'),
                        'updated_at' => date('c')
                    ];
                }
                echo $this->returnSuccess("Configuração de contatos", $row);
                return;
            }

            if ($method === 'POST' || $method === 'PUT') {
                $data = $this->request(false);
                $msg = $data->messageContacts ?? ($data->message ?? '');
                GenericDao::execute("UPDATE config_list_contacts_general SET messageContacts = :msg, updated_at = NOW()", [':msg' => $msg]);
                echo $this->returnSuccess("Configuração atualizada com sucesso");
                return;
            }

            throw new Exception("Método não suportado.");
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
