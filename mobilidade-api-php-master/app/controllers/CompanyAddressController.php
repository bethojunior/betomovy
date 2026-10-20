<?php

namespace app\controllers;

use app\dao\GenericDao;
use Exception;

class CompanyAddressController extends ApiController
{
    public function actionIndex()
    {
        try {
            $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

            if ($method === 'GET') {
                $companyId = (int)($_GET['companyId'] ?? 0);
                if (!$companyId && isset($_GET['id'])) {
                    $companyId = (int)$_GET['id'];
                }

                $sql = "SELECT id, companyId, address, latitude, longitude, isDefault 
                        FROM companyAddress 
                        WHERE deleted_at IS NULL";
                $params = [];

                if ($companyId > 0) {
                    $sql .= " AND companyId = :cid";
                    $params[':cid'] = $companyId;
                }

                $sql .= " ORDER BY isDefault DESC, id DESC";
                $rows = GenericDao::query($sql, $params);
                $result = [];

                foreach ($rows as $row) {
                    $row['id'] = (int)$row['id'];
                    $row['companyId'] = (int)$row['companyId'];
                    $row['latitude'] = (float)$row['latitude'];
                    $row['longitude'] = (float)$row['longitude'];
                    $row['isDefault'] = (bool)(int)$row['isDefault'];
                    $result[] = $row;
                }

                echo $this->returnSuccess("Endereços da empresa", $result);
                return;
            }

            if ($method === 'POST') {
                $data = $this->request(false);
                $companyId = (int)($data->companyId ?? 0);
                $address = trim($data->address ?? '');
                $lat = (float)($data->latitude ?? 0);
                $lng = (float)($data->longitude ?? 0);
                $isDefault = !empty($data->isDefault) ? 1 : 0;

                if ($isDefault) {
                    GenericDao::execute("UPDATE companyAddress SET isDefault = 0 WHERE companyId = :cid", [':cid' => $companyId]);
                }

                GenericDao::execute("INSERT INTO companyAddress (companyId, address, latitude, longitude, isDefault, created_at, updated_at) 
                                     VALUES (:cid, :addr, :lat, :lng, :def, NOW(), NOW())", [
                    ':cid' => $companyId,
                    ':addr' => $address,
                    ':lat' => $lat,
                    ':lng' => $lng,
                    ':def' => $isDefault
                ]);

                echo $this->returnSuccess("Endereço adicionado com sucesso");
                return;
            }

            if ($method === 'PUT') {
                $id = (int)($_GET['id'] ?? 0);
                $data = $this->request(false);
                $address = trim($data->address ?? '');
                $lat = (float)($data->latitude ?? 0);
                $lng = (float)($data->longitude ?? 0);
                $isDefault = !empty($data->isDefault) ? 1 : 0;

                $current = GenericDao::first("SELECT companyId FROM companyAddress WHERE id = :id", [':id' => $id]);
                if ($isDefault && $current) {
                    GenericDao::execute("UPDATE companyAddress SET isDefault = 0 WHERE companyId = :cid", [':cid' => (int)$current['companyId']]);
                }

                GenericDao::execute("UPDATE companyAddress 
                                     SET address = :addr, latitude = :lat, longitude = :lng, isDefault = :def, updated_at = NOW() 
                                     WHERE id = :id", [
                    ':id' => $id,
                    ':addr' => $address,
                    ':lat' => $lat,
                    ':lng' => $lng,
                    ':def' => $isDefault
                ]);

                echo $this->returnSuccess("Endereço atualizado com sucesso");
                return;
            }

            if ($method === 'DELETE') {
                $id = (int)($_GET['id'] ?? 0);
                GenericDao::execute("UPDATE companyAddress SET deleted_at = NOW() WHERE id = :id", [':id' => $id]);
                echo $this->returnSuccess("Endereço removido com sucesso");
                return;
            }
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
