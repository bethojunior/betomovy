<?php

namespace app\controllers;

use app\utils\Connection;
use PDO;

class TripTypeDriverController extends ApiController
{
    public function actionIndex()
    {
        $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

        if ($method === 'POST') {
            return $this->actionStore();
        }

        if ($method === 'DELETE') {
            return $this->actionDelete();
        }

        return $this->actionList();
    }

    public function actionList()
    {
        header('Content-Type: application/json; charset=utf-8');
        try {
            $pdo = Connection::open(Connection::DB_MYSQL_RO);

            // Fetch all active trip types
            $stmtTrip = $pdo->query("
                SELECT 
                    idTripType,
                    type,
                    description,
                    deliveryOption,
                    onlyCentral,
                    picture,
                    statusId
                FROM tripType
                WHERE statusId = 1
                ORDER BY idTripType ASC
            ");
            $tripTypes = $stmtTrip->fetchAll(PDO::FETCH_ASSOC);

            // Fetch all tripTypeDriver links with userType info
            $stmtLinks = $pdo->query("
                SELECT 
                    ttd.id,
                    ttd.tripTypeId,
                    ttd.userTypeId,
                    ut.name AS userTypeName,
                    ut.description AS userTypeDescription,
                    ut.isActive,
                    ut.isDriver,
                    ut.picture AS userTypePicture
                FROM tripTypeDriver ttd
                INNER JOIN userType ut ON ttd.userTypeId = ut.idUserType
            ");
            $links = $stmtLinks->fetchAll(PDO::FETCH_ASSOC);

            $linksByTripType = [];
            foreach ($links as $link) {
                $linksByTripType[$link['tripTypeId']][] = [
                    'id' => (int)$link['id'],
                    'tripTypeId' => (int)$link['tripTypeId'],
                    'userTypeId' => (int)$link['userTypeId'],
                    'user_type' => [
                        'idUserType' => (int)$link['userTypeId'],
                        'name' => $link['userTypeName'],
                        'description' => $link['userTypeDescription'] ?? '',
                        'isActive' => (bool)$link['isActive'],
                        'isDriver' => (bool)$link['isDriver'],
                        'picture' => $link['userTypePicture'] ?? ''
                    ]
                ];
            }

            foreach ($tripTypes as &$tt) {
                $tt['idTripType'] = (int)$tt['idTripType'];
                $tt['trip_type_drivers'] = $linksByTripType[$tt['idTripType']] ?? [];
            }

            echo json_encode([
                'status' => true,
                'message' => 'Tipos de chamados e motoristas vinculados',
                'response' => $tripTypes,
                'data' => $tripTypes,
                'errors' => null
            ]);
        } catch (\Throwable $e) {
            echo json_encode([
                'status' => false,
                'message' => $e->getMessage(),
                'response' => [],
                'data' => [],
                'errors' => null
            ]);
        }
    }

    public function actionStore()
    {
        header('Content-Type: application/json; charset=utf-8');
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            $items = $input['tripTypeDriver'] ?? ($input ?? []);

            if (!empty($items)) {
                $pdo = Connection::open(Connection::DB_MYSQL_RW);
                $stmtCheck = $pdo->prepare("SELECT id FROM tripTypeDriver WHERE tripTypeId = :ttId AND userTypeId = :utId LIMIT 1");
                $stmtInsert = $pdo->prepare("INSERT INTO tripTypeDriver (tripTypeId, userTypeId) VALUES (:ttId, :utId)");

                foreach ($items as $item) {
                    $ttId = (int)($item['tripTypeId'] ?? 0);
                    $utId = (int)($item['userTypeId'] ?? 0);
                    if ($ttId > 0 && $utId > 0) {
                        $stmtCheck->execute([':ttId' => $ttId, ':utId' => $utId]);
                        if (!$stmtCheck->fetchColumn()) {
                            $stmtInsert->execute([':ttId' => $ttId, ':utId' => $utId]);
                        }
                    }
                }
            }

            echo json_encode([
                'status' => true,
                'message' => 'Vínculo realizado com sucesso',
                'response' => true,
                'errors' => null
            ]);
        } catch (\Throwable $e) {
            echo json_encode([
                'status' => false,
                'message' => $e->getMessage(),
                'response' => false,
                'errors' => null
            ]);
        }
    }

    public function actionDelete()
    {
        header('Content-Type: application/json; charset=utf-8');
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            $items = $input['tripTypeDriver'] ?? ($input['data']['tripTypeDriver'] ?? []);

            if (!empty($items)) {
                $pdo = Connection::open(Connection::DB_MYSQL_RW);
                $stmtDel = $pdo->prepare("DELETE FROM tripTypeDriver WHERE tripTypeId = :ttId AND userTypeId = :utId");

                foreach ($items as $item) {
                    $ttId = (int)($item['tripTypeId'] ?? 0);
                    $utId = (int)($item['userTypeId'] ?? 0);
                    if ($ttId > 0 && $utId > 0) {
                        $stmtDel->execute([':ttId' => $ttId, ':utId' => $utId]);
                    }
                }
            }

            echo json_encode([
                'status' => true,
                'message' => 'Vínculo removido com sucesso',
                'response' => true,
                'errors' => null
            ]);
        } catch (\Throwable $e) {
            echo json_encode([
                'status' => false,
                'message' => $e->getMessage(),
                'response' => false,
                'errors' => null
            ]);
        }
    }
}
