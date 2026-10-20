<?php

namespace app\controllers;
use app\dao\TripDao;
use app\services\RecalculatedPriceService;
use app\services\ReportTripService;
use app\services\TripPriceService;
use app\services\TripService;
use Exception;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 23/07/2018
 * Time: 17:27
 */
class TripController extends ApiController
{
    protected $tripDao;

    public function __construct()
    {
        $this->tripDao = new TripDao;
    }

    public function actionNew()
    {
        try {
            echo $this->returnSuccess("Nova viagem cadastrada", $this->tripDao->new($this->request()));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionIncreaseArea()
    {
        $request = $this->request();
        try {
            echo $this->returnSuccess("Informações da viagem", $this->tripDao->increaseArea($request->tripReference, $request->zoneId));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionCancel()
    {
        try {
            $request = $this->request();
            echo $this->returnSuccess("Viagem cancelada", $this->tripDao->cancel($request->tripReference, $request->dateEnd, $request->userId));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGet()
    {
        try {
            echo $this->returnSuccess("Exibindo viagem", $this->tripDao
                ->findFully($this->request()->tripReference, true));
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetById()
    {
        try {
            echo $this->returnSuccess("Viagem encontrada",
                $this->tripDao->findById($this->request()->idTrip)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetWithTimeline()
    {
        try {
            echo $this->returnSuccess("Viagem encontrada",
                $this->tripDao->findWithTimeline($this->request()->tripReference)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionShare()
    {
        try {
            echo $this->returnSuccess("Viagem encontrada",
                $this->tripDao->find($this->request(false)->tripReference, false)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetShareLink()
    {
        try {
            echo $this->returnSuccess("Viagem encontrada",
                (new TripService)->getShareLink($this->requestQuery())
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionFinancialDetail()
    {
        try {
            echo $this->returnSuccess("Detalhes financeiros da viagem",
                $this->tripDao->tripFinancialDetail($this->request(false)->tripReference)
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao detalhar financeiro da viagem");
        }
    }

    public function actionReport()
    {
        try {
            $tripReport = (new ReportTripService)
                ->insert($this->request(false));

            echo $this->returnSuccess("Report inserido com sucesso",
                $tripReport->toStdClass()
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionUpdateRouteTracing()
    {
        try {
            echo $this->returnSuccess("Rota atualizada com sucesso",
                (new TripService)
                    ->updateRouteTracing($this->request(false))
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionFindTripPrice()
    {
        try {
            echo $this->returnSuccess("Preço encontrado",
                (new TripPriceService)->find($this->requestQuery())
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionRecalculatePrice()
    {
        try {
            echo $this->returnSuccess("Preço encontrado",
                (new RecalculatedPriceService)->create($this->request(false))
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionChangeRoute()
    {
        try {
            echo $this->returnSuccess("Mudança de rota na viagem",
                (new RecalculatedPriceService)->changeRoute($this->request(false))
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionPix()
    {
        try {
            echo $this->returnSuccess("Sucesso ao gerar pix.",
                (new TripService)->generatePix($this->request(false))
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
    
    public function actionPayWithPixAtEnd()
    {
        try {
            echo $this->returnSuccess("Gerando pagamento com Pix",
                (new TripService)->payWithPixAtEnd($this->request(false))
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        } 
    }

    public function actionPixStatus()
    {
        try {
            echo $this->returnSuccess("Status do pagamento com Pix",
                (new TripService)->pixStatus()
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionStatus()
    {
        try {
            $tripReference = $this->requestQuery()->tripReference;
            $trip = (new TripService)->getStatusByTripReference($tripReference);
            echo $this->returnSuccess("Status da viagem", $trip);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionIndex()
    {
        if (isset($_SERVER['REQUEST_METHOD']) && strtoupper($_SERVER['REQUEST_METHOD']) === 'POST') {
            $this->actionNew();
            return;
        }

        $singleRef = $_GET['tripReference'] ?? ($_GET['reference'] ?? null);
        if (!$singleRef && isset($_GET['id']) && (!is_numeric($_GET['id']) || strlen((string)$_GET['id']) > 10)) {
            $singleRef = $_GET['id'];
        }

        if (!empty($singleRef)) {
            try {
                $trip = (new \app\dao\TripDao())->find($singleRef, false);
                echo $this->returnSuccess("Viagem encontrada", $trip);
                return;
            } catch (\Exception $e) {
                try {
                    $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RO);
                    $stmt = $pdo->prepare("SELECT * FROM trip WHERE tripReference = :ref LIMIT 1");
                    $stmt->execute([':ref' => $singleRef]);
                    $tripRow = $stmt->fetch(\PDO::FETCH_ASSOC);
                    if ($tripRow) {
                        echo $this->returnSuccess("Viagem encontrada", (object)$tripRow);
                        return;
                    }
                } catch (\Throwable $t) {}

                echo $this->returnError($e);
                return;
            }
        }

        try {
            $page = max(1, (int)($_GET['page'] ?? 1));
            $perPage = max(1, (int)($_GET['per_page'] ?? 10));
            $offset = ($page - 1) * $perPage;

            $dateParam = $_GET['date'] ?? null;
            $driverId = $_GET['driverId'] ?? null;
            $status = $_GET['status'] ?? null;
            $cityId = $_GET['cityId'] ?? ($_SERVER['HTTP_CITYID'] ?? null);

            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);

            $where = ["1=1"];
            $params = [];

            if (!empty($dateParam)) {
                $dates = explode(',', $dateParam);
                if (count($dates) >= 2) {
                    $where[] = "trip.date >= :startDate AND trip.date <= :endDate";
                    $params[':startDate'] = trim($dates[0]) . ' 00:00:00';
                    $params[':endDate'] = trim($dates[1]) . ' 23:59:59';
                }
            }

            if (!empty($driverId) && $driverId !== '0') {
                $where[] = "trip.driverId = :driverId";
                $params[':driverId'] = $driverId;
            }

            if (!empty($status)) {
                $where[] = "trip.status = :status";
                $params[':status'] = $status;
            }

            if (!empty($cityId)) {
                $where[] = "trip.cityId = :cityId";
                $params[':cityId'] = $cityId;
            }

            $whereSql = implode(" AND ", $where);

            // Ensure tables exist to prevent join failures
            try {
                $pdo->exec("CREATE TABLE IF NOT EXISTS tripAudit (id INT AUTO_INCREMENT PRIMARY KEY, situation VARCHAR(255) NULL, created_at DATETIME NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
            } catch (\Throwable $tEx) {}
            try {
                $pdo->exec("CREATE TABLE IF NOT EXISTS tripCallType (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
            } catch (\Throwable $tEx) {}
            try {
                $pdo->exec("CREATE TABLE IF NOT EXISTS tripPaymentForm (idTripPaymentForm INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
            } catch (\Throwable $tEx) {}
            try {
                $pdo->exec("CREATE TABLE IF NOT EXISTS tripWayPoints (id INT AUTO_INCREMENT PRIMARY KEY, tripReference VARCHAR(255) NULL, latitude VARCHAR(50) NULL, longitude VARCHAR(50) NULL, address VARCHAR(255) NULL, confirmed TINYINT(1) DEFAULT 0, created_at DATETIME NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
            } catch (\Throwable $tEx) {}

            // Total count
            $stmtCount = $pdo->prepare("SELECT COUNT(*) FROM trip WHERE {$whereSql}");
            $stmtCount->execute($params);
            $total = (int)$stmtCount->fetchColumn();

            // Trips list with joins (or fallback if joins fail)
            $data = [];
            try {
                $sql = "
                    SELECT 
                        trip.idTrip,
                        trip.tripReference,
                        trip.date,
                        trip.price,
                        trip.driverId,
                        trip.userId,
                        trip.customerId,
                        trip.tripCallTypeId,
                        '' AS flow,
                        trip.status,
                        trip.canceledBy,
                        COALESCE(tct.name, 'Normal') AS callType,
                        COALESCE(tpf.name, 'Dinheiro') AS paymentForm,
                        COALESCE(ta.situation, '') AS situation,
                        COALESCE(uc.name, '') AS customerName,
                        COALESCE(uc.phone, '') AS phone
                    FROM trip
                    LEFT JOIN tripAudit ta ON trip.tripAuditId = ta.id
                    LEFT JOIN tripCallType tct ON trip.tripCallTypeId = tct.id
                    LEFT JOIN tripPaymentForm tpf ON trip.tripPaymentFormId = tpf.idTripPaymentForm
                    LEFT JOIN `user` uc ON trip.userId = uc.idUser
                    WHERE {$whereSql}
                    ORDER BY trip.date DESC
                    LIMIT :limit OFFSET :offset
                ";

                $stmt = $pdo->prepare($sql);
                foreach ($params as $k => $v) {
                    $stmt->bindValue($k, $v);
                }
                $stmt->bindValue(':limit', $perPage, \PDO::PARAM_INT);
                $stmt->bindValue(':offset', $offset, \PDO::PARAM_INT);
                $stmt->execute();
                $data = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            } catch (\Throwable $qEx) {
                // Fallback query without joins if any joined table does not exist
                $sqlFallback = "
                    SELECT 
                        trip.idTrip,
                        trip.tripReference,
                        trip.date,
                        trip.price,
                        trip.driverId,
                        trip.userId,
                        trip.customerId,
                        trip.tripCallTypeId,
                        '' AS flow,
                        trip.status,
                        trip.canceledBy,
                        'Normal' AS callType,
                        'Dinheiro' AS paymentForm,
                        '' AS situation,
                        '' AS customerName,
                        '' AS phone
                    FROM trip
                    WHERE {$whereSql}
                    ORDER BY trip.date DESC
                    LIMIT :limit OFFSET :offset
                ";
                $stmt = $pdo->prepare($sqlFallback);
                foreach ($params as $k => $v) {
                    $stmt->bindValue($k, $v);
                }
                $stmt->bindValue(':limit', $perPage, \PDO::PARAM_INT);
                $stmt->bindValue(':offset', $offset, \PDO::PARAM_INT);
                $stmt->execute();
                $data = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            }

            // Fetch waypoints for each trip if tripWayPoints table exists
            if (!empty($data)) {
                $refs = array_column($data, 'tripReference');
                $placeholders = implode(',', array_fill(0, count($refs), '?'));
                try {
                    $stmtWay = $pdo->prepare("
                        SELECT tripReference, latitude, longitude, address, confirmed, created_at
                        FROM tripWayPoints
                        WHERE tripReference IN ({$placeholders})
                        ORDER BY id ASC
                    ");
                    $stmtWay->execute($refs);
                    $allWay = $stmtWay->fetchAll(\PDO::FETCH_ASSOC);
                    $wayGroup = [];
                    foreach ($allWay as $way) {
                        $wayGroup[$way['tripReference']][] = $way;
                    }
                    foreach ($data as &$t) {
                        $t['tripWayPoints'] = $wayGroup[$t['tripReference']] ?? [];
                    }
                } catch (\Throwable $wEx) {
                    foreach ($data as &$t) {
                        $t['tripWayPoints'] = [];
                    }
                }
            }

            $lastPage = $total > 0 ? (int)ceil($total / $perPage) : 1;

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Listagem de viagens encontradas',
                'data' => [
                    'trips' => [
                        'current_page' => $page,
                        'data' => $data,
                        'first_page_url' => null,
                        'from' => $total > 0 ? $offset + 1 : null,
                        'last_page' => $lastPage,
                        'last_page_url' => null,
                        'next_page_url' => $page < $lastPage ? true : null,
                        'path' => null,
                        'per_page' => $perPage,
                        'prev_page_url' => $page > 1 ? true : null,
                        'to' => min($offset + $perPage, $total),
                        'total' => $total
                    ]
                ],
                'response' => [
                    'trips' => [
                        'current_page' => $page,
                        'data' => $data,
                        'first_page_url' => null,
                        'from' => $total > 0 ? $offset + 1 : null,
                        'last_page' => $lastPage,
                        'last_page_url' => null,
                        'next_page_url' => $page < $lastPage ? true : null,
                        'path' => null,
                        'per_page' => $perPage,
                        'prev_page_url' => $page > 1 ? true : null,
                        'to' => min($offset + $perPage, $total),
                        'total' => $total
                    ]
                ],
                'errors' => null
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionFinancialMirror()
    {
        try {
            $startDate = $_GET['startDate'] ?? null;
            $endDate = $_GET['endDate'] ?? null;
            $driverId = $_GET['driverId'] ?? null;
            $cityId = $_GET['cityId'] ?? ($_SERVER['HTTP_CITYID'] ?? null);

            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);

            $where = ["1=1"];
            $params = [];

            if (!empty($startDate) && !empty($endDate)) {
                $where[] = "trip.date >= :startDate AND trip.date <= :endDate";
                $params[':startDate'] = trim($startDate) . ' 00:00:00';
                $params[':endDate'] = trim($endDate) . ' 23:59:59';
            }

            if (!empty($driverId) && $driverId !== '0') {
                $where[] = "trip.driverId = :driverId";
                $params[':driverId'] = $driverId;
            }

            if (!empty($cityId)) {
                $where[] = "trip.cityId = :cityId";
                $params[':cityId'] = $cityId;
            }

            $whereSql = implode(" AND ", $where);

            $sql = "
                SELECT 
                    COUNT(*) as totalTrips,
                    SUM(CASE WHEN trip.status = 'finished' THEN 1 ELSE 0 END) as finishedTrips,
                    SUM(CASE WHEN trip.status = 'finished' THEN COALESCE(trip.price, 0) ELSE 0 END) as totalPrice,
                    SUM(CASE WHEN trip.canceledBy = 'customer' THEN 1 ELSE 0 END) as canceledByCustomer,
                    SUM(CASE WHEN trip.canceledBy = 'driver' THEN 1 ELSE 0 END) as canceledByDriver,
                    SUM(CASE WHEN trip.status = 'payment_refused' THEN 1 ELSE 0 END) as cardRefused,
                    COUNT(DISTINCT trip.userId) as numUniqueCustomer,
                    COUNT(DISTINCT trip.driverId) as uniqueDriverIds
                FROM trip
                WHERE {$whereSql}
            ";

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $stats = $stmt->fetch(\PDO::FETCH_ASSOC) ?: [];

            $totalPrice = number_format((float)($stats['totalPrice'] ?? 0), 2, '.', '');

            $result = [
                'totalTrips' => (int)($stats['totalTrips'] ?? 0),
                'finishedTrips' => (int)($stats['finishedTrips'] ?? 0),
                'totalPrice' => $totalPrice,
                'canceledByCustomer' => (int)($stats['canceledByCustomer'] ?? 0),
                'canceledByDriver' => (int)($stats['canceledByDriver'] ?? 0),
                'cardRefused' => (int)($stats['cardRefused'] ?? 0),
                'numUniqueCustomer' => (int)($stats['numUniqueCustomer'] ?? 0),
                'uniqueDriverIds' => (int)($stats['uniqueDriverIds'] ?? 0),
                'firstTrip' => 0,
                'allTrips' => (int)($stats['totalTrips'] ?? 0),
                'totalTripsValue' => (float)$totalPrice,
                'driverValue' => 0.0,
                'companyValue' => 0.0,
                'discount' => 0.0,
                'voucher' => 0.0
            ];

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Espelho financeiro',
                'data' => $result,
                'response' => $result,
                'errors' => null
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionAnalysis()
    {
        try {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Viagens em análise',
                'data' => [],
                'response' => [],
                'errors' => null
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionActives()
    {
        try {
            echo $this->returnSuccess("Viagens ativas",
                (new TripService)->getActives($this->request())
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}