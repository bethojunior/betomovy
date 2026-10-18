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
            $cityId = $this->getCityId();
            $pdo = $this->getPdo();
            $cityWhere = $cityId ? "AND t.cityId = {$cityId}" : "";

            $sql = "
                SELECT t.idTrip, t.tripReference, t.status, t.price, t.date,
                       u.name as customerName, u.phone as customerPhone,
                       du.name as driverName, du.phone as driverPhone,
                       c.plate as carPlate
                FROM trip t
                LEFT JOIN user u ON t.userId = u.idUser
                LEFT JOIN driver d ON t.driverId = d.idDriver
                LEFT JOIN user du ON d.userId = du.idUser
                LEFT JOIN car c ON d.idDriver = c.driverId AND c.deleted_at IS NULL
                WHERE t.status IN ('searching', 'pre_accepted', 'accepted', 'in_progress', 'waiting')
                {$cityWhere}
                ORDER BY t.idTrip DESC
                LIMIT 50
            ";
            $stmt = $pdo->query($sql);
            $trips = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo $this->returnSuccess('Viagens ativas', $trips);
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
                sum(if(status IN ('accepted', 'finished', 'in_progress', 'waiting') OR (status = 'canceled' AND driverId IS NOT NULL), 1, 0)) as tripAccepted,
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
