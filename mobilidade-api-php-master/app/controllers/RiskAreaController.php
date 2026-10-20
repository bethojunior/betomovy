<?php

namespace app\controllers;

use app\services\RiskAreaService;
use app\utils\BaseDao;
use Exception;

class RiskAreaController extends ApiController
{
    public function actionIndex()
    {
        try {
            $method = $_SERVER['REQUEST_METHOD'];
            $dao = new BaseDao();

            if ($method === 'GET') {
                $page = isset($_GET['page']) && (int)$_GET['page'] > 0 ? (int)$_GET['page'] : 1;
                $cityId = isset($_GET['cityId']) && !empty($_GET['cityId']) ? (int)$_GET['cityId'] : null;
                $limit = 15;
                $offset = ($page - 1) * $limit;

                $where = ["ra.deleted_at IS NULL"];
                $params = [];

                if ($cityId) {
                    $where[] = "ra.cityId = :cityId";
                    $params[':cityId'] = $cityId;
                }

                $whereStr = implode(" AND ", $where);

                $countRow = $dao->sqlRawSelect("SELECT COUNT(*) AS total FROM riskArea ra WHERE {$whereStr}", $params)->first();
                $total = $countRow ? (int)$countRow['total'] : 0;
                $lastPage = $total > 0 ? (int)ceil($total / $limit) : 1;

                $sql = "SELECT ra.id,
                               ra.address,
                               ra.latitude,
                               ra.longitude,
                               ra.radius,
                               ra.status,
                               ra.userId,
                               ra.cityId,
                               ra.created_at,
                               ra.updated_at,
                               u.name AS userName,
                               u.phone AS userPhone,
                               ci.name AS cityName
                        FROM riskArea ra
                        LEFT JOIN user u ON u.idUser = ra.userId
                        LEFT JOIN city ci ON ci.idCity = ra.cityId
                        WHERE {$whereStr}
                        ORDER BY ra.id DESC
                        LIMIT {$limit} OFFSET {$offset}";

                $rows = $dao->sqlRawSelect($sql, $params)->get();
                $data = [];

                if (is_array($rows)) {
                    foreach ($rows as $row) {
                        $item = [
                            'id' => (int)$row['id'],
                            'address' => $row['address'],
                            'latitude' => $row['latitude'],
                            'longitude' => $row['longitude'],
                            'radius' => (int)($row['radius'] ?? 100),
                            'status' => $row['status'],
                            'cityId' => (int)$row['cityId'],
                            'cityName' => $row['cityName'] ?? '',
                            'created_at' => $row['created_at'] ? date('c', strtotime($row['created_at'])) : date('c'),
                            'user' => [
                                'name' => $row['userName'] ?? 'Administrador',
                                'phone' => $row['userPhone'] ?? ''
                            ]
                        ];
                        $data[] = $item;
                    }
                }

                $response = [
                    'data' => $data,
                    'current_page' => $page,
                    'last_page' => $lastPage,
                    'per_page' => $limit,
                    'total' => $total
                ];

                echo $this->returnSuccess("Áreas de risco", $response);
                return;
            }

            if ($method === 'PUT') {
                $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
                $data = $this->request(false);
                if (!$id && isset($data->id)) {
                    $id = (int)$data->id;
                }

                if (!$id) {
                    throw new Exception("ID da área de risco não informado.");
                }

                $status = isset($data->status) ? $data->status : null;
                $radius = isset($data->radius) ? (int)$data->radius : null;

                $fields = ["updated_at = NOW()"];
                $params = [':id' => $id];

                if ($status !== null) { $fields[] = "status = :status"; $params[':status'] = $status; }
                if ($radius !== null) { $fields[] = "radius = :radius"; $params[':radius'] = $radius; }

                $sql = "UPDATE riskArea SET " . implode(", ", $fields) . " WHERE id = :id";
                $dao->sqlRawSelect($sql, $params);

                echo $this->returnSuccess("Área de risco atualizada com sucesso");
                return;
            }

            if ($method === 'DELETE') {
                $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
                if (!$id) {
                    throw new Exception("ID da área de risco não informado.");
                }

                $dao->sqlRawSelect("UPDATE riskArea SET deleted_at = NOW() WHERE id = :id", [':id' => $id]);
                echo $this->returnSuccess("Área de risco removida com sucesso");
                return;
            }

            throw new Exception("Método não suportado.");
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionStore()
    {
        try {
            echo $this->returnSuccess("Área de risco criada com sucesso", (new RiskAreaService)->store($this->request(false)));
        } catch (Exception $exception) {
            echo $this->returnError($exception);
        }
    }
}
