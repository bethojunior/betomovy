<?php

namespace app\controllers;

use app\constant\PartnerRegisterStatusConst;
use app\dao\GenericDao;
use app\services\PartnerService;
use app\services\PartnerTripService;
use app\utils\Headers;
use Exception;

class PartnerController extends ApiController
{
    public function actionIndex()
    {
        try {
            $name = isset($_GET['name']) ? trim($_GET['name']) : '';
            $phone = isset($_GET['phone']) ? trim($_GET['phone']) : '';
            $email = isset($_GET['email']) ? trim($_GET['email']) : '';
            $status = isset($_GET['partnerRegisterStatusId']) ? (int)$_GET['partnerRegisterStatusId'] : null;

            $where = ["p.statusId != 2"]; // 2 = EXCLUIDO
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
            if ($status !== null && $status > 0) {
                $where[] = "p.partnerRegisterStatusId = :statusId";
                $params[':statusId'] = $status;
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
                           COALESCE(u.name, p.nameEstablishment, 'Sem Nome') AS name,
                           COALESCE(u.phone, '') AS phone,
                           COALESCE(u.email, '') AS email,
                           COALESCE(u.profileImage, '') AS profileImage,
                           COALESCE(prs.name, 
                               CASE p.partnerRegisterStatusId
                                   WHEN 1 THEN 'ATIVO'
                                   WHEN 2 THEN 'PENDENTE'
                                   WHEN 3 THEN 'BLOQUEADO'
                                   ELSE 'ATIVO'
                               END
                           ) AS partnerRegister
                    FROM partner p
                    LEFT JOIN user u ON u.idUser = p.userId
                    LEFT JOIN partnerRegisterStatus prs ON prs.id = p.partnerRegisterStatusId
                    WHERE {$whereStr}
                    ORDER BY p.idPartner DESC
                    LIMIT 200";

            $rows = GenericDao::query($sql, $params);
            $result = [];

            foreach ($rows as $r) {
                $r['id'] = (int)$r['id'];
                $r['idPartner'] = (int)$r['idPartner'];
                $r['userId'] = (int)$r['userId'];
                $r['statusId'] = (int)$r['statusId'];
                $r['partnerRegisterStatusId'] = (int)$r['partnerRegisterStatusId'];
                // Compatibilidade com ambos os formatos esperados pelos componentes do Monitor
                $r['partnerName'] = $r['name'];
                $r['partnerPhone'] = $r['phone'];
                $r['partnerEmail'] = $r['email'];
                $result[] = $r;
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
                $rawInput = file_get_contents('php://input');
                $body = json_decode($rawInput, true);
                if (!empty($body['id'])) {
                    $id = (int)$body['id'];
                }
            }
            if (!$id) {
                throw new Exception("ID do parceiro não informado.");
            }

            $partner = GenericDao::first("SELECT idPartner, statusId, partnerRegisterStatusId FROM partner WHERE idPartner = :id", [':id' => $id]);
            if (!$partner) {
                throw new Exception("Parceiro não encontrado.");
            }

            $isCurrentlyBlocked = ((int)$partner['partnerRegisterStatusId'] === PartnerRegisterStatusConst::BLOCKED);
            $newRegisterStatus = $isCurrentlyBlocked ? PartnerRegisterStatusConst::ACTIVE : PartnerRegisterStatusConst::BLOCKED;
            $newStatus = $isCurrentlyBlocked ? 1 : 2;

            GenericDao::execute("UPDATE partner SET statusId = :statusId, partnerRegisterStatusId = :regStatus, updated_at = NOW() WHERE idPartner = :id", [
                ':statusId' => $newStatus,
                ':regStatus' => $newRegisterStatus,
                ':id' => $id
            ]);

            $statusText = ($newRegisterStatus === PartnerRegisterStatusConst::BLOCKED) ? 'BLOQUEADO' : 'ATIVO';

            echo $this->returnSuccess("Status do parceiro atualizado com sucesso", [
                'idPartner' => $id,
                'partnerRegisterStatusId' => $newRegisterStatus,
                'partnerRegister' => $statusText
            ]);
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
