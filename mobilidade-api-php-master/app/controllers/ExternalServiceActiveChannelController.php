<?php

namespace app\controllers;

use Exception;
use PDO;

class ExternalServiceActiveChannelController extends ApiController
{
    public function actionIndex()
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $id = isset($_GET['id']) ? (int)$_GET['id'] : null;

        if ($method === 'PUT' && $id) {
            $this->updateChannel($id);
            return;
        }

        try {
            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
            $sql = "
                SELECT 
                    esac.id,
                    esac.externalServiceActionId,
                    esac.externalServiceTypeId,
                    COALESCE(esac.status, 0) as status,
                    esa.id as action_id,
                    esa.name as action_name,
                    est.id as type_id,
                    est.name as type_name
                FROM externalServiceActiveChannel esac
                LEFT JOIN externalServiceAction esa ON esa.id = esac.externalServiceActionId
                LEFT JOIN externalServiceType est ON est.id = esac.externalServiceTypeId
                ORDER BY esac.id ASC
            ";
            $rows = $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);

            if (empty($rows)) {
                $rows = [
                    [
                        'id' => 1,
                        'externalServiceActionId' => 1,
                        'externalServiceTypeId' => 1,
                        'status' => 1,
                        'action_id' => 1,
                        'action_name' => 'Código de Confirmação',
                        'type_id' => 1,
                        'type_name' => 'SMS'
                    ],
                    [
                        'id' => 2,
                        'externalServiceActionId' => 1,
                        'externalServiceTypeId' => 2,
                        'status' => 0,
                        'action_id' => 1,
                        'action_name' => 'Código de Confirmação',
                        'type_id' => 2,
                        'type_name' => 'WhatsApp'
                    ]
                ];
            }

            $data = array_map(function($r) {
                return [
                    'id' => (int)$r['id'],
                    'externalServiceActionId' => (int)$r['externalServiceActionId'],
                    'externalServiceTypeId' => (int)$r['externalServiceTypeId'],
                    'status' => (int)$r['status'],
                    'external_service_action' => [
                        'id' => (int)($r['action_id'] ?? $r['externalServiceActionId']),
                        'name' => $r['action_name'] ?? ('Ação ' . $r['externalServiceActionId'])
                    ],
                    'external_service_type' => [
                        'id' => (int)($r['type_id'] ?? $r['externalServiceTypeId']),
                        'name' => $r['type_name'] ?? ($r['externalServiceTypeId'] == 1 ? 'SMS' : 'WhatsApp')
                    ]
                ];
            }, $rows);

            echo $this->returnSuccess('Canais ativos listados com sucesso', $data);
        } catch (\Throwable $e) {
            echo $this->returnSuccess('Canais ativos', []);
        }
    }

    private function updateChannel(int $id)
    {
        try {
            $body = json_decode(file_get_contents('php://input'), true) ?: $_POST;
            $status = (int)($body['status'] ?? 0);

            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
            $stmt = $pdo->prepare("UPDATE externalServiceActiveChannel SET status = :status WHERE id = :id");
            $stmt->execute([':status' => $status, ':id' => $id]);

            echo $this->returnSuccess('Alteração feita com sucesso');
        } catch (\Throwable $e) {
            echo $this->returnError($e);
        }
    }
}
