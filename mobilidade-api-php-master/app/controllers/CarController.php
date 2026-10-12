<?php

namespace app\controllers;

use app\dao\CarDao;
use Exception;

/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 09/09/2018
 * Time: 10:06
 */
class CarController extends ApiController
{
    public function actionInsert()
    {
        try {
            echo $this->returnSuccess("Carro cadastrado",
                (new CarDao)->insert($this->request())
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionInsertSecondCar()
    {
        try {
            $request = $this->request(false, true);
            $request->car->document = $_FILES['document'] ?? null;

            echo $this->returnSuccess("Carro cadastrado, em espera da aprovação no painel",
                (new CarDao)->insertSecondCar($request->car)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetByDriver()
    {
        try {
            echo $this->returnSuccess("Carro encontrado",
                (new CarDao)->getCarByDriver($this->request()->driverId)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetAll()
    {
        try {
            echo $this->returnSuccess("Carros encontrados",
                (new CarDao)->getAll()
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionFindAllPendingByDriver()
    {
        if (!isset($this->requestQuery()->driverId)) {
            echo $this->returnError(null, "ID do motorista não encontrado!");
            return;
        }
        try {
            echo $this->returnSuccess("Carros encontrados",
                (new CarDao)->findAllPendingByDriver($this->requestQuery()->driverId)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetPendingCars()
    {
        try {
            $cityId = $_GET['id'] ?? null;
            if (empty($cityId) && isset($_GET['cityId'])) {
                $cityId = $_GET['cityId'];
            }
            $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
            $perPage = isset($_GET['perPage']) ? max(1, (int)$_GET['perPage']) : 10;
            $offset = ($page - 1) * $perPage;

            $conn = \app\utils\Connection::open();

            $whereCity = '';
            $params = [];
            if (!empty($cityId) && is_numeric($cityId)) {
                $whereCity = ' AND d.cityId = :cityId ';
                $params[':cityId'] = (int)$cityId;
            }

            // Count total
            $countSql = "SELECT COUNT(*) as total 
                         FROM car c
                         INNER JOIN driver d ON c.driverId = d.idDriver
                         WHERE c.pending = 1 AND c.deleted_at IS NULL {$whereCity}";
            $countStmt = $conn->prepare($countSql);
            foreach ($params as $key => $val) {
                $countStmt->bindValue($key, $val, is_int($val) ? \PDO::PARAM_INT : \PDO::PARAM_STR);
            }
            $countStmt->execute();
            $total = (int)$countStmt->fetchColumn();

            // Select rows
            $dataSql = "SELECT 
                            c.idCar,
                            c.brand,
                            c.model,
                            c.plate,
                            c.color,
                            c.year,
                            c.renavam,
                            c.document,
                            c.seatsNumber,
                            c.rentalCar,
                            c.rentalCompanyDocument,
                            c.pending,
                            c.created_at,
                            c.updated_at,
                            c.deleted_at,
                            d.idDriver,
                            d.userId as idUser,
                            d.cityId,
                            COALESCE(u.name, '') as driverName
                        FROM car c
                        INNER JOIN driver d ON c.driverId = d.idDriver
                        LEFT JOIN `user` u ON d.userId = u.idUser
                        WHERE c.pending = 1 AND c.deleted_at IS NULL {$whereCity}
                        ORDER BY c.idCar DESC
                        LIMIT :limit OFFSET :offset";

            $stmt = $conn->prepare($dataSql);
            foreach ($params as $key => $val) {
                $stmt->bindValue($key, $val, is_int($val) ? \PDO::PARAM_INT : \PDO::PARAM_STR);
            }
            $stmt->bindValue(':limit', $perPage, \PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, \PDO::PARAM_INT);
            $stmt->execute();
            $rows = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            $s3Base = env('S3_LINK', 'https://s3.amazonaws.com');
            $data = array_map(function ($row) use ($s3Base) {
                $doc = $row['document'] ?? null;
                if ($doc && !filter_var($doc, FILTER_VALIDATE_URL)) {
                    $doc = rtrim($s3Base, '/') . '/' . ltrim($doc, '/');
                }
                return [
                    'idCar' => (int)$row['idCar'],
                    'brand' => $row['brand'] ?? '',
                    'model' => $row['model'] ?? '',
                    'plate' => $row['plate'] ?? '',
                    'color' => $row['color'] ?? '',
                    'year' => (string)($row['year'] ?? ''),
                    'renavam' => (string)($row['renavam'] ?? ''),
                    'document' => $doc,
                    'seatsNumber' => (int)($row['seatsNumber'] ?? 4),
                    'rentalCar' => $row['rentalCar'] ?? null,
                    'rentalCompanyDocument' => $row['rentalCompanyDocument'] ?? null,
                    'pending' => (int)$row['pending'],
                    'created_at' => $row['created_at'],
                    'updated_at' => $row['updated_at'],
                    'deleted_at' => $row['deleted_at'],
                    'idDriver' => (int)$row['idDriver'],
                    'idUser' => (int)$row['idUser'],
                    'cityId' => (int)$row['cityId'],
                    'driverName' => $row['driverName'] ?? '',
                    'carTypeId' => null
                ];
            }, $rows);

            $lastPage = $total > 0 ? (int)ceil($total / $perPage) : 1;

            $response = [
                'current_page' => $page,
                'data' => $data,
                'first_page_url' => '',
                'from' => $total > 0 ? $offset + 1 : null,
                'last_page' => $lastPage,
                'last_page_url' => '',
                'next_page_url' => '',
                'path' => '',
                'per_page' => $perPage,
                'prev_page_url' => '',
                'to' => $total > 0 ? min($offset + $perPage, $total) : null,
                'total' => $total,
            ];

            echo $this->returnSuccess("Carros pendentes encontrados", $response);
        } catch (\Throwable $e) {
            echo $this->returnError($e);
        }
    }

    public function actionAcceptCar()
    {
        try {
            $req = $this->request();
            $idCar = $req->id ?? $req->idCar ?? null;
            if (!$idCar) {
                throw new \Exception("ID do carro não informado");
            }

            $conn = \app\utils\Connection::open();

            $stmt = $conn->prepare("SELECT * FROM car WHERE idCar = :idCar LIMIT 1");
            $stmt->execute([':idCar' => $idCar]);
            $car = $stmt->fetch(\PDO::FETCH_ASSOC);

            if (!$car) {
                throw new \Exception("Carro não encontrado");
            }

            $driverId = $car['driverId'];

            // Soft-delete previous active cars for this driver
            $stmtArchive = $conn->prepare("UPDATE car SET deleted_at = NOW() WHERE driverId = :driverId AND idCar != :idCar AND deleted_at IS NULL");
            $stmtArchive->execute([':driverId' => $driverId, ':idCar' => $idCar]);

            // Activate accepted car
            $stmtActivate = $conn->prepare("UPDATE car SET pending = 0, deleted_at = NULL, updated_at = NOW() WHERE idCar = :idCar");
            $stmtActivate->execute([':idCar' => $idCar]);

            echo $this->returnSuccess("Carro confirmado com sucesso!");
        } catch (\Throwable $e) {
            echo $this->returnError($e);
        }
    }

    public function actionRejectCar()
    {
        try {
            $req = $this->request();
            $idCar = $req->id ?? $req->idCar ?? null;
            if (!$idCar) {
                throw new \Exception("ID do carro não informado");
            }

            $conn = \app\utils\Connection::open();

            $stmt = $conn->prepare("UPDATE car SET pending = 2, deleted_at = NOW(), updated_at = NOW() WHERE idCar = :idCar");
            $stmt->execute([':idCar' => $idCar]);

            echo $this->returnSuccess("Carro rejeitado com sucesso!");
        } catch (\Throwable $e) {
            echo $this->returnError($e);
        }
    }
}