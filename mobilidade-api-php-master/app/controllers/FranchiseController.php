<?php

namespace app\controllers;

use app\utils\Connection;
use Exception;
use PDO;

class FranchiseController extends ApiController
{
    /**
     * GET /franchise or GET /franchise/getAll
     */
    public function actionIndex()
    {
        $this->actionGetAll();
    }

    public function actionGetAll()
    {
        try {
            $pdo = Connection::open();
            $stmt = $pdo->query("SELECT id, name, statusId, logo, created_at FROM franchise WHERE statusId = 1 ORDER BY name ASC");
            $franchises = $stmt ? $stmt->fetchAll(PDO::FETCH_ASSOC) : [];

            // If empty, fall back to centrais so that franchisees/centrais are always available
            if (empty($franchises)) {
                $stmtCentral = $pdo->query("SELECT id, name, status as statusId, created_at FROM central WHERE status = 1 ORDER BY name ASC");
                $franchises = $stmtCentral ? $stmtCentral->fetchAll(PDO::FETCH_ASSOC) : [];
            }

            echo $this->returnSuccess('Lista de franquias', $franchises);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
