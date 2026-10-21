<?php

namespace app\controllers;

use app\utils\Connection;
use Exception;
use PDO;

class DashboardController extends ApiController
{
    private function getPdo(): PDO
    {
        return Connection::open();
    }

    private function getCityId(): ?int
    {
        $headers = function_exists('getallheaders') ? getallheaders() : [];
        $cityId = $headers['cityid'] ?? $headers['cityId'] ?? $_SERVER['HTTP_CITYID'] ?? $_GET['cityId'] ?? $_GET['city'] ?? null;
        return $cityId ? (int)$cityId : null;
    }

    /**
     * GET /dashboard/all
     */
    public function actionAll()
    {
        try {
            $cityId = $this->getCityId();
            $pdo = $this->getPdo();

            // 1. Ranking Customer
            $rankingCustomer = $this->queryRankingCustomer($pdo, $cityId, 10, 0);

            // 2. Ranking Driver
            $rankingDriver = $this->queryRankingDriver($pdo, $cityId, 10, 0);

            // 3. Statistics by City (Today and totals)
            $statisticsByCity = $this->queryStatisticsByCity($pdo, $cityId);

            // 4. Current Quantities
            $currentQuantities = $this->queryCurrentQuantities($pdo, $cityId);

            // 5. Total Billed today
            $totalBilled = $this->queryTotalBilled($pdo, $cityId);

            $data = [
                'rankingCustomer' => $rankingCustomer,
                'rankingDriver' => $rankingDriver,
                'statisticsByCity' => $statisticsByCity,
                'currentQuantities' => $currentQuantities,
                'totalBilled' => $totalBilled
            ];

            echo $this->returnSuccess('Dados do dashboard carregados com sucesso', $data);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    /**
     * GET /dashboard/rankingDriver
     */
    public function actionRankingDriver()
    {
        try {
            $cityId = $this->getCityId();
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
            $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
            $offset = ($page - 1) * $limit;
            $dateStart = $_GET['dateStart'] ?? null;
            $dateEnd = $_GET['dateEnd'] ?? null;

            $pdo = $this->getPdo();
            $drivers = $this->queryRankingDriver($pdo, $cityId, $limit, $offset, $dateStart, $dateEnd);

            echo $this->returnSuccess('Ranking de motoristas', $drivers);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    /**
     * GET /dashboard/rankingCustomer
     */
    public function actionRankingCustomer()
    {
        try {
            $cityId = $this->getCityId();
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
            $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
            $offset = ($page - 1) * $limit;
            $dateStart = $_GET['dateStart'] ?? null;
            $dateEnd = $_GET['dateEnd'] ?? null;

            $pdo = $this->getPdo();
            $customers = $this->queryRankingCustomer($pdo, $cityId, $limit, $offset, $dateStart, $dateEnd);

            echo $this->returnSuccess('Ranking de clientes', $customers);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    /**
     * GET /dashboard/tripsByStatus or quantityTripsByStatus
     */
    public function actionTripsByStatus()
    {
        try {
            $pdo = $this->getPdo();
            $cityId = $this->getCityId();

            $cityWhere = $cityId ? "AND cityId = {$cityId}" : "";
            $sql = "
                SELECT 'Aceitas' AS status,
                       coalesce((SELECT count(idTrip) FROM trip WHERE status = 'accepted' {$cityWhere}), 0) AS quantity
                UNION ALL
                SELECT 'Finalizadas' AS status,
                       coalesce((SELECT count(idTrip) FROM trip WHERE status = 'finished' {$cityWhere}), 0) AS quantity
            ";
            $stmt = $pdo->query($sql);
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo $this->returnSuccess('Quantidade de viagens por status', $res);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    /**
     * GET /dashboard/tripsCanceledByUser or quantityTripsCanceledByUser
     */
    public function actionTripsCanceledByUser()
    {
        try {
            $pdo = $this->getPdo();
            $cityId = $this->getCityId();

            $cityWhere = $cityId ? "AND cityId = {$cityId}" : "";
            $sql = "
                SELECT 'Motorista' AS canceledBy,
                       coalesce((SELECT count(idTrip) FROM trip WHERE status = 'canceled' AND canceledBy = 'driver' {$cityWhere}), 0) AS quantity
                UNION ALL
                SELECT 'Cliente' AS canceledBy,
                       coalesce((SELECT count(idTrip) FROM trip WHERE status = 'canceled' AND canceledBy = 'customer' {$cityWhere}), 0) AS quantity
            ";
            $stmt = $pdo->query($sql);
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo $this->returnSuccess('Quantidade de viagens canceladas por usuário', $res);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionActiveTrips()
    {
        try {
            $pdo = $this->getPdo();
            $cityId = $this->getCityId();

            // Detect if a single tripReference was requested:
            // e.g., /dashboard/activeTrips/{tripReference}
            $targetRef = $_GET['tripReference'] ?? $_GET['reference'] ?? null;
            if (!$targetRef && isset($_GET['id']) && !is_numeric($_GET['id']) && strlen($_GET['id']) > 10) {
                $targetRef = $_GET['id'];
            }
            if (!$targetRef && isset($_SERVER['REQUEST_URI'])) {
                if (preg_match('#/dashboard/activeTrips/([a-zA-Z0-9\-]+)#i', $_SERVER['REQUEST_URI'], $m)) {
                    $targetRef = $m[1];
                }
            }

            if (!empty($targetRef)) {
                // Return single trip detail
                $sqlSingle = "
                    SELECT 
                        t.idTrip,
                        t.tripReference,
                        t.status,
                        t.price,
                        DATE_FORMAT(t.date, '%Y-%m-%d %H:%i:%s') AS date,
                        t.userId,
                        COALESCE(u.name, '') AS customerName,
                        COALESCE(u.phone, '') AS customerPhone,
                        u.profilePhoto AS customerPhoto,
                        t.driverId,
                        d.userId AS driverUserId,
                        COALESCE(du.name, '') AS driverName,
                        COALESCE(du.phone, '') AS driverPhone,
                        du.profilePhoto AS driverPhoto,
                        c.plate AS carPlate,
                        t.tripTypeId,
                        tt.type AS tripType,
                        t.tripPaymentFormId,
                        tPF.name AS paymentForm,
                        t.originId,
                        o.address AS originAddress,
                        o.latitude AS originLatitude,
                        o.longitude AS originLongitude,
                        t.destinationId,
                        dest.address AS destinationAddress,
                        dest.latitude AS destinationLatitude,
                        dest.longitude AS destinationLongitude,
                        ts.schedule,
                        t.callingDriver
                    FROM trip t
                    LEFT JOIN user u ON t.userId = u.idUser
                    LEFT JOIN driver d ON t.driverId = d.idDriver
                    LEFT JOIN user du ON d.userId = du.idUser
                    LEFT JOIN car c ON d.idDriver = c.driverId AND c.deleted_at IS NULL
                    LEFT JOIN tripType tt ON t.tripTypeId = tt.idTripType
                    LEFT JOIN tripPaymentForm tPF ON t.tripPaymentFormId = tPF.idTripPaymentForm
                    LEFT JOIN origin o ON t.originId = o.idOrigin
                    LEFT JOIN destination dest ON t.destinationId = dest.idDestination
                    LEFT JOIN tripScheduled ts ON t.tripReference = ts.tripReference
                    WHERE t.tripReference = :ref
                    LIMIT 1
                ";
                $stmt = $pdo->prepare($sqlSingle);
                $stmt->execute([':ref' => $targetRef]);
                $r = $stmt->fetch(PDO::FETCH_ASSOC);
                if (!$r) {
                    http_response_code(404);
                    echo json_encode(['status' => false, 'message' => 'Viagem não encontrada', 'response' => null]);
                    return;
                }

                $detail = [
                    'idTrip' => (int)$r['idTrip'],
                    'tripReference' => $r['tripReference'],
                    'status' => $r['status'],
                    'price' => $r['price'] !== null ? (float)$r['price'] : null,
                    'date' => $r['date'],
                    'userId' => (int)$r['userId'],
                    'customerName' => $r['customerName'],
                    'customerPhone' => $r['customerPhone'],
                    'customerPhoto' => $r['customerPhoto'],
                    'driverId' => $r['driverId'] ? (int)$r['driverId'] : null,
                    'driverUserId' => $r['driverUserId'] ? (int)$r['driverUserId'] : null,
                    'driverName' => $r['driverName'],
                    'driverPhone' => $r['driverPhone'],
                    'driverPhoto' => $r['driverPhoto'],
                    'carPlate' => $r['carPlate'],
                    'tripTypeId' => $r['tripTypeId'] ? (int)$r['tripTypeId'] : null,
                    'tripType' => $r['tripType'],
                    'paymentForm' => $r['paymentForm'],
                    'originAddress' => $r['originAddress'],
                    'originLatitude' => $r['originLatitude'],
                    'originLongitude' => $r['originLongitude'],
                    'destinationAddress' => $r['destinationAddress'],
                    'destinationLatitude' => $r['destinationLatitude'],
                    'destinationLongitude' => $r['destinationLongitude'],
                    'origin' => [
                        'address' => $r['originAddress'],
                        'latitude' => $r['originLatitude'],
                        'longitude' => $r['originLongitude'],
                    ],
                    'destination' => [
                        'name' => $r['destinationAddress'],
                        'address' => $r['destinationAddress'],
                        'latitude' => $r['destinationLatitude'],
                        'longitude' => $r['destinationLongitude'],
                    ],
                    'customer' => [
                        'idCustomer' => (int)$r['userId'],
                        'name' => $r['customerName'],
                        'phone' => $r['customerPhone'],
                        'profileImage' => $r['customerPhoto'],
                    ],
                    'driver' => $r['driverId'] ? [
                        'driverId' => (int)$r['driverId'],
                        'name' => $r['driverName'],
                        'phone' => $r['driverPhone'],
                        'profileImage' => $r['driverPhoto'],
                    ] : null,
                    'schedule' => $r['schedule'] ? ['schedule' => $r['schedule']] : null,
                    'callingDriver' => $r['callingDriver'] ? explode(',', $r['callingDriver']) : [],
                ];

                echo $this->returnSuccess('Detalhes da viagem', $detail);
                return;
            }

            // Otherwise: List of active trips with pagination & filters
            $page = max(1, (int)($_GET['page'] ?? 1));
            $perPage = max(1, (int)($_GET['perPage'] ?? 20));
            $offset = ($page - 1) * $perPage;

            $where = ["t.status NOT IN ('finished', 'canceled')"];
            $params = [];

            if ($cityId) {
                $where[] = "t.cityId = :cityId";
                $params[':cityId'] = $cityId;
            }

            $filterStatus = $_GET['status'] ?? null;
            $excludeScheduled = !empty($_GET['excludeScheduled']) && $_GET['excludeScheduled'] !== 'false';

            if ($filterStatus === 'scheduled') {
                $where[] = "(t.status = 'scheduled' OR ts.tripReference IS NOT NULL)";
            } elseif ($excludeScheduled) {
                $where[] = "t.status != 'scheduled' AND ts.tripReference IS NULL";
                $where[] = "t.status IN ('searching', 'searching_favorite', 'pre_accepted', 'accepted', 'boarding', 'in_progress', 'waiting', 'get_bid_by_drivers')";
            } else {
                $where[] = "t.status IN ('searching', 'searching_favorite', 'pre_accepted', 'accepted', 'boarding', 'in_progress', 'waiting', 'scheduled', 'get_bid_by_drivers')";
            }

            if (!empty($_GET['customerName'])) {
                $where[] = "u.name LIKE :customerName";
                $params[':customerName'] = '%' . trim($_GET['customerName']) . '%';
            }

            if (!empty($_GET['driverName'])) {
                $where[] = "du.name LIKE :driverName";
                $params[':driverName'] = '%' . trim($_GET['driverName']) . '%';
            }

            $whereStr = implode(' AND ', $where);

            // Count scheduled total
            $scheduledWhere = ["t.status NOT IN ('finished', 'canceled')", "(t.status = 'scheduled' OR ts.tripReference IS NOT NULL)"];
            $schedParams = [];
            if ($cityId) {
                $scheduledWhere[] = "t.cityId = :cityId";
                $schedParams[':cityId'] = $cityId;
            }
            $stmtSched = $pdo->prepare("SELECT COUNT(DISTINCT t.idTrip) FROM trip t LEFT JOIN tripScheduled ts ON t.tripReference = ts.tripReference WHERE " . implode(' AND ', $scheduledWhere));
            $stmtSched->execute($schedParams);
            $scheduledTotal = (int)$stmtSched->fetchColumn();

            // Total count for current filter
            $stmtCount = $pdo->prepare("
                SELECT COUNT(DISTINCT t.idTrip) 
                FROM trip t 
                LEFT JOIN user u ON t.userId = u.idUser 
                LEFT JOIN driver d ON t.driverId = d.idDriver 
                LEFT JOIN user du ON d.userId = du.idUser 
                LEFT JOIN tripScheduled ts ON t.tripReference = ts.tripReference 
                WHERE {$whereStr}
            ");
            $stmtCount->execute($params);
            $total = (int)$stmtCount->fetchColumn();

            // Main Query
            $sql = "
                SELECT 
                    t.idTrip,
                    t.tripReference,
                    t.status,
                    t.price,
                    DATE_FORMAT(t.date, '%Y-%m-%d %H:%i:%s') AS date,
                    t.userId,
                    COALESCE(u.name, '') AS customerName,
                    COALESCE(u.phone, '') AS customerPhone,
                    u.profilePhoto AS customerPhoto,
                    t.driverId,
                    d.userId AS driverUserId,
                    COALESCE(du.name, '') AS driverName,
                    COALESCE(du.phone, '') AS driverPhone,
                    du.profilePhoto AS driverPhoto,
                    c.plate AS carPlate,
                    t.tripTypeId,
                    tt.type AS tripType,
                    t.tripPaymentFormId,
                    tPF.name AS paymentForm,
                    t.originId,
                    o.address AS originAddress,
                    o.latitude AS originLatitude,
                    o.longitude AS originLongitude,
                    t.destinationId,
                    dest.address AS destinationAddress,
                    dest.latitude AS destinationLatitude,
                    dest.longitude AS destinationLongitude,
                    ts.schedule,
                    t.callingDriver
                FROM trip t
                LEFT JOIN user u ON t.userId = u.idUser
                LEFT JOIN driver d ON t.driverId = d.idDriver
                LEFT JOIN user du ON d.userId = du.idUser
                LEFT JOIN car c ON d.idDriver = c.driverId AND c.deleted_at IS NULL
                LEFT JOIN tripType tt ON t.tripTypeId = tt.idTripType
                LEFT JOIN tripPaymentForm tPF ON t.tripPaymentFormId = tPF.idTripPaymentForm
                LEFT JOIN origin o ON t.originId = o.idOrigin
                LEFT JOIN destination dest ON t.destinationId = dest.idDestination
                LEFT JOIN tripScheduled ts ON t.tripReference = ts.tripReference
                WHERE {$whereStr}
                ORDER BY t.idTrip DESC
                LIMIT :limit OFFSET :offset
            ";
            $stmt = $pdo->prepare($sql);
            foreach ($params as $k => $v) {
                $stmt->bindValue($k, $v);
            }
            $stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $mapped = [];
            foreach ($rows as $r) {
                $mapped[] = [
                    'idTrip' => (int)$r['idTrip'],
                    'tripReference' => $r['tripReference'],
                    'status' => $r['status'],
                    'price' => $r['price'] !== null ? (float)$r['price'] : null,
                    'date' => $r['date'],
                    'userId' => (int)$r['userId'],
                    'customerName' => $r['customerName'],
                    'customerPhone' => $r['customerPhone'],
                    'customerPhoto' => $r['customerPhoto'],
                    'driverId' => $r['driverId'] ? (int)$r['driverId'] : null,
                    'driverUserId' => $r['driverUserId'] ? (int)$r['driverUserId'] : null,
                    'driverName' => $r['driverName'],
                    'driverPhone' => $r['driverPhone'],
                    'driverPhoto' => $r['driverPhoto'],
                    'carPlate' => $r['carPlate'],
                    'tripTypeId' => $r['tripTypeId'] ? (int)$r['tripTypeId'] : null,
                    'tripType' => $r['tripType'],
                    'paymentForm' => $r['paymentForm'],
                    'originAddress' => $r['originAddress'],
                    'originLatitude' => $r['originLatitude'],
                    'originLongitude' => $r['originLongitude'],
                    'destinationAddress' => $r['destinationAddress'],
                    'destinationLatitude' => $r['destinationLatitude'],
                    'destinationLongitude' => $r['destinationLongitude'],
                    'origin' => [
                        'address' => $r['originAddress'],
                        'latitude' => $r['originLatitude'],
                        'longitude' => $r['originLongitude'],
                    ],
                    'destination' => [
                        'name' => $r['destinationAddress'],
                        'address' => $r['destinationAddress'],
                        'latitude' => $r['destinationLatitude'],
                        'longitude' => $r['destinationLongitude'],
                    ],
                    'customer' => [
                        'idCustomer' => (int)$r['userId'],
                        'name' => $r['customerName'],
                        'phone' => $r['customerPhone'],
                        'profileImage' => $r['customerPhoto'],
                    ],
                    'driver' => $r['driverId'] ? [
                        'driverId' => (int)$r['driverId'],
                        'name' => $r['driverName'],
                        'phone' => $r['driverPhone'],
                        'profileImage' => $r['driverPhoto'],
                    ] : null,
                    'schedule' => $r['schedule'] ? ['schedule' => $r['schedule']] : null,
                    'callingDriver' => $r['callingDriver'] ? explode(',', $r['callingDriver']) : [],
                ];
            }

            $lastPage = max(1, (int)ceil($total / $perPage));
            $payload = [
                'current_page' => $page,
                'data' => $mapped,
                'total' => $total,
                'last_page' => $lastPage,
                'next_page_url' => ($page < $lastPage) ? "/dashboard/activeTrips?page=" . ($page + 1) : null,
                'prev_page_url' => ($page > 1) ? "/dashboard/activeTrips?page=" . ($page - 1) : null,
                'scheduledTotal' => $scheduledTotal,
            ];

            echo $this->returnSuccess('Viagens ativas', $payload);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionActiveCustomersAllTime()
    {
        echo $this->returnSuccess('Clientes ativos geral', []);
    }

    public function actionActiveCustomersLast10Minutes()
    {
        echo $this->returnSuccess('Clientes ativos últimos 10 minutos', []);
    }

    public function actionLastDynamicsPlaces()
    {
        echo $this->returnSuccess('Últimos locais dinâmicos', []);
    }

    public function actionExpensiveDynamicsPlaces()
    {
        echo $this->returnSuccess('Locais dinâmicos mais caros', []);
    }

    public function actionPlacesMoreTripsDayAgo()
    {
        echo $this->returnSuccess('Locais com mais viagens ontem', []);
    }

    public function actionPlacesMoreTripsWeekAgo()
    {
        echo $this->returnSuccess('Locais com mais viagens semana passada', []);
    }

    // -------------------------------------------------------------
    // Helper Queries
    // -------------------------------------------------------------

    private function queryRankingDriver(PDO $pdo, ?int $cityId, int $limit, int $offset, ?string $dateStart = null, ?string $dateEnd = null): array
    {
        $where = ["trip.status = 'finished'"];
        $params = [];

        if ($cityId) {
            $where[] = "trip.cityId = :cityId";
            $params[':cityId'] = $cityId;
        }
        if ($dateStart) {
            $where[] = "trip.date >= :dateStart";
            $params[':dateStart'] = $dateStart . " 00:00:00";
        }
        if ($dateEnd) {
            $where[] = "trip.date <= :dateEnd";
            $params[':dateEnd'] = $dateEnd . " 23:59:59";
        }

        $whereClause = implode(" AND ", $where);
        $sql = "
            SELECT driver.idDriver,
                   user.name,
                   coalesce(user.phone, '') as phone,
                   count(trip.idTrip) as quantityTrips,
                   round(sum(coalesce(trip.price, 0)), 2) as totalValue
            FROM trip
            JOIN driver ON trip.driverId = driver.idDriver
            JOIN user ON driver.userId = user.idUser
            WHERE {$whereClause}
            GROUP BY driver.idDriver, user.name, user.phone
            ORDER BY quantityTrips DESC
            LIMIT {$limit} OFFSET {$offset}
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map(function ($row) {
            return [
                'idDriver' => (int)$row['idDriver'],
                'name' => (string)$row['name'],
                'phone' => (string)$row['phone'],
                'quantityTrips' => (int)$row['quantityTrips'],
                'totalValue' => (float)$row['totalValue']
            ];
        }, $results);
    }

    private function queryRankingCustomer(PDO $pdo, ?int $cityId, int $limit, int $offset, ?string $dateStart = null, ?string $dateEnd = null): array
    {
        $where = ["trip.status = 'finished'"];
        $params = [];

        if ($cityId) {
            $where[] = "trip.cityId = :cityId";
            $params[':cityId'] = $cityId;
        }
        if ($dateStart) {
            $where[] = "trip.date >= :dateStart";
            $params[':dateStart'] = $dateStart . " 00:00:00";
        }
        if ($dateEnd) {
            $where[] = "trip.date <= :dateEnd";
            $params[':dateEnd'] = $dateEnd . " 23:59:59";
        }

        $whereClause = implode(" AND ", $where);
        $sql = "
            SELECT user.idUser,
                   user.name,
                   coalesce(user.phone, '') as phone,
                   count(trip.idTrip) as quantityTrips,
                   round(sum(coalesce(trip.price, 0)), 2) as totalValue
            FROM trip
            JOIN user ON trip.userId = user.idUser
            WHERE {$whereClause}
            GROUP BY user.idUser, user.name, user.phone
            ORDER BY quantityTrips DESC
            LIMIT {$limit} OFFSET {$offset}
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map(function ($row) {
            return [
                'idUser' => (int)$row['idUser'],
                'name' => (string)$row['name'],
                'phone' => (string)$row['phone'],
                'quantityTrips' => (int)$row['quantityTrips'],
                'totalValue' => (float)$row['totalValue']
            ];
        }, $results);
    }

    private function queryStatisticsByCity(PDO $pdo, ?int $cityId): array
    {
        $where = [];
        $params = [];

        if ($cityId) {
            $where[] = "cityId = :cityId";
            $params[':cityId'] = $cityId;
        }

        $whereClause = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

        $sql = "
            SELECT
                count(idTrip) as totalTrips,
                sum(if(status IN ('accepted', 'boarding', 'finished', 'in_progress', 'waiting') OR (status = 'canceled' AND driverId IS NOT NULL), 1, 0)) as tripAccepted,
                sum(if(status = 'finished', 1, 0)) as tripFinished,
                sum(if(status = 'canceled', 1, 0)) as totalCanceled,
                sum(if(status = 'canceled' AND canceledBy = 'driver', 1, 0)) as canceledbyDriver,
                sum(if(status = 'canceled' AND canceledBy = 'customer', 1, 0)) as canceledbyCustomer,
                sum(if(DATE(date) = CURDATE() AND status = 'finished', 1, 0)) as todayTotalTrips,
                sum(if(DATE(date) = CURDATE() AND status = 'finished', coalesce(price, 0), 0)) as todayTotalMoney,
                sum(if(tripPaymentFormId = 1, 1, 0)) as paidOutVoucher,
                sum(if(tripPaymentFormId = 2, 1, 0)) as paidOutMoney,
                sum(if(tripPaymentFormId IN (3, 4, 8), 1, 0)) as paidOutCreditCard
            FROM trip
            {$whereClause}
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        $todayTotalTrips = (int)($row['todayTotalTrips'] ?? 0);
        $todayTotalMoney = (float)($row['todayTotalMoney'] ?? 0);
        $ticketMedia = $todayTotalTrips > 0 ? round($todayTotalMoney / $todayTotalTrips, 2) : 0;

        return [
            'canceledbyDriver' => (int)($row['canceledbyDriver'] ?? 0),
            'canceledbyCustomer' => (int)($row['canceledbyCustomer'] ?? 0),
            'totalCanceled' => (int)($row['totalCanceled'] ?? 0),
            'totalTrips' => (int)($row['totalTrips'] ?? 0),
            'tripAccepted' => (int)($row['tripAccepted'] ?? 0),
            'tripFinished' => (int)($row['tripFinished'] ?? 0),
            'todayTotalTrips' => $todayTotalTrips,
            'ticketMedia' => $ticketMedia,
            'paidOutVoucher' => (int)($row['paidOutVoucher'] ?? 0),
            'paidOutMoney' => (int)($row['paidOutMoney'] ?? 0),
            'paidOutCreditCard' => (int)($row['paidOutCreditCard'] ?? 0),
            'paymentForm' => [
                ['name' => 'Dinheiro', 'count' => (int)($row['paidOutMoney'] ?? 0)],
                ['name' => 'Voucher', 'count' => (int)($row['paidOutVoucher'] ?? 0)],
                ['name' => 'Cartão', 'count' => (int)($row['paidOutCreditCard'] ?? 0)]
            ]
        ];
    }

    private function queryCurrentQuantities(PDO $pdo, ?int $cityId): array
    {
        $cityWhereDriver = $cityId ? "AND driver.cityId = {$cityId}" : "";
        $cityWhereCustomer = $cityId ? "AND user.cityId = {$cityId}" : "";

        // Drivers by userType
        $sqlDrivers = "
            SELECT
                coalesce(userType.name, 'Geral') as type,
                userType.picture,
                count(driver.idDriver) as total,
                count(if(driver.driverRegisterStatusId = 1, 1, null)) as active,
                count(if(driver.driverRegisterStatusId = 2, 1, null)) as pending,
                count(if(driver.driverRegisterStatusId = 3, 1, null)) as blocked,
                count(if(driver.driverRegisterStatusId = 4, 1, null)) as waiting_answer,
                count(if(driver.driverRegisterStatusId = 5, 1, null)) as blacklist
            FROM driver
            JOIN user ON driver.userId = user.idUser
            LEFT JOIN levelAccess ON user.idUser = levelAccess.userId
            LEFT JOIN userType ON levelAccess.userTypeId = userType.idUserType
            WHERE user.statusId = 1 {$cityWhereDriver}
            GROUP BY userType.idUserType, userType.name, userType.picture
        ";

        $stmtDrivers = $pdo->query($sqlDrivers);
        $drivers = $stmtDrivers ? $stmtDrivers->fetchAll(PDO::FETCH_ASSOC) : [];

        if (empty($drivers)) {
            $drivers = [
                [
                    'type' => 'Carro Comum',
                    'picture' => null,
                    'total' => 0,
                    'active' => 0,
                    'pending' => 0,
                    'blocked' => 0,
                    'waiting_answer' => 0,
                    'blacklist' => 0
                ]
            ];
        } else {
            $drivers = array_map(function ($d) {
                return [
                    'type' => (string)$d['type'],
                    'picture' => $d['picture'] ?? null,
                    'total' => (int)$d['total'],
                    'active' => (int)$d['active'],
                    'pending' => (int)$d['pending'],
                    'blocked' => (int)$d['blocked'],
                    'waiting_answer' => (int)$d['waiting_answer'],
                    'blacklist' => (int)$d['blacklist']
                ];
            }, $drivers);
        }

        // Customers
        $sqlCustomers = "
            SELECT
                'Passageiro' as type,
                count(customer.idCustomer) as total,
                count(if(customer.customerRegisterStatusId = 1, 1, null)) as active,
                count(if(customer.customerRegisterStatusId = 2, 1, null)) as pending,
                count(if(customer.customerRegisterStatusId = 3, 1, null)) as blocked
            FROM customer
            JOIN user ON customer.userId = user.idUser
            WHERE user.statusId = 1 {$cityWhereCustomer}
        ";
        $stmtCust = $pdo->query($sqlCustomers);
        $custRow = $stmtCust ? $stmtCust->fetch(PDO::FETCH_ASSOC) : null;

        $customers = [
            [
                'type' => 'Passageiro',
                'total' => (int)($custRow['total'] ?? 0),
                'active' => (int)($custRow['active'] ?? 0),
                'pending' => (int)($custRow['pending'] ?? 0),
                'blocked' => (int)($custRow['blocked'] ?? 0)
            ]
        ];

        return [
            'drivers' => $drivers,
            'customers' => $customers,
            'customers_polygon' => $customers
        ];
    }

    private function queryTotalBilled(PDO $pdo, ?int $cityId): string
    {
        $cityWhere = $cityId ? "AND cityId = {$cityId}" : "";
        $sql = "
            SELECT coalesce(sum(price), 0) as total
            FROM trip
            WHERE status = 'finished'
              AND DATE(date) = CURDATE()
              {$cityWhere}
        ";
        $stmt = $pdo->query($sql);
        $val = $stmt ? (float)$stmt->fetchColumn() : 0.0;
        return number_format($val, 2, '.', '');
    }
}
