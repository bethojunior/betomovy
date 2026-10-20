<?php

namespace app\controllers;

use app\dao\GenericDao;
use Exception;

class EstablishmentCollectionManagementController extends ApiController
{
    public function actionIndex()
    {
        try {
            $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

            if ($method === 'GET') {
                $sql = "SELECT id, label, fixedValue, orderValue, orderPercentage, statusId 
                        FROM establishmentCollectionManagement 
                        WHERE statusId = 1 
                        ORDER BY id ASC";
                $rows = GenericDao::query($sql);
                $result = [];

                foreach ($rows as $row) {
                    $row['id'] = (int)$row['id'];
                    $row['fixedValue'] = (float)$row['fixedValue'];
                    $row['orderValue'] = (float)$row['orderValue'];
                    $row['orderPercentage'] = (float)$row['orderPercentage'];
                    $result[] = $row;
                }

                echo $this->returnSuccess("Perfis de cobrança de estabelecimento", $result);
                return;
            }

            if ($method === 'POST') {
                $data = $this->request(false);
                $label = trim($data->label ?? '');
                $fixedValue = (float)($data->fixedValue ?? 0);
                $orderValue = (float)($data->orderValue ?? 0);
                $orderPercentage = (float)($data->orderPercentage ?? 0);

                GenericDao::execute("INSERT INTO establishmentCollectionManagement (label, fixedValue, orderValue, orderPercentage, statusId, created_at, updated_at) 
                                     VALUES (:label, :fixedValue, :orderValue, :orderPercentage, 1, NOW(), NOW())", [
                    ':label' => $label,
                    ':fixedValue' => $fixedValue,
                    ':orderValue' => $orderValue,
                    ':orderPercentage' => $orderPercentage
                ]);

                echo $this->returnSuccess("Perfil cadastrado com sucesso");
                return;
            }

            if ($method === 'PUT') {
                $id = (int)($_GET['id'] ?? 0);
                $data = $this->request(false);
                $label = trim($data->label ?? '');
                $fixedValue = (float)($data->fixedValue ?? 0);
                $orderValue = (float)($data->orderValue ?? 0);
                $orderPercentage = (float)($data->orderPercentage ?? 0);

                GenericDao::execute("UPDATE establishmentCollectionManagement 
                                     SET label = :label, fixedValue = :fixedValue, orderValue = :orderValue, orderPercentage = :orderPercentage, updated_at = NOW() 
                                     WHERE id = :id", [
                    ':id' => $id,
                    ':label' => $label,
                    ':fixedValue' => $fixedValue,
                    ':orderValue' => $orderValue,
                    ':orderPercentage' => $orderPercentage
                ]);

                echo $this->returnSuccess("Perfil atualizado com sucesso");
                return;
            }

            if ($method === 'DELETE') {
                $id = (int)($_GET['id'] ?? 0);
                GenericDao::execute("UPDATE establishmentCollectionManagement SET statusId = 2, updated_at = NOW() WHERE id = :id", [':id' => $id]);
                echo $this->returnSuccess("Perfil removido com sucesso");
                return;
            }
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
