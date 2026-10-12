<?php

namespace app\controllers;

use app\utils\Connection;
use Exception;
use PDO;

class MapServiceController extends ApiController
{
    public function actionIndex()
    {
        $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        if ($method === 'POST') {
            return $this->actionStore();
        }

        try {
            $cityId = $_SERVER['HTTP_CITYID'] ?? ($_GET['cityId'] ?? null);

            $db = Connection::getConnection(Connection::DB_MYSQL_RO);

            $whereCity = $cityId ? "AND msmdc.cityId = :cityId" : "";
            $sql = "
                SELECT msmdc.id,
                       msmd.`key`,
                       msmdc.value,
                       msmd.mapServiceId,
                       msmd.description,
                       msmdc.groupCode,
                       ms.name as serviceName
                FROM mapService ms
                INNER JOIN mapServiceMetaData msmd ON ms.id = msmd.mapServiceId
                INNER JOIN mapServiceMetaDataCity msmdc ON msmd.id = msmdc.mapServiceMetaDataId
                WHERE ms.statusId = 1
                  AND msmdc.statusId = 1
                  AND msmdc.groupCode IS NOT NULL
                  {$whereCity}
                ORDER BY msmdc.groupCode
            ";

            $stmt = $db->prepare($sql);
            if ($cityId) {
                $stmt->bindValue(':cityId', (int)$cityId, PDO::PARAM_INT);
            }
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $results = [];
            foreach ($rows as $row) {
                $groupCode = $row['groupCode'];
                if (!isset($results[$groupCode])) {
                    $results[$groupCode] = [
                        'groupCode' => $groupCode,
                        'type' => $row['serviceName'] ?? 'google',
                        'keys' => []
                    ];
                }
                $results[$groupCode]['keys'][] = [
                    'key' => $row['key'],
                    'value' => $row['value']
                ];
            }

            echo $this->returnSuccess("Lista de serviços de mapa", array_values($results));
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar serviços de mapa");
        }
    }

    public function actionTypes()
    {
        try {
            $db = Connection::getConnection(Connection::DB_MYSQL_RO);

            $sqlServices = "SELECT id, name, description FROM mapService WHERE statusId = 1";
            $stmt = $db->query($sqlServices);
            $services = $stmt ? $stmt->fetchAll(PDO::FETCH_ASSOC) : [];

            $sqlMeta = "SELECT id, mapServiceId, `key`, description FROM mapServiceMetaData";
            $stmtMeta = $db->query($sqlMeta);
            $metaData = $stmtMeta ? $stmtMeta->fetchAll(PDO::FETCH_ASSOC) : [];

            $metaByService = [];
            foreach ($metaData as $meta) {
                $sId = $meta['mapServiceId'];
                if (!isset($metaByService[$sId])) {
                    $metaByService[$sId] = [];
                }
                $metaByService[$sId][] = [
                    'id' => (int)$meta['id'],
                    'mapServiceId' => (int)$meta['mapServiceId'],
                    'key' => $meta['key'],
                    'description' => $meta['description'],
                    'value' => ''
                ];
            }

            $results = [];
            foreach ($services as $service) {
                $results[] = [
                    'id' => (int)$service['id'],
                    'name' => $service['name'],
                    'description' => !empty($service['description']) ? $service['description'] : ucfirst($service['name']),
                    'map_service_meta_data' => $metaByService[$service['id']] ?? []
                ];
            }

            echo $this->returnSuccess("Tipos de serviços de mapa", $results);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar tipos de mapas");
        }
    }

    public function actionStore()
    {
        try {
            $cityId = $_SERVER['HTTP_CITYID'] ?? null;
            if (!$cityId) {
                throw new Exception("Cidade não especificada");
            }

            $body = $this->request(false);
            $metadata = $body->metadata ?? [];
            if (empty($metadata)) {
                throw new Exception("Metadados não fornecidos");
            }

            $db = Connection::getConnection(Connection::DB_MYSQL_RW);
            $groupCode = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
                mt_rand(0, 0xffff), mt_rand(0, 0xffff),
                mt_rand(0, 0xffff),
                mt_rand(0, 0x0fff) | 0x4000,
                mt_rand(0, 0x3fff) | 0x8000,
                mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
            );

            $stmtFindMeta = $db->prepare("SELECT id FROM mapServiceMetaData WHERE `key` = :key LIMIT 1");
            $stmtInsert = $db->prepare("
                INSERT INTO mapServiceMetaDataCity (mapServiceMetaDataId, value, cityId, groupCode, statusId)
                VALUES (:metaId, :value, :cityId, :groupCode, 1)
            ");

            foreach ($metadata as $item) {
                $itemObj = (object)$item;
                $stmtFindMeta->execute([':key' => $itemObj->key]);
                $metaRow = $stmtFindMeta->fetch(PDO::FETCH_ASSOC);
                if ($metaRow) {
                    $stmtInsert->execute([
                        ':metaId' => $metaRow['id'],
                        ':value' => $itemObj->value,
                        ':cityId' => (int)$cityId,
                        ':groupCode' => $groupCode
                    ]);
                }
            }

            echo $this->returnSuccess("Credencial criada com sucesso", ['groupCode' => $groupCode]);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao salvar credenciais");
        }
    }

    public function actionDisable()
    {
        try {
            $groupCode = $_GET['groupCode'] ?? ($_GET['id'] ?? null);
            if (!$groupCode) {
                $uri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
                $parts = explode('/', trim((string)$uri, '/'));
                foreach ($parts as $idx => $part) {
                    if ($part === 'disable' && isset($parts[$idx - 1])) {
                        $groupCode = $parts[$idx - 1];
                        break;
                    }
                }
            }

            if (!$groupCode) {
                throw new Exception("Código do grupo não fornecido");
            }

            $db = Connection::getConnection(Connection::DB_MYSQL_RW);
            $stmt = $db->prepare("UPDATE mapServiceMetaDataCity SET statusId = 2 WHERE groupCode = :groupCode");
            $stmt->execute([':groupCode' => $groupCode]);

            echo $this->returnSuccess("Credencial desativada com sucesso");
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao desativar credencial");
        }
    }
}
