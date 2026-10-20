<?php

namespace app\controllers;

use app\services\PartnerService;
use app\services\PartnerTripService;
use app\utils\BaseDao;
use app\utils\Headers;
use Exception;

class PartnerController extends ApiController
{
    public function actionIndex()
    {
        try {
            $dao = new BaseDao();
            $name = isset($_GET['name']) ? trim($_GET['name']) : '';
            $phone = isset($_GET['phone']) ? trim($_GET['phone']) : '';
            $email = isset($_GET['email']) ? trim($_GET['email']) : '';

            $where = ["p.statusId != 3"]; // não deletados
            $params = [];

            if (!empty($name)) {
                $where[] = "(u.name LIKE :name OR p.nameEstablishment LIKE :name)";
                $params[':name'] = "%{$name}%";
            }
            if (!empty($phone)) {
                $where[] = "u.phone LIKE :phone";
                $params[':phone'] = "%{$phone}%";
            }
            if (!empty($email)) {
                $where[] = "u.email LIKE :email";
                $params[':email'] = "%{$email}%";
            }

            $whereStr = implode(" AND ", $where);
            $sql = "SELECT p.idPartner AS id,
                           p.idPartner,
                           p.userId,
                           p.nameEstablishment,
                           p.addressEstablishment,
                           p.statusId,
                           p.partnerRegisterStatusId,
                           p.created_at,
                           u.name AS partnerName,
                           u.phone AS partnerPhone,
                           u.email AS partnerEmail
                    FROM partner p
                    LEFT JOIN user u ON u.idUser = p.userId
                    WHERE {$whereStr}
                    ORDER BY p.idPartner DESC
                    LIMIT 200";

            $rows = $dao->sqlRawSelect($sql, $params)->get();
            $result = is_array($rows) ? $rows : [];

            foreach ($result as &$r) {
                $r['id'] = (int)$r['id'];
                $r['idPartner'] = (int)$r['idPartner'];
                $r['userId'] = (int)$r['userId'];
                $r['statusId'] = (int)$r['statusId'];
                $r['partnerRegisterStatusId'] = (int)$r['partnerRegisterStatusId'];
            }

            echo $this->returnSuccess("Lista de parceiros", $result);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao listar parceiros");
        }
    }

    public function actionChangeStatus()
    {
        try {
            $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
            if (!$id) {
                throw new Exception("ID do parceiro não informado.");
            }

            $dao = new BaseDao();
            $partner = $dao->sqlRawSelect("SELECT idPartner, statusId FROM partner WHERE idPartner = :id", [':id' => $id])->first();
            if (!$partner) {
                throw new Exception("Parceiro não encontrado.");
            }

            $newStatus = ((int)$partner['statusId'] === 1) ? 2 : 1;
            $dao->sqlRawSelect("UPDATE partner SET statusId = :statusId, updated_at = NOW() WHERE idPartner = :id", [
                ':statusId' => $newStatus,
                ':id' => $id
            ]);

            echo $this->returnSuccess("Status do parceiro atualizado com sucesso");
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionRequestPartnership()
    {
        try {
            echo $this->returnSuccess("Parceria solicitada com sucesso",
                (new PartnerService)
                    ->requestPartnership($this->request(false)));
        } catch (Exception $exception) {
            echo $this->returnError($exception);
        }
    }

    public function actionFindByUser()
    {
        try {
            echo $this->returnSuccess("Dados do parceiro encontrados com sucesso",
                (new PartnerService)
                    ->findByUser($this->request(false)->userId ?? null)
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionNewTrip()
    {
        try {
            echo $this->returnSuccess("Viagem iniciado com sucesso",
                (new PartnerTripService)
                    ->newTrip($this->request(false))
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetActiveTrips()
    {
        try {
            echo $this->returnSuccess("Listando viagens do parceiro",
                (new PartnerService)
                    ->getTrips(
                        $this->request(false)->userId ??
                        Headers::getUserId())
            );
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
