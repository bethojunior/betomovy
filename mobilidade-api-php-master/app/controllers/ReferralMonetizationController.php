<?php

namespace app\controllers;

use app\dao\GenericDao;
use Exception;

class ReferralMonetizationController extends ApiController
{
    public function actionIndex()
    {
        try {
            $method = $_SERVER['REQUEST_METHOD'];

            if ($method === 'GET') {
                $cityId = isset($_GET['cityId']) && !empty($_GET['cityId']) ? (int)$_GET['cityId'] : null;
                $where = ["r.statusId = 1"];
                $params = [];

                if ($cityId) {
                    $where[] = "(r.cityId = :cityId OR r.cityId IS NULL)";
                    $params[':cityId'] = $cityId;
                }

                $whereStr = implode(" AND ", $where);
                $sql = "SELECT r.id,
                               r.label,
                               r.indications,
                               r.value,
                               r.valueType,
                               r.statusId,
                               r.cityId,
                               r.created_at,
                               r.updated_at,
                               c.name AS cityName
                        FROM referralMonetization r
                        LEFT JOIN city c ON c.idCity = r.cityId
                        WHERE {$whereStr}
                        ORDER BY r.id DESC";

                $rows = GenericDao::query($sql, $params);
                $result = [];

                foreach ($rows as $row) {
                    $row['id'] = (int)$row['id'];
                    $row['indications'] = (int)$row['indications'];
                    $row['value'] = (float)$row['value'];
                    $row['statusId'] = (int)$row['statusId'];
                    $row['cityId'] = $row['cityId'] !== null ? (int)$row['cityId'] : null;
                    $result[] = $row;
                }

                echo $this->returnSuccess("Regras de monetização por indicação", $result);
                return;
            }

            if ($method === 'POST') {
                $data = $this->request(false);
                $label = $data->label ?? '';
                $indications = (int)($data->indications ?? 1);
                $value = (float)($data->value ?? 0);
                $valueType = in_array($data->valueType ?? '', ['$', '%']) ? $data->valueType : '$';
                $cityId = !empty($data->cityId) ? (int)$data->cityId : null;

                GenericDao::execute("INSERT INTO referralMonetization (label, indications, value, valueType, statusId, cityId, created_at, updated_at) 
                                    VALUES (:label, :indications, :value, :valueType, 1, :cityId, NOW(), NOW())", [
                    ':label' => $label,
                    ':indications' => $indications,
                    ':value' => $value,
                    ':valueType' => $valueType,
                    ':cityId' => $cityId
                ]);

                echo $this->returnSuccess("Regra de monetização cadastrada com sucesso");
                return;
            }

            if ($method === 'PUT') {
                $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
                $data = $this->request(false);
                if (!$id && isset($data->id)) {
                    $id = (int)$data->id;
                }

                if (!$id) {
                    throw new Exception("ID da regra não informado.");
                }

                $fields = ["updated_at = NOW()"];
                $params = [':id' => $id];

                if (isset($data->label)) { $fields[] = "label = :label"; $params[':label'] = $data->label; }
                if (isset($data->indications)) { $fields[] = "indications = :indications"; $params[':indications'] = (int)$data->indications; }
                if (isset($data->value)) { $fields[] = "value = :value"; $params[':value'] = (float)$data->value; }
                if (isset($data->valueType)) { $fields[] = "valueType = :valueType"; $params[':valueType'] = $data->valueType; }
                if (isset($data->cityId)) { $fields[] = "cityId = :cityId"; $params[':cityId'] = !empty($data->cityId) ? (int)$data->cityId : null; }

                $sql = "UPDATE referralMonetization SET " . implode(", ", $fields) . " WHERE id = :id";
                GenericDao::execute($sql, $params);

                echo $this->returnSuccess("Regra de monetização atualizada com sucesso");
                return;
            }

            if ($method === 'DELETE') {
                $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
                if (!$id) {
                    throw new Exception("ID da regra não informado.");
                }

                GenericDao::execute("UPDATE referralMonetization SET statusId = 2, updated_at = NOW() WHERE id = :id", [':id' => $id]);
                echo $this->returnSuccess("Regra de monetização removida com sucesso");
                return;
            }

            throw new Exception("Método não suportado.");
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao processar monetização por indicação");
        }
    }
}
