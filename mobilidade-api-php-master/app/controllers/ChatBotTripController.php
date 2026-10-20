<?php

namespace app\controllers;

use app\services\ChatBotTripService;
use app\utils\BaseDao;
use Exception;

class ChatBotTripController extends ApiController
{
    public function actionIndex()
    {
        try {
            $method = $_SERVER['REQUEST_METHOD'];
            $dao = new BaseDao();

            if ($method === 'GET') {
                $sql = "SELECT c.idChatBotTrip,
                               c.message,
                               c.statusId,
                               c.chatBotTripTypeId,
                               t.name AS typeName
                        FROM chatBotTrip c
                        LEFT JOIN chatBotTripType t ON t.id = c.chatBotTripTypeId
                        WHERE c.statusId = 1
                        ORDER BY c.idChatBotTrip ASC";

                $rows = $dao->sqlRawSelect($sql)->get();
                $result = [];

                if (is_array($rows)) {
                    foreach ($rows as $row) {
                        $row['idChatBotTrip'] = (int)$row['idChatBotTrip'];
                        $row['statusId'] = (int)$row['statusId'];
                        $row['chatBotTripTypeId'] = (int)$row['chatBotTripTypeId'];
                        $result[] = $row;
                    }
                }

                echo $this->returnSuccess("Mensagens automáticas", $result);
                return;
            }

            if ($method === 'POST') {
                $data = $this->request(false);
                $message = isset($data->message) ? trim($data->message) : '';
                $typeId = isset($data->chatBotTripTypeId) ? (int)$data->chatBotTripTypeId : 1;

                if (empty($message)) {
                    throw new Exception("Mensagem é obrigatória.");
                }

                $dao->sqlRawSelect("INSERT INTO chatBotTrip (message, chatBotTripTypeId, statusId) VALUES (:message, :typeId, 1)", [
                    ':message' => $message,
                    ':typeId' => $typeId
                ]);

                echo $this->returnSuccess("Mensagem cadastrada com sucesso");
                return;
            }

            if ($method === 'PUT') {
                $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
                $data = $this->request(false);
                if (!$id && isset($data->idChatBotTrip)) {
                    $id = (int)$data->idChatBotTrip;
                }

                if (!$id) {
                    throw new Exception("ID da mensagem não informado.");
                }

                $message = isset($data->message) ? trim($data->message) : null;
                $typeId = isset($data->chatBotTripTypeId) ? (int)$data->chatBotTripTypeId : null;

                $fields = [];
                $params = [':id' => $id];

                if ($message !== null) {
                    $fields[] = "message = :message";
                    $params[':message'] = $message;
                }
                if ($typeId !== null) {
                    $fields[] = "chatBotTripTypeId = :typeId";
                    $params[':typeId'] = $typeId;
                }

                if (!empty($fields)) {
                    $sql = "UPDATE chatBotTrip SET " . implode(", ", $fields) . " WHERE idChatBotTrip = :id";
                    $dao->sqlRawSelect($sql, $params);
                }

                echo $this->returnSuccess("Mensagem atualizada com sucesso");
                return;
            }

            if ($method === 'DELETE') {
                $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
                if (!$id) {
                    throw new Exception("ID da mensagem não informado.");
                }

                $dao->sqlRawSelect("UPDATE chatBotTrip SET statusId = 2 WHERE idChatBotTrip = :id", [':id' => $id]);
                echo $this->returnSuccess("Mensagem removida com sucesso");
                return;
            }

            throw new Exception("Método não suportado.");
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao processar mensagens do chat");
        }
    }

    public function actionSendMessage()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess("Mensagem enviada",
                (new ChatBotTripService)->sendMessage($request));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
