<?php

namespace app\controllers;

use app\services\AddressBlacklistService;
use app\utils\BaseDao;
use Exception;

class AddressBlacklistController extends ApiController
{
    public function actionIndex()
    {
        try {
            $method = $_SERVER['REQUEST_METHOD'];
            $dao = new BaseDao();

            if ($method === 'GET') {
                $sql = "SELECT id, address, approved, latitude, longitude, created_at, updated_at 
                        FROM addressBlacklist 
                        WHERE deleted_at IS NULL 
                        ORDER BY id DESC";
                $rows = $dao->sqlRawSelect($sql)->get();
                $result = [];

                if (is_array($rows)) {
                    foreach ($rows as $row) {
                        $row['id'] = (int)$row['id'];
                        $row['approved'] = (int)$row['approved'];
                        $result[] = $row;
                    }
                }

                echo $this->returnSuccess("Endereços na blacklist", $result);
                return;
            }

            if ($method === 'DELETE') {
                $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
                if (!$id) {
                    throw new Exception("ID do endereço não informado.");
                }

                $dao->sqlRawSelect("UPDATE addressBlacklist SET deleted_at = NOW() WHERE id = :id", [':id' => $id]);
                echo $this->returnSuccess("Endereço removido da blacklist");
                return;
            }

            throw new Exception("Método não suportado.");
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionInsert()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess(
                "Endereço salvo na blacklist",
                (new AddressBlacklistService)->insert($request));
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao salvar endereço na blacklist", 400);
        }
    }
}
