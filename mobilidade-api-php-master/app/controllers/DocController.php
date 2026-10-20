<?php

namespace app\controllers;

use app\dao\DocDao;
use app\model\Status;
use app\services\DocService;
use Exception;

class DocController extends ApiController
{
    public function actionIndex()
    {
        try {
            $method = $_SERVER['REQUEST_METHOD'];
            $dao = new DocDao();

            if ($method === 'GET') {
                $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
                if ($id) {
                    $item = $dao->sqlRawSelect("SELECT * FROM doc WHERE id = :id AND deleted_at IS NULL", [':id' => $id])->first();
                    echo $this->returnSuccess("Documento", $item);
                    return;
                }

                $result = (new DocService)->findAll();
                echo $this->returnSuccess("Documentos encontrados", $result);
                return;
            }

            if ($method === 'DELETE') {
                $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
                if (!$id) {
                    throw new Exception("ID do documento não informado.");
                }

                $dao->sqlRawSelect("UPDATE doc SET statusId = :statusId, deleted_at = NOW() WHERE id = :id", [
                    ':statusId' => Status::INATIVO,
                    ':id' => $id
                ]);

                echo $this->returnSuccess("Documento removido com sucesso");
                return;
            }

            if ($method === 'POST') {
                $data = $this->request(false);
                $label = $data->label ?? '';
                $description = $data->description ?? '';
                $image = !empty($data->image) ? 1 : 0;
                $text = !empty($data->text) ? 1 : 0;
                $pdf = !empty($data->pdf) ? 1 : 0;

                $dao->sqlRawSelect("INSERT INTO doc (label, description, image, text, pdf, statusId, created_at, updated_at)
                                    VALUES (:label, :description, :image, :text, :pdf, 1, NOW(), NOW())", [
                    ':label' => $label,
                    ':description' => $description,
                    ':image' => $image,
                    ':text' => $text,
                    ':pdf' => $pdf
                ]);

                echo $this->returnSuccess("Documento cadastrado com sucesso");
                return;
            }

            throw new Exception("Método não suportado.");
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao processar documentos");
        }
    }

    public function actionFindAll()
    {
        try {
            $result = (new DocService)->findAll();
            echo $this->returnSuccess("Documentos encontrados", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar os documentos");
        }
    }
}
