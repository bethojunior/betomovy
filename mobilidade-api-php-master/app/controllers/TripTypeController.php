<?php

namespace app\controllers;

use app\services\TripTypeService;
use Exception;
use PDO;

class TripTypeController extends ApiController
{
    public function actionIndex()
    {
        $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        $id = $_GET['id'] ?? null;

        if (!$id) {
            $path = explode('/', trim(parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH), '/'));
            if (isset($path[1]) && is_numeric($path[1])) {
                $id = (int)$path[1];
            }
        }

        if ($method === 'POST') {
            if ($id) {
                return $this->actionUpdate($id);
            }
            return $this->actionStore();
        }

        if ($method === 'PUT' && $id) {
            return $this->actionUpdate($id);
        }

        try {
            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);

            $stmt = $pdo->query("
                SELECT 
                    tt.idTripType,
                    tt.idTripType as id,
                    tt.type,
                    COALESCE(tt.name, tt.type) as name,
                    tt.description,
                    tt.picture,
                    tt.statusId,
                    COALESCE(
                        NULLIF(tt.serviceOption, 0),
                        CASE WHEN UPPER(COALESCE(tt.type, '')) LIKE '%ENTREGA%' OR UPPER(COALESCE(tt.type, '')) LIKE '%DELIVERY%' OR UPPER(COALESCE(tt.type, '')) LIKE '%FRETE%' THEN 1 ELSE 0 END,
                        0
                    ) as serviceOption,
                    COALESCE(
                        NULLIF(tt.deliveryOption, 0),
                        CASE WHEN UPPER(COALESCE(tt.type, '')) LIKE '%ENTREGA%' OR UPPER(COALESCE(tt.type, '')) LIKE '%DELIVERY%' THEN 1 ELSE 0 END,
                        0
                    ) as deliveryOption,
                    COALESCE(
                        NULLIF(tt.freightOption, 0),
                        CASE WHEN UPPER(COALESCE(tt.type, '')) LIKE '%FRETE%' THEN 1 ELSE 0 END,
                        0
                    ) as freightOption,
                    COALESCE(tt.onlyCentral, 0) as onlyCentral,
                    COALESCE(tt.openPrice, 0) as openPrice,
                    COALESCE(tt.offerOption, 0) as offerOption,
                    COALESCE(tt.loopingOption, 0) as loopingOption,
                    COALESCE(tt.scheduledOnlyOption, 0) as scheduledOnlyOption,
                    COALESCE(tt.returnOption, 0) as returnOption,
                    tt.messageNoDriversFound,
                    tt.gender_id,
                    COALESCE(g.name, 'todos') as gender_name
                FROM tripType tt
                LEFT JOIN gender g ON tt.gender_id = g.id
                WHERE tt.statusId = 1
                ORDER BY tt.idTripType ASC
            ");
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Fetch partners linked
            $partnersByTripType = [];
            try {
                $pStmt = $pdo->query("
                    SELECT utl.trip_type_id, utl.config_apps_partners_id, cap.id, cap.name_app, cap.key
                    FROM trip_type_partner_linked utl
                    LEFT JOIN config_apps_partners cap ON cap.id = utl.config_apps_partners_id
                ");
                if ($pStmt) {
                    while ($pRow = $pStmt->fetch(PDO::FETCH_ASSOC)) {
                        $partnersByTripType[$pRow['trip_type_id']][] = [
                            'config_apps_partners_id' => (int)$pRow['config_apps_partners_id'],
                            'config_app_partners' => [
                                'id' => (int)$pRow['id'],
                                'name_app' => $pRow['name_app'],
                                'key' => $pRow['key']
                            ]
                        ];
                    }
                }
            } catch (\Throwable $t) {}

            // Fetch call groups linked
            $callGroupsByTripType = [];
            try {
                $cgStmt = $pdo->query("
                    SELECT cgt.trip_type_id, cgt.call_group_id, cg.id, cg.name
                    FROM call_groups_trip_type_linked cgt
                    LEFT JOIN call_groups cg ON cg.id = cgt.call_group_id
                ");
                if ($cgStmt) {
                    while ($cgRow = $cgStmt->fetch(PDO::FETCH_ASSOC)) {
                        $callGroupsByTripType[$cgRow['trip_type_id']][] = [
                            'call_group_id' => (int)$cgRow['call_group_id'],
                            'name' => $cgRow['name']
                        ];
                    }
                }
            } catch (\Throwable $t) {}

            $storage = 'https://minio.704app.com.br/rota101fb704/';
            try {
                $storageVal = \app\model\Config::get('link_storage_pictures');
                if (!empty($storageVal)) {
                    $storage = $storageVal;
                }
            } catch (\Throwable $t) {}
            $storage = rtrim($storage, '/') . '/';

            $list = array_map(function ($row) use ($storage, $partnersByTripType, $callGroupsByTripType) {
                $rawPic = $row['picture'] ?? '';
                if ($rawPic && strpos($rawPic, 'http') !== 0) {
                    $row['picture'] = $storage . 'tripType/' . ltrim($rawPic, '/');
                }
                $row['gender'] = [
                    'id' => (int)($row['gender_id'] ?? 1),
                    'name' => $row['gender_name'] ?? 'todos'
                ];
                $row['serviceOption'] = (int)($row['serviceOption'] ?? 0);
                $row['deliveryOption'] = (int)($row['deliveryOption'] ?? 0);
                $row['freightOption'] = (int)($row['freightOption'] ?? 0);
                $row['onlyCentral'] = (int)($row['onlyCentral'] ?? 0);
                $row['openPrice'] = (int)($row['openPrice'] ?? 0);
                $row['offerOption'] = (int)($row['offerOption'] ?? 0);
                $row['loopingOption'] = (int)($row['loopingOption'] ?? 0);
                $row['scheduledOnlyOption'] = (int)($row['scheduledOnlyOption'] ?? 0);
                $row['returnOption'] = (int)($row['returnOption'] ?? 0);
                $row['trip_type_partner_linked'] = $partnersByTripType[$row['idTripType']] ?? [];
                $row['call_groups_trip_type_linked'] = $callGroupsByTripType[$row['idTripType']] ?? [];
                return $row;
            }, $rows);

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Tipos de viagem encontrados',
                'data' => $list,
                'response' => $list,
                'errors' => null
            ]);
        } catch (\Throwable $e) {
            $this->actionActives();
        }
    }

    public function actionUpdate($id = null)
    {
        try {
            $id = $id ?: ($_GET['id'] ?? null);
            if (!$id) {
                $path = explode('/', trim(parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH), '/'));
                if (isset($path[1]) && is_numeric($path[1])) {
                    $id = (int)$path[1];
                }
            }

            if (!$id) {
                echo $this->returnError(null, "ID não informado", 400);
                return;
            }

            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
            $type = $_POST['type'] ?? null;
            $description = $_POST['description'] ?? null;
            $genderId = isset($_POST['gender_id']) ? (int)$_POST['gender_id'] : null;
            $deliveryOption = isset($_POST['deliveryOption']) ? (int)$_POST['deliveryOption'] : null;
            $freightOption = isset($_POST['freightOption']) ? (int)$_POST['freightOption'] : null;
            $onlyCentral = isset($_POST['onlyCentral']) ? (int)$_POST['onlyCentral'] : null;
            $openPrice = isset($_POST['openPrice']) ? (int)$_POST['openPrice'] : null;
            $offerOption = isset($_POST['offerOption']) ? (int)$_POST['offerOption'] : null;
            $serviceOption = isset($_POST['serviceOption']) ? (int)$_POST['serviceOption'] : null;
            $loopingOption = isset($_POST['loopingOption']) ? (int)$_POST['loopingOption'] : null;
            $scheduledOnlyOption = isset($_POST['scheduledOnlyOption']) ? (int)$_POST['scheduledOnlyOption'] : null;
            $messageNoDriversFound = $_POST['messageNoDriversFound'] ?? null;

            $pictureFilename = null;
            if (!empty($_FILES['picture']['tmp_name'])) {
                $ext = pathinfo($_FILES['picture']['name'], PATHINFO_EXTENSION) ?: 'png';
                $pictureFilename = bin2hex(random_bytes(16)) . '.' . $ext;
                $targetDir = __DIR__ . '/../../public/webfiles/uploads/tripType/';
                if (!is_dir($targetDir)) {
                    @mkdir($targetDir, 0777, true);
                }
                @move_uploaded_file($_FILES['picture']['tmp_name'], $targetDir . $pictureFilename);
            }

            $fields = [];
            $params = [':id' => $id];

            if ($type !== null) {
                $fields[] = 'type = :type';
                $params[':type'] = trim($type);
            }
            if ($description !== null) {
                $fields[] = 'description = :description';
                $params[':description'] = trim($description);
            }
            if ($genderId !== null) {
                $fields[] = 'gender_id = :genderId';
                $params[':genderId'] = $genderId;
            }
            if ($deliveryOption !== null) {
                $fields[] = 'deliveryOption = :deliveryOption';
                $params[':deliveryOption'] = $deliveryOption;
            }
            if ($freightOption !== null) {
                $fields[] = 'freightOption = :freightOption';
                $params[':freightOption'] = $freightOption;
            }
            if ($onlyCentral !== null) {
                $fields[] = 'onlyCentral = :onlyCentral';
                $params[':onlyCentral'] = $onlyCentral;
            }
            if ($openPrice !== null) {
                $fields[] = 'openPrice = :openPrice';
                $params[':openPrice'] = $openPrice;
            }
            if ($offerOption !== null) {
                $fields[] = 'offerOption = :offerOption';
                $params[':offerOption'] = $offerOption;
            }
            if ($serviceOption !== null) {
                $fields[] = 'serviceOption = :serviceOption';
                $params[':serviceOption'] = $serviceOption;
            }
            if ($loopingOption !== null) {
                $fields[] = 'loopingOption = :loopingOption';
                $params[':loopingOption'] = $loopingOption;
            }
            if ($scheduledOnlyOption !== null) {
                $fields[] = 'scheduledOnlyOption = :scheduledOnlyOption';
                $params[':scheduledOnlyOption'] = $scheduledOnlyOption;
            }
            if ($messageNoDriversFound !== null) {
                $fields[] = 'messageNoDriversFound = :messageNoDriversFound';
                $params[':messageNoDriversFound'] = trim($messageNoDriversFound);
            }
            if ($pictureFilename !== null) {
                $fields[] = 'picture = :picture';
                $params[':picture'] = $pictureFilename;
            }

            if (!empty($fields)) {
                $sql = "UPDATE tripType SET " . implode(', ', $fields) . " WHERE idTripType = :id";
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
            }

            // Update app partner links if sent
            if (isset($_POST['idsAppPartners'])) {
                try {
                    $delStmt = $pdo->prepare("DELETE FROM trip_type_partner_linked WHERE trip_type_id = :id");
                    $delStmt->execute([':id' => $id]);
                    $insStmt = $pdo->prepare("INSERT INTO trip_type_partner_linked (trip_type_id, config_apps_partners_id) VALUES (:trip_type_id, :partner_id)");
                    $partners = is_array($_POST['idsAppPartners']) ? $_POST['idsAppPartners'] : [$_POST['idsAppPartners']];
                    foreach ($partners as $pid) {
                        $pid = (int)$pid;
                        if ($pid > 0) {
                            $insStmt->execute([':trip_type_id' => $id, ':partner_id' => $pid]);
                        }
                    }
                } catch (\Throwable $t) {}
            }

            // Update call group links if sent
            if (isset($_POST['idsCallGroups'])) {
                try {
                    $delCall = $pdo->prepare("DELETE FROM call_groups_trip_type_linked WHERE trip_type_id = :id");
                    $delCall->execute([':id' => $id]);
                    $insCall = $pdo->prepare("INSERT INTO call_groups_trip_type_linked (trip_type_id, call_group_id) VALUES (:trip_type_id, :group_id)");
                    $groups = is_array($_POST['idsCallGroups']) ? $_POST['idsCallGroups'] : [$_POST['idsCallGroups']];
                    foreach ($groups as $gid) {
                        $gid = (int)$gid;
                        if ($gid > 0) {
                            $insCall->execute([':trip_type_id' => $id, ':group_id' => $gid]);
                        }
                    }
                } catch (\Throwable $t) {}
            }

            echo $this->returnSuccess("Tipo de chamado editado com sucesso!", ['id' => $id]);
        } catch (\Throwable $e) {
            echo $this->returnError($e, "Erro ao editar tipo de chamado");
        }
    }

    public function actionStore()
    {
        try {
            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
            $type = trim($_POST['type'] ?? '');
            $description = trim($_POST['description'] ?? '');
            $genderId = (int)($_POST['gender_id'] ?? 1);
            $deliveryOption = (int)($_POST['deliveryOption'] ?? 0);
            $freightOption = (int)($_POST['freightOption'] ?? 0);
            $onlyCentral = (int)($_POST['onlyCentral'] ?? 0);
            $openPrice = (int)($_POST['openPrice'] ?? 0);
            $offerOption = (int)($_POST['offerOption'] ?? 0);
            $serviceOption = (int)($_POST['serviceOption'] ?? 0);
            $loopingOption = (int)($_POST['loopingOption'] ?? 0);
            $scheduledOnlyOption = (int)($_POST['scheduledOnlyOption'] ?? 0);
            $messageNoDriversFound = trim($_POST['messageNoDriversFound'] ?? '');

            $pictureFilename = 'carro_eco.png';
            if (!empty($_FILES['picture']['tmp_name'])) {
                $ext = pathinfo($_FILES['picture']['name'], PATHINFO_EXTENSION) ?: 'png';
                $pictureFilename = bin2hex(random_bytes(16)) . '.' . $ext;
                $targetDir = __DIR__ . '/../../public/webfiles/uploads/tripType/';
                if (!is_dir($targetDir)) {
                    @mkdir($targetDir, 0777, true);
                }
                @move_uploaded_file($_FILES['picture']['tmp_name'], $targetDir . $pictureFilename);
            }

            $stmt = $pdo->prepare("
                INSERT INTO tripType (
                    type, description, picture, gender_id, showType, statusId,
                    deliveryOption, freightOption, onlyCentral, openPrice, offerOption,
                    serviceOption, loopingOption, scheduledOnlyOption, messageNoDriversFound
                ) VALUES (
                    :type, :description, :picture, :gender_id, 1, 1,
                    :deliveryOption, :freightOption, :onlyCentral, :openPrice, :offerOption,
                    :serviceOption, :loopingOption, :scheduledOnlyOption, :messageNoDriversFound
                )
            ");
            $stmt->execute([
                ':type' => $type,
                ':description' => $description,
                ':picture' => $pictureFilename,
                ':gender_id' => $genderId,
                ':deliveryOption' => $deliveryOption,
                ':freightOption' => $freightOption,
                ':onlyCentral' => $onlyCentral,
                ':openPrice' => $openPrice,
                ':offerOption' => $offerOption,
                ':serviceOption' => $serviceOption,
                ':loopingOption' => $loopingOption,
                ':scheduledOnlyOption' => $scheduledOnlyOption,
                ':messageNoDriversFound' => $messageNoDriversFound,
            ]);

            $newId = (int)$pdo->lastInsertId();

            if (isset($_POST['idsAppPartners'])) {
                try {
                    $insStmt = $pdo->prepare("INSERT INTO trip_type_partner_linked (trip_type_id, config_apps_partners_id) VALUES (:trip_type_id, :partner_id)");
                    $partners = is_array($_POST['idsAppPartners']) ? $_POST['idsAppPartners'] : [$_POST['idsAppPartners']];
                    foreach ($partners as $pid) {
                        $pid = (int)$pid;
                        if ($pid > 0) {
                            $insStmt->execute([':trip_type_id' => $newId, ':partner_id' => $pid]);
                        }
                    }
                } catch (\Throwable $t) {}
            }

            if (isset($_POST['idsCallGroups'])) {
                try {
                    $insCall = $pdo->prepare("INSERT INTO call_groups_trip_type_linked (trip_type_id, call_group_id) VALUES (:trip_type_id, :group_id)");
                    $groups = is_array($_POST['idsCallGroups']) ? $_POST['idsCallGroups'] : [$_POST['idsCallGroups']];
                    foreach ($groups as $gid) {
                        $gid = (int)$gid;
                        if ($gid > 0) {
                            $insCall->execute([':trip_type_id' => $newId, ':group_id' => $gid]);
                        }
                    }
                } catch (\Throwable $t) {}
            }

            echo $this->returnSuccess("Tipo de chamado criado com sucesso!", ['id' => $newId]);
        } catch (\Throwable $e) {
            echo $this->returnError($e, "Erro ao criar tipo de chamado");
        }
    }

    public function actionActives()
    {
        try {
            echo $this->returnSuccess("Tipos de viagens encontradas",
                (new TripTypeService)
                    ->findActives()
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar tipos de viagens");
        }
    }

    public function actionFindByLocale()
    {
        try {
            $result = (new TripTypeService)
                ->findByLocale($this->requestQuery());

            echo $this->returnSuccess("Sucesso", $result);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
