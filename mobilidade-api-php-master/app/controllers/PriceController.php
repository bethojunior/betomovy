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

        if ($method === 'DELETE') {
            $this->actionDelete();
            return;
        }

        try {
            $rawCityId = $_GET['cityId'] ?? ($_SERVER['HTTP_CITYID'] ?? ($_SERVER['HTTP_CITY_ID'] ?? 0));
            $cityId = (int)$rawCityId;
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
                LEFT JOIN tripType tt ON p.tripTypeId = tt.idTripType
                WHERE (p.cityId = :cityId OR :cityIdZero = 0)
                  AND p.statusId = 1
                ORDER BY p.cityId ASC, (p.`order` IS NULL) ASC, p.`order` ASC, p.tripTypeId ASC
            ");
            $stmt->execute([':cityId' => $cityId, ':cityIdZero' => $cityId]);
            $rows = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            $data = array_map(function ($row) {
                $item = $row;
                $tId = (int)($row['idTripType'] ?? $row['tripTypeId']);
                $item['trip_type'] = [
                    'idTripType' => $tId,
                    'id' => $tId,
                    'type' => $row['type'] ?? $row['tripTypeName'] ?? $row['tag'] ?? ('Tarifa ' . $tId),
                    'name' => $row['tripTypeName'] ?? $row['type'] ?? $row['tag'] ?? ('Tarifa ' . $tId),
                    'description' => $row['tripTypeDescription'] ?? '',
                    'picture' => $row['tripTypePicture'] ?? '',
                    'serviceOption' => (int)($row['serviceOption'] ?? 0)
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
            $rawCityId = $body['cityId'] ?? ($_GET['cityId'] ?? ($_SERVER['HTTP_CITYID'] ?? ($_SERVER['HTTP_CITY_ID'] ?? 0)));
            $cityId = (int)$rawCityId;
            $tripTypeId = (int)($body['tripTypeId'] ?? ($_GET['tripTypeId'] ?? 0));

            if ($cityId <= 0 || $tripTypeId <= 0) {
                http_response_code(400);
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode([
                    'status' => false,
                    'message' => 'cityId e tripTypeId são obrigatórios para salvar preço.',
                    'data' => null,
                    'response' => null,
                    'errors' => 'cityId and tripTypeId required'
                ]);
                return;
            }

            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);

            // Inactivate existing price for same city and tripType
            $upd = $pdo->prepare("UPDATE price SET statusId = 2, updated_at = NOW() WHERE cityId = :cityId AND tripTypeId = :tripTypeId");
            $upd->execute([':cityId' => $cityId, ':tripTypeId' => $tripTypeId]);

            $order = null;
            if (isset($body['order']) && $body['order'] !== '' && $body['order'] !== null) {
                $order = (int)$body['order'];
            }

            $fields = [
                'cityId' => $cityId,
                'tripTypeId' => $tripTypeId,
                'min_price' => (float)($body['min_price'] ?? $body['minPrice'] ?? 0),
                'base_price' => (float)($body['base_price'] ?? $body['basePrice'] ?? 0),
                'km_price' => (float)($body['km_price'] ?? $body['kmPrice'] ?? 0),
                'minute_price' => (float)($body['minute_price'] ?? $body['minutePrice'] ?? 0),
                'tax_price' => (float)($body['tax_price'] ?? $body['taxPrice'] ?? 0),
                'tax_price_type' => (string)($body['tax_price_type'] ?? $body['taxPriceType'] ?? '%'),
                'tax_price_description' => !empty($body['tax_price_description']) ? (string)$body['tax_price_description'] : null,
                'another_fee' => (float)($body['another_fee'] ?? $body['anotherFee'] ?? 0),
                'another_fee_type' => (string)($body['another_fee_type'] ?? $body['anotherFeeType'] ?? '%'),
                'another_fee_description' => !empty($body['another_fee_description']) ? (string)$body['another_fee_description'] : null,
                'waypoint_price' => (float)($body['waypoint_price'] ?? $body['waypointPrice'] ?? 0),
                'tag' => !empty($body['tag']) ? (string)$body['tag'] : null,
                'color' => !empty($body['color']) ? (string)$body['color'] : '#000000',
                'idealListCommonPrice' => (int)($body['idealListCommonPrice'] ?? 1),
                'long_distance_per_km' => (float)($body['long_distance_per_km'] ?? $body['longDistanceKm'] ?? 0),
                'long_distance_value_to_final_price' => !empty($body['long_distance_value_to_final_price']) ? 1 : 0,
                'long_distance_radius' => (float)($body['long_distance_radius'] ?? 0),
                'disable_after_km' => isset($body['disable_after_km']) && $body['disable_after_km'] !== '' && $body['disable_after_km'] !== null ? (float)$body['disable_after_km'] : null,
                'promotional_price_temp' => (float)($body['promotional_price_temp'] ?? 0),
                'reward_driver_min_price' => (float)($body['reward_driver_min_price'] ?? 0),
                'type_additional_value_after_km' => (string)($body['type_additional_value_after_km'] ?? '$'),
                'km_to_additional_value' => (float)($body['km_to_additional_value'] ?? 0),
                'additional_value_after_km' => (float)($body['additional_value_after_km'] ?? 0),
                'waiting_tolerance_seconds' => (int)($body['waiting_tolerance_seconds'] ?? 0),
                'waiting_extra_fee_per_minute' => (float)($body['waiting_extra_fee_per_minute'] ?? 0),
                'waiting_penalty_fee' => (float)($body['waiting_penalty_fee'] ?? 0),
                'order' => $order,
                'percentage_min_offer' => (float)($body['percentage_min_offer'] ?? 0),
                'percentage_max_offer' => (float)($body['percentage_max_offer'] ?? 0),
                'percentage_min_trip_partner' => (float)($body['percentage_min_trip_partner'] ?? 0),
                'percentage_max_trip_partner' => (float)($body['percentage_max_trip_partner'] ?? 0),
                'statusId' => 1
            ];

            $escapedCols = array_map(function($c) { return "`{$c}`"; }, array_keys($fields));
            $cols = implode(', ', $escapedCols) . ', `created_at`, `updated_at`';
            $placeholders = ':' . implode(', :', array_keys($fields)) . ', NOW(), NOW()';
            $ins = $pdo->prepare("INSERT INTO `price` ({$cols}) VALUES ({$placeholders})");
            $ins->execute($fields);
            $id = (int)$pdo->lastInsertId();

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
                LEFT JOIN tripType tt ON p.tripTypeId = tt.idTripType
                WHERE p.id = :id
                LIMIT 1
            ");
            $stmt->execute([':id' => $id]);
            $savedRow = $stmt->fetch(\PDO::FETCH_ASSOC);

            if ($savedRow) {
                $tId = (int)($savedRow['idTripType'] ?? $savedRow['tripTypeId']);
                $savedRow['trip_type'] = [
                    'idTripType' => $tId,
                    'id' => $tId,
                    'type' => $savedRow['type'] ?? $savedRow['tripTypeName'] ?? $savedRow['tag'] ?? ('Tarifa ' . $tId),
                    'name' => $savedRow['tripTypeName'] ?? $savedRow['type'] ?? $savedRow['tag'] ?? ('Tarifa ' . $tId),
                    'description' => $savedRow['tripTypeDescription'] ?? '',
                    'picture' => $savedRow['tripTypePicture'] ?? '',
                    'serviceOption' => (int)($savedRow['serviceOption'] ?? 0)
                ];
            } else {
                $savedRow = array_merge(['id' => $id], $fields);
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Preço salvo com sucesso',
                'data' => $savedRow,
                'response' => $savedRow,
                'errors' => null
            ]);
        } catch (\Throwable $e) {
            http_response_code(400);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao salvar preço: ' . $e->getMessage(),
                'data' => null,
                'response' => null,
                'errors' => $e->getMessage()
            ]);
        }
    }

    public function actionDelete()
    {
        try {
            $id = (int)($_GET['id'] ?? ($_GET['price_id'] ?? 0));
            if ($id <= 0) {
                $raw = file_get_contents('php://input');
                $body = json_decode($raw, true) ?: [];
                $id = (int)($body['id'] ?? ($body['price_id'] ?? 0));
            }

            if ($id > 0) {
                $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
                $stmt = $pdo->prepare("UPDATE price SET statusId = 2, updated_at = NOW() WHERE id = :id");
                $stmt->execute([':id' => $id]);
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Preço excluído com sucesso',
                'data' => true,
                'response' => true,
                'errors' => null
            ]);
        } catch (\Throwable $e) {
            http_response_code(400);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => false,
                'message' => 'Erro ao excluir preço: ' . $e->getMessage(),
                'data' => null,
                'response' => null,
                'errors' => $e->getMessage()
            ]);
        }
    }

    public function actionRange()
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);

        // POST: criar nova faixa de preço
        if ($method === 'POST') {
            try {
                $raw = file_get_contents('php://input');
                $body = json_decode($raw, true) ?: $_POST;
                $cityId = (int)($body['cityId'] ?? ($_SERVER['HTTP_CITYID'] ?? 0));
                $tripTypeId = (int)($body['tripTypeId'] ?? 0);
                $description = $body['description'] ?? '';
                $minValue = (float)($body['min_value'] ?? 0);
                $maxValue = (float)($body['max_value'] ?? 0);
                $newValue = (float)($body['new_value'] ?? 0);

                $ins = $pdo->prepare("
                    INSERT INTO priceRange (cityId, tripTypeId, description, min_value, max_value, new_value, statusId, created_at, updated_at)
                    VALUES (:cityId, :tripTypeId, :description, :min_value, :max_value, :new_value, 1, NOW(), NOW())
                ");
                $ins->execute([
                    ':cityId' => $cityId,
                    ':tripTypeId' => $tripTypeId,
                    ':description' => $description,
                    ':min_value' => $minValue,
                    ':max_value' => $maxValue,
                    ':new_value' => $newValue
                ]);
                $newId = $pdo->lastInsertId();

                header('Content-Type: application/json; charset=utf-8');
                echo json_encode([
                    'status' => true,
                    'message' => 'Faixa de preço adicionada com sucesso',
                    'response' => ['id' => $newId],
                    'data' => ['id' => $newId]
                ]);
                return;
            } catch (\Throwable $e) {
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode([
                    'status' => false,
                    'message' => 'Erro ao salvar faixa de preço: ' . $e->getMessage()
                ]);
                return;
            }
        }

        // DELETE: excluir faixa de preço
        if ($method === 'DELETE') {
            try {
                $id = (int)($_GET['id'] ?? 0);
                if ($id > 0) {
                    $del = $pdo->prepare("UPDATE priceRange SET statusId = 2, updated_at = NOW() WHERE id = :id");
                    $del->execute([':id' => $id]);
                }
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode([
                    'status' => true,
                    'message' => 'Faixa de preço excluída com sucesso',
                    'response' => true
                ]);
                return;
            } catch (\Throwable $e) {
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode([
                    'status' => false,
                    'message' => 'Erro ao excluir faixa de preço: ' . $e->getMessage()
                ]);
                return;
            }
        }

        // GET: listar faixas de preço
        try {
            $cityId = (int)($_GET['cityId'] ?? ($_SERVER['HTTP_CITYID'] ?? 0));
            $tripTypeId = (int)($_GET['tripTypeId'] ?? 0);

            $stmt = $pdo->prepare("
                SELECT 
                    pr.*,
                    tt.idTripType,
                    COALESCE(tt.name, tt.type) as tripTypeName,
                    tt.description as tripTypeDescription,
                    tt.picture as tripTypePicture
                FROM priceRange pr
                LEFT JOIN tripType tt ON pr.tripTypeId = tt.idTripType
                WHERE (pr.cityId = :cityId OR :cityIdZero = 0)
                  AND (pr.tripTypeId = :tripTypeId OR :tripTypeIdZero = 0)
                  AND pr.statusId = 1
                ORDER BY pr.id ASC
            ");
            $stmt->execute([
                ':cityId' => $cityId,
                ':cityIdZero' => $cityId,
                ':tripTypeId' => $tripTypeId,
                ':tripTypeIdZero' => $tripTypeId
            ]);
            $rows = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            $list = array_map(function ($row) {
                $item = $row;
                $item['trip_type'] = [
                    'idTripType' => (int)($row['tripTypeId'] ?? 0),
                    'id' => (int)($row['tripTypeId'] ?? 0),
                    'type' => $row['tripTypeName'] ?? 'Geral',
                    'name' => $row['tripTypeName'] ?? 'Geral',
                    'description' => $row['tripTypeDescription'] ?? '',
                    'picture' => $row['tripTypePicture'] ?? ''
                ];
                return $item;
            }, $rows);

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