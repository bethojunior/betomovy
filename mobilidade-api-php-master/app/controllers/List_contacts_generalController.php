<?php

namespace app\controllers;

use app\dao\GenericDao;
use Exception;

class List_contacts_generalController extends ApiController
{
    public function actionList()
    {
        try {
            $page = isset($_GET['page']) && (int)$_GET['page'] > 0 ? (int)$_GET['page'] : 1;
            $limit = 20;
            $offset = ($page - 1) * $limit;

            $phone = isset($_GET['phone']) ? trim($_GET['phone']) : null;
            $name = isset($_GET['nameContact']) ? trim($_GET['nameContact']) : null;

            $where = [];
            $params = [];

            if (!empty($phone)) {
                $where[] = "phone_person LIKE :phone";
                $params[':phone'] = "%{$phone}%";
            }
            if (!empty($name)) {
                $where[] = "name_person LIKE :name";
                $params[':name'] = "%{$name}%";
            }

            $whereStr = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

            $countRow = GenericDao::first("SELECT COUNT(*) AS total FROM list_contacts_general {$whereStr}", $params);
            $total = $countRow ? (int)$countRow['total'] : 0;
            $lastPage = $total > 0 ? (int)ceil($total / $limit) : 1;

            $sql = "SELECT id, id_person, name_person, phone_person, created_at, updated_at 
                    FROM list_contacts_general 
                    {$whereStr} 
                    ORDER BY id DESC 
                    LIMIT {$limit} OFFSET {$offset}";

            $rows = GenericDao::query($sql, $params);
            $data = is_array($rows) ? $rows : [];

            $response = [
                'data' => $data,
                'current_page' => $page,
                'last_page' => $lastPage,
                'per_page' => $limit,
                'total' => $total
            ];

            echo $this->returnSuccess("Lista de contatos", $response);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionDelete()
    {
        try {
            $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
            if (!$id) {
                throw new Exception("ID do contato não informado.");
            }

            GenericDao::execute("DELETE FROM list_contacts_general WHERE id = :id", [':id' => $id]);
            echo $this->returnSuccess("Contato excluído com sucesso");
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
