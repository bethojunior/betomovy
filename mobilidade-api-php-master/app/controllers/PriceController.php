<?php

namespace app\controllers;
use app\services\PriceCustomerService;
use Exception;
use app\model\Location;

/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 11/09/2018
 * Time: 14:53
 */
class PriceController extends ApiController
{
    public function actionIndex()
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        if ($method === 'POST') {
            $this->actionStore();
            return;
        }

        try {
            $cityId = (int)($_GET['cityId'] ?? ($_SERVER['HTTP_CITYID'] ?? 0));
            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);

            $stmt = $pdo->prepare("
                SELECT 
                    p.*,
                    tt.idTripType,
                    tt.type,
                    COALESCE(tt.name, tt.type) as tripTypeName,
                    tt.description as tripTypeDescription,
                    tt.picture as tripTypePicture,
                    COALESCE(tt.serviceOption, 0) as serviceOption
                FROM price p
                INNER JOIN tripType tt ON p.tripTypeId = tt.idTripType
                WHERE (p.cityId = :cityId OR :cityIdZero = 0)
                  AND p.statusId = 1
                ORDER BY p.cityId ASC, p.`order` ASC, p.tripTypeId ASC
            ");
            $stmt->execute([':cityId' => $cityId, ':cityIdZero' => $cityId]);
            $rows = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            $data = array_map(function ($row) {
                $item = $row;
                $item['trip_type'] = [
                    'idTripType' => (int)$row['idTripType'],
                    'id' => (int)$row['idTripType'],
                    'type' => $row['type'],
                    'name' => $row['tripTypeName'],
                    'description' => $row['tripTypeDescription'],
                    'picture' => $row['tripTypePicture'],
                    'serviceOption' => (int)$row['serviceOption']
                ];
                return $item;
            }, $rows);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Preços encontrados',
                'data' => $data,
                'response' => $data,
                'errors' => null
            ]);
        } catch (\Throwable $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Preços encontrados',
                'data' => [],
                'response' => [],
                'errors' => null
            ]);
        }
    }

    public function actionStore()
    {
        try {
            $raw = file_get_contents('php://input');
            $body = json_decode($raw, true) ?: $_POST;
            $cityId = (int)($body['cityId'] ?? ($_SERVER['HTTP_CITYID'] ?? 0));
            $tripTypeId = (int)($body['tripTypeId'] ?? 0);

            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
            // Inactivate existing price for same city and tripType
            if ($cityId > 0 && $tripTypeId > 0) {
                $upd = $pdo->prepare("UPDATE price SET statusId = 2 WHERE cityId = :cityId AND tripTypeId = :tripTypeId");
                $upd->execute([':cityId' => $cityId, ':tripTypeId' => $tripTypeId]);
            }

            $fields = [
                'cityId' => $cityId,
                'tripTypeId' => $tripTypeId,
                'minPrice' => (float)($body['minPrice'] ?? 0),
                'basePrice' => (float)($body['basePrice'] ?? 0),
                'kmPrice' => (float)($body['kmPrice'] ?? 0),
                'minutePrice' => (float)($body['minutePrice'] ?? 0),
                'tag' => $body['tag'] ?? null,
                'statusId' => 1
            ];

            $cols = implode(', ', array_keys($fields));
            $placeholders = ':' . implode(', :', array_keys($fields));
            $ins = $pdo->prepare("INSERT INTO price ({$cols}) VALUES ({$placeholders})");
            $ins->execute($fields);
            $id = $pdo->lastInsertId();

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Preço salvo com sucesso',
                'data' => array_merge(['id' => $id], $fields),
                'response' => array_merge(['id' => $id], $fields),
                'errors' => null
            ]);
        } catch (\Throwable $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao salvar preço: ' . $e->getMessage(),
                'data' => null,
                'response' => null,
                'errors' => null
            ]);
        }
    }

    public function actionRange()
    {
        try {
            $cityId = (int)($_GET['cityId'] ?? ($_SERVER['HTTP_CITYID'] ?? 0));
            $tripTypeId = (int)($_GET['tripTypeId'] ?? 0);
            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);

            $stmt = $pdo->prepare("
                SELECT * FROM priceRange
                WHERE (cityId = :cityId OR :cityIdZero = 0)
                  AND (tripTypeId = :tripTypeId OR :tripTypeIdZero = 0)
                  AND statusId = 1
                ORDER BY id ASC
            ");
            $stmt->execute([
                ':cityId' => $cityId,
                ':cityIdZero' => $cityId,
                ':tripTypeId' => $tripTypeId,
                ':tripTypeIdZero' => $tripTypeId
            ]);
            $list = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Faixas de preço encontradas',
                'data' => $list,
                'response' => $list,
                'errors' => null
            ]);
        } catch (\Throwable $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Faixas de preço vazias',
                'data' => [],
                'response' => [],
                'errors' => null
            ]);
        }
    }

    public function actionDynamic()
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);

        // POST: criar nova bandeira
        if ($method === 'POST') {
            try {
                $raw = file_get_contents('php://input');
                $body = json_decode($raw, true) ?: $_POST;

                $cityId = (int)($body['cityId'] ?? ($_SERVER['HTTP_CITYID'] ?? 0));
                $days = (array)($body['dayOfWeek'] ?? []);
                $tripTypeIds = (array)($body['tripTypeId'] ?? []);
                $multiplierValue = (float)($body['multiplierValue'] ?? 1.0);
                $timeStart = $body['timeStart'] ?? '00:00:00';
                $timeEnd = $body['timeEnd'] ?? '23:59:59';
                $timezone = $body['timezone'] ?? null;

                if (empty($days)) $days = [1];
                if (empty($tripTypeIds)) $tripTypeIds = [1];

                $stmt = $pdo->prepare("
                    INSERT INTO priceDynamic (cityId, dayOfWeek, tripTypeId, multiplierValue, timeStart, timeEnd, timezone, active, statusId)
                    VALUES (:cityId, :dayOfWeek, :tripTypeId, :multiplierValue, :timeStart, :timeEnd, :timezone, 1, 1)
                ");

                $inserted = [];
                foreach ($days as $day) {
                    foreach ($tripTypeIds as $tid) {
                        $stmt->execute([
                            ':cityId' => $cityId,
                            ':dayOfWeek' => (int)$day,
                            ':tripTypeId' => (int)$tid,
                            ':multiplierValue' => $multiplierValue,
                            ':timeStart' => $timeStart,
                            ':timeEnd' => $timeEnd,
                            ':timezone' => $timezone
                        ]);
                        $inserted[] = $pdo->lastInsertId();
                    }
                }

                header('Content-Type: application/json; charset=utf-8');
                echo json_encode([
                    'status' => true,
                    'message' => 'Novo gatilho criado com sucesso',
                    'data' => $inserted,
                    'response' => $inserted,
                    'errors' => null
                ]);
            } catch (\Throwable $e) {
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode([
                    'status' => false,
                    'message' => 'Erro ao criar bandeira: ' . $e->getMessage(),
                    'data' => null,
                    'response' => null,
                    'errors' => null
                ]);
            }
            return;
        }

        // PUT: atualizar ou alterar status
        if ($method === 'PUT') {
            try {
                $raw = file_get_contents('php://input');
                $body = json_decode($raw, true) ?: $_POST;
                $uri = $_SERVER['REQUEST_URI'] ?? '';
                $id = (int)($_GET['id'] ?? 0);

                if (strpos($uri, '/disable') !== false) {
                    $upd = $pdo->prepare("UPDATE priceDynamic SET active = 0 WHERE idPriceDynamic = :id");
                    $upd->execute([':id' => $id]);
                } elseif (strpos($uri, '/enable') !== false) {
                    $upd = $pdo->prepare("UPDATE priceDynamic SET active = 1 WHERE idPriceDynamic = :id");
                    $upd->execute([':id' => $id]);
                } else {
                    // Update dados
                    $cityId = (int)($body['cityId'] ?? ($_SERVER['HTTP_CITYID'] ?? 0));
                    $tripTypeId = (int)($body['tripTypeId'] ?? 1);
                    $dayOfWeek = (int)($body['dayOfWeek'] ?? 1);
                    $multiplierValue = (float)($body['multiplierValue'] ?? 1.0);
                    $timeStart = $body['timeStart'] ?? '00:00:00';
                    $timeEnd = $body['timeEnd'] ?? '23:59:59';

                    $upd = $pdo->prepare("
                        UPDATE priceDynamic 
                        SET cityId = :cityId, tripTypeId = :tripTypeId, dayOfWeek = :dayOfWeek, 
                            multiplierValue = :multiplierValue, timeStart = :timeStart, timeEnd = :timeEnd
                        WHERE idPriceDynamic = :id
                    ");
                    $upd->execute([
                        ':id' => $id,
                        ':cityId' => $cityId,
                        ':tripTypeId' => $tripTypeId,
                        ':dayOfWeek' => $dayOfWeek,
                        ':multiplierValue' => $multiplierValue,
                        ':timeStart' => $timeStart,
                        ':timeEnd' => $timeEnd
                    ]);
                }

                header('Content-Type: application/json; charset=utf-8');
                echo json_encode([
                    'status' => true,
                    'message' => 'Status atualizado com sucesso!',
                    'data' => true,
                    'response' => true,
                    'errors' => null
                ]);
            } catch (\Throwable $e) {
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode([
                    'status' => false,
                    'message' => 'Erro ao atualizar bandeira: ' . $e->getMessage(),
                    'data' => null,
                    'response' => null,
                    'errors' => null
                ]);
            }
            return;
        }

        // DELETE: excluir bandeira
        if ($method === 'DELETE') {
            try {
                $id = (int)($_GET['id'] ?? 0);
                if ($id > 0) {
                    $del = $pdo->prepare("UPDATE priceDynamic SET statusId = 2 WHERE idPriceDynamic = :id");
                    $del->execute([':id' => $id]);
                }

                header('Content-Type: application/json; charset=utf-8');
                echo json_encode([
                    'status' => true,
                    'message' => 'Gatilho deletado com sucesso',
                    'data' => true,
                    'response' => true,
                    'errors' => null
                ]);
            } catch (\Throwable $e) {
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode([
                    'status' => false,
                    'message' => 'Erro ao deletar bandeira',
                    'data' => null,
                    'response' => null,
                    'errors' => null
                ]);
            }
            return;
        }

        // GET: Listagem formatada para o monitor
        try {
            $cityId = (int)($_GET['cityId'] ?? ($_SERVER['HTTP_CITYID'] ?? 0));

            $stmt = $pdo->prepare("
                SELECT 
                    pd.idPriceDynamic,
                    pd.idPriceDynamic as id,
                    pd.cityId,
                    pd.dayOfWeek,
                    pd.multiplierValue,
                    pd.active,
                    pd.tripTypeId,
                    pd.timeStart,
                    pd.timeEnd,
                    pd.timezone,
                    pd.statusId,
                    c.id as c_id,
                    c.nome as c_nome,
                    c.estado as c_estado,
                    c.shortName as c_shortName,
                    tt.idTripType as tt_id,
                    tt.type as tt_type,
                    tt.picture as tt_picture,
                    w.id as w_id,
                    w.day as w_day,
                    w.slug as w_slug,
                    w.description as w_description
                FROM priceDynamic pd
                LEFT JOIN city c ON pd.cityId = c.id
                LEFT JOIN tripType tt ON pd.tripTypeId = tt.idTripType
                LEFT JOIN weekDay w ON pd.dayOfWeek = w.day
                WHERE (pd.cityId = :cityId OR :cityIdZero = 0)
                  AND pd.statusId = 1
                ORDER BY pd.idPriceDynamic DESC
            ");
            $stmt->execute([':cityId' => $cityId, ':cityIdZero' => $cityId]);
            $rows = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            $list = array_map(function ($row) {
                return [
                    'id' => (int)$row['idPriceDynamic'],
                    'idPriceDynamic' => (int)$row['idPriceDynamic'],
                    'cityId' => (int)$row['cityId'],
                    'dayOfWeek' => (int)$row['dayOfWeek'],
                    'multiplierValue' => (float)$row['multiplierValue'],
                    'active' => (int)$row['active'],
                    'tripTypeId' => (int)$row['tripTypeId'],
                    'timeStart' => (string)$row['timeStart'],
                    'timeEnd' => (string)$row['timeEnd'],
                    'timezone' => $row['timezone'],
                    'statusId' => (int)$row['statusId'],
                    'city' => [
                        'id' => (int)($row['c_id'] ?? $row['cityId']),
                        'nome' => $row['c_nome'] ?? '',
                        'estado' => (int)($row['c_estado'] ?? 0),
                        'shortName' => $row['c_shortName'] ?? null
                    ],
                    'trip_type' => [
                        'idTripType' => (int)($row['tt_id'] ?? $row['tripTypeId']),
                        'type' => $row['tt_type'] ?? '',
                        'picture' => $row['tt_picture'] ?? ''
                    ],
                    'week_day' => [
                        'id' => (int)($row['w_id'] ?? $row['dayOfWeek']),
                        'day' => (int)($row['w_day'] ?? $row['dayOfWeek']),
                        'slug' => $row['w_slug'] ?? '',
                        'description' => $row['w_description'] ?? 'Dia ' . $row['dayOfWeek']
                    ]
                ];
            }, $rows);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Tarifas dinâmicas encontradas',
                'data' => $list,
                'response' => $list,
                'errors' => null
            ]);
        } catch (\Throwable $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Tarifas dinâmicas vazias',
                'data' => [],
                'response' => [],
                'errors' => null
            ]);
        }
    }

    public function actionFindByTripType()
    {
        try {
            $request = $this->requestQuery();

            echo $this->returnSuccess("Tarifa encontrada",
                (new PriceCustomerService)->findFare($request));
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar preço");
        }
    }

    public function actionCalculate()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess("Preço calculado",
                (new PriceCustomerService)->getTripPrice(
                    new Location($request->origin),
                    new Location($request->destiny),
                    $request->tripTypeId ?? null,
                    $request->waypoints ?? []
                )
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar preço");
        }
    }

    public function actionAvailableTripTypes()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess("Categorias encontradas",
                (new PriceCustomerService)->getAvailableTripTypes(
                    new Location($request->origin),
                    $request->onlyCentral ?? null,
                    $request->noDestination ?? false,
                )
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar categorias");
        }
    }

    public function actionCalculateAll()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess("Preços calculados",
                (new PriceCustomerService)->getAllTripPrices(
                    new Location($request->origin),
                    new Location($request->destiny),
                    $request->waypoints ?? null,
                    $request->time ?? null,
                    $request->onlyCentral ?? null,
                    $request->noDestination ?? false,
                    $request->timeCurrent ?? null,
                )
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar preços");
        }
    }

    public function actionPreviewNewPriceInChangeRoute()
    {
        try {
            $request = $this->request(false);

            echo $this->returnSuccess("Mostrar novo valor",
                (new PriceCustomerService)->previewNewPriceInChangeRoute(
                    $request->tripReference,
                    $request->destination,
                    $request->waypoints ?? [],
                    $request->kmProgressing ?? 0,
                    $request->minuteProgressing ?? 0,
                    $request->timeCurrent ?? null,
                    $request->multiplierDynamicPrice ?? null,
                ));
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao tentar mostrar novo valor da rota");
        }
    }

    public function actionGetWaitingTimeFees()
    {
         try {
            $request = $this->request(false);

            echo $this->returnSuccess("Sucesso ao trazer taxas",
                (new PriceCustomerService)->getWaitingTimeFees(
                    $request,
                ));
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao tentar trazer taxas");
        } 
    }
}