<?php

namespace app\controllers;

use app\utils\Connection;
use Exception;
use PDO;

class BlockReasonsController extends ApiController
{
    /**
     * POST /blockreasons/driver/{idDriver}
     */
    public function actionDriver()
    {
        try {
            $pdo = Connection::open(Connection::DB_MYSQL_RW);

            $rawInput = file_get_contents('php://input');
            $data = json_decode($rawInput, true);
            if (!is_array($data)) {
                $data = $_POST;
            }

            $driverId = isset($_GET['id']) && is_numeric($_GET['id']) ? (int)$_GET['id'] : (int)($data['driverId'] ?? 0);
            if ($driverId <= 0) {
                throw new Exception("ID do motorista não informado");
            }

            $typeIds = $data['blockReasonsTypeIds'] ?? [2];
            if (!is_array($typeIds)) {
                $typeIds = [$typeIds];
            }

            // 1. Inserir motivos de bloqueio
            $stmtInsert = $pdo->prepare("
                INSERT INTO blockReasons (driverId, blockReasonsTypeId, statusId, date)
                VALUES (:driverId, :typeId, 1, NOW())
            ");
            foreach ($typeIds as $typeId) {
                $stmtInsert->execute([
                    ':driverId' => $driverId,
                    ':typeId' => (int)$typeId
                ]);
            }

            // 2. Atualizar status do motorista para BLOQUEADO (3)
            $stmtDriver = $pdo->prepare("UPDATE driver SET driverRegisterStatusId = 3 WHERE idDriver = :driverId");
            $stmtDriver->execute([':driverId' => $driverId]);

            // 3. Atualizar usuário blocked = 1
            $stmtUser = $pdo->prepare("UPDATE user JOIN driver ON user.idUser = driver.userId SET user.blocked = 1 WHERE driver.idDriver = :driverId");
            $stmtUser->execute([':driverId' => $driverId]);

            echo $this->returnSuccess('Motorista bloqueado com sucesso', [
                'driverId' => $driverId,
                'status' => 'BLOQUEADO'
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    /**
     * Fallback para outras rotas em /blockreasons
     */
    public function actionIndex()
    {
        try {
            $pdo = Connection::open();
            $stmt = $pdo->query("SELECT idBlockReasonsType as id, name FROM blockReasonsType ORDER BY idBlockReasonsType ASC");
            $types = $stmt ? $stmt->fetchAll(PDO::FETCH_ASSOC) : [];
            echo $this->returnSuccess('Tipos de motivos de bloqueio', $types);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
