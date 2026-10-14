<?php

namespace app\controllers;

use app\services\TripItemTypeService;
use app\services\DeliveryInfoSuggestionService;
use app\utils\Connection;
use Exception;

/**
 * Controller para sugestões e tipos de itens de entrega
 */
class DeliveryInfoSuggestionController extends ApiController
{
    public function actionIndex()
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

        if (strtoupper($method) === 'POST') {
            return $this->handleSave();
        }

        return $this->handleGet();
    }

    private function handleGet()
    {
        try {
            $tripItemType = [];
            try {
                $tripItemType = (new TripItemTypeService)->getAll();
            } catch (\Throwable $e) {
                // Fallback direto via PDO se service falhar
                try {
                    $pdo = Connection::open();
                    $stmt = $pdo->query("SELECT id, name, picture, statusId FROM tripItemType WHERE statusId = 1");
                    $tripItemType = $stmt->fetchAll(\PDO::FETCH_ASSOC) ?: [];
                } catch (\Throwable $e2) {
                    $tripItemType = [];
                }
            }

            $deliveryInfoSuggestion = null;
            try {
                $deliveryInfoSuggestion = (new DeliveryInfoSuggestionService)->find();
            } catch (\Throwable $e) {
                try {
                    $pdo = Connection::open();
                    $stmt = $pdo->query("SELECT id, obsOrigin, obsDestination, obs, statusId FROM deliveryInfoSuggestion WHERE statusId = 1 ORDER BY id DESC LIMIT 1");
                    $deliveryInfoSuggestion = $stmt->fetch(\PDO::FETCH_ASSOC) ?: null;
                } catch (\Throwable $e2) {
                    $deliveryInfoSuggestion = null;
                }
            }

            echo $this->returnSuccess("Sugestões encontradas", [
                'tripItemType' => $tripItemType ?: [],
                'deliveryInfoSuggestion' => $deliveryInfoSuggestion ?: new \stdClass()
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar sugestões de informações de entrega");
        }
    }

    private function handleSave()
    {
        try {
            $data = $this->getPostValues();
            if (empty($data)) {
                $raw = file_get_contents('php://input');
                $data = json_decode($raw, true) ?: [];
            }

            $obs = $data['obs'] ?? '';
            $obsOrigin = $data['obsOrigin'] ?? ($data['obs_origin'] ?? '');
            $obsDestination = $data['obsDestination'] ?? ($data['obs_destination'] ?? '');

            $pdo = Connection::open();
            // Desativa sugestões anteriores
            $pdo->exec("UPDATE deliveryInfoSuggestion SET statusId = 2 WHERE statusId = 1");

            // Insere a nova
            $stmt = $pdo->prepare("INSERT INTO deliveryInfoSuggestion (obs, obsOrigin, obsDestination, statusId) VALUES (:obs, :obsOrigin, :obsDestination, 1)");
            $stmt->execute([
                ':obs' => $obs,
                ':obsOrigin' => $obsOrigin,
                ':obsDestination' => $obsDestination
            ]);
            $newId = $pdo->lastInsertId();

            echo $this->returnSuccess("Sugestões salvas com sucesso", [
                'id' => $newId,
                'obs' => $obs,
                'obsOrigin' => $obsOrigin,
                'obsDestination' => $obsDestination,
                'statusId' => 1
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao salvar sugestões");
        }
    }
}
