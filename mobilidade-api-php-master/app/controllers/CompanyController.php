<?php

namespace app\controllers;

use app\dao\GenericDao;
use app\utils\Connection;
use Exception;
use PDO;

class CompanyController extends ApiController
{
    /**
     * Ponto central de roteamento da controller de Company:
     * - GET /company (listagem paginada com filtros)
     * - GET /company/{id} (detalhes de uma empresa)
     * - POST /company (criação de empresa)
     * - PUT /company (atualização de empresa)
     * - DELETE /company/{id} (exclusão de empresa)
     */
    public function actionIndex()
    {
        try {
            $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
            $id = isset($_GET['id']) && is_numeric($_GET['id']) ? (int)$_GET['id'] : null;

            if ($method === 'POST') {
                return $this->handleSave();
            }

            if ($method === 'PUT') {
                return $this->handleUpdate($id);
            }

            if ($method === 'DELETE') {
                return $this->handleDelete($id);
            }

            // Se for GET com ID específico, retorna a empresa
            if ($id !== null && $id > 0) {
                return $this->handleFindById($id);
            }

            // Listagem de empresas com filtros e paginação
            return $this->handleList();
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    /**
     * Listagem paginada de empresas
     */
    private function handleList()
    {
        $cityId = isset($_GET['cityId']) && !empty($_GET['cityId']) ? (int)$_GET['cityId'] : null;
        $fantasyName = isset($_GET['fantasyName']) && trim((string)$_GET['fantasyName']) !== '' ? trim((string)$_GET['fantasyName']) : null;
        $document = isset($_GET['document']) && trim((string)$_GET['document']) !== '' ? trim((string)$_GET['document']) : null;
        $phone = isset($_GET['phone']) && trim((string)$_GET['phone']) !== '' ? trim((string)$_GET['phone']) : null;
        $page = isset($_GET['page']) && (int)$_GET['page'] > 0 ? (int)$_GET['page'] : 1;
        $perPage = isset($_GET['per_page']) && (int)$_GET['per_page'] > 0 ? (int)$_GET['per_page'] : (isset($_GET['limit']) && (int)$_GET['limit'] > 0 ? (int)$_GET['limit'] : 20);

        $where = ["c.statusId = 1"];
        $params = [];

        if ($cityId) {
            $where[] = "(c.cityId = :cityId OR c.cityId IS NULL)";
            $params[':cityId'] = $cityId;
        }

        if ($fantasyName) {
            $where[] = "(c.fantasyName LIKE :fantasyName OR c.name LIKE :fantasyName)";
            $params[':fantasyName'] = '%' . $fantasyName . '%';
        }

        if ($document) {
            $cleanDoc = preg_replace('/\D/', '', $document);
            $where[] = "(c.document LIKE :docRaw OR c.document LIKE :docClean)";
            $params[':docRaw'] = '%' . $document . '%';
            $params[':docClean'] = '%' . $cleanDoc . '%';
        }

        if ($phone) {
            $cleanPhone = preg_replace('/\D/', '', $phone);
            $where[] = "(c.phone LIKE :phoneRaw OR c.phone LIKE :phoneClean)";
            $params[':phoneRaw'] = '%' . $phone . '%';
            $params[':phoneClean'] = '%' . $cleanPhone . '%';
        }

        $whereStr = implode(" AND ", $where);

        // Contagem total para paginação
        $sqlCount = "SELECT COUNT(DISTINCT c.id) as total FROM company c WHERE {$whereStr}";
        $countResult = GenericDao::first($sqlCount, $params);
        $total = (int)($countResult['total'] ?? 0);

        $offset = ($page - 1) * $perPage;

        // Inspeciona colunas da tabela company para evitar erros em colunas opcionais
        $cols = $this->getCompanyColumns();
        $selectCols = [
            'c.id',
            'c.name',
            'c.fantasyName',
            'c.document',
            'c.phone',
            'c.email',
            'c.address',
            'c.cityId',
            'c.latitude',
            'c.longitude',
            'c.logo_picture',
            'c.balanceId',
            'c.companyRegisterStatusId',
            'c.statusId',
            'c.created_at',
            'c.updated_at',
        ];

        // Adiciona colunas extras se existirem na tabela
        $extraCols = ['billingDay', 'voucherLimit', 'observation', 'registration', 'site', 'facebook', 'instagram'];
        foreach ($extraCols as $extra) {
            if (isset($cols[strtolower($extra)])) {
                $selectCols[] = "c.{$extra}";
            }
        }

        $selectStr = implode(", ", $selectCols);

        $sql = "SELECT {$selectStr}, 
                       COALESCE(b.tripBalance, 0) as tripBalance,
                       ci.estado as stateId,
                       ci.nome as cityName
                FROM company c
                LEFT JOIN balance b ON b.idBalance = c.balanceId
                LEFT JOIN city ci ON ci.id = c.cityId
                WHERE {$whereStr}
                ORDER BY c.id DESC
                LIMIT {$perPage} OFFSET {$offset}";

        $rows = GenericDao::query($sql, $params);
        $data = [];

        foreach ($rows as $r) {
            $statusId = (int)($r['companyRegisterStatusId'] ?? 1);
            $statusName = $statusId === 3 ? 'BLOQUEADO' : 'ATIVO';

            $data[] = [
                'id' => (int)$r['id'],
                'name' => $r['name'] ?? '',
                'fantasyName' => !empty($r['fantasyName']) ? $r['fantasyName'] : ($r['name'] ?? ''),
                'address' => $r['address'] ?? '',
                'document' => $r['document'] ?? '',
                'cityId' => (int)($r['cityId'] ?? 0),
                'stateId' => (int)($r['stateId'] ?? 0),
                'email' => $r['email'] ?? '',
                'phone' => $r['phone'] ?? '',
                'latitude' => $r['latitude'] ?? '',
                'longitude' => $r['longitude'] ?? '',
                'logo_picture' => $r['logo_picture'] ?? '',
                'balanceId' => (int)($r['balanceId'] ?? 0),
                'voucherLimit' => (float)($r['voucherLimit'] ?? 0),
                'billingDay' => (int)($r['billingDay'] ?? 0),
                'observation' => $r['observation'] ?? '',
                'registration' => $r['registration'] ?? '',
                'site' => $r['site'] ?? '',
                'facebook' => $r['facebook'] ?? '',
                'instagram' => $r['instagram'] ?? '',
                'companyRegisterStatusId' => $statusId,
                'company_register_status' => [
                    'id' => $statusId,
                    'name' => $statusName,
                ],
                'balance' => [
                    'idBalance' => (int)($r['balanceId'] ?? 0),
                    'tripBalance' => (float)($r['tripBalance'] ?? 0),
                ],
                'created_at' => $r['created_at'] ?? date('Y-m-d H:i:s'),
                'updated_at' => $r['updated_at'] ?? date('Y-m-d H:i:s'),
            ];
        }

        $lastPage = $perPage > 0 ? (int)ceil($total / $perPage) : 1;
        if ($lastPage < 1) $lastPage = 1;

        $response = [
            'current_page' => $page,
            'data' => $data,
            'last_page' => $lastPage,
            'per_page' => $perPage,
            'total' => $total,
        ];

        echo $this->returnSuccess("Empresas", $response);
    }

    /**
     * Busca os detalhes de uma empresa por ID
     */
    public function handleFindById(int $id)
    {
        $cols = $this->getCompanyColumns();
        $selectCols = [
            'c.id',
            'c.name',
            'c.fantasyName',
            'c.document',
            'c.phone',
            'c.email',
            'c.address',
            'c.cityId',
            'c.latitude',
            'c.longitude',
            'c.logo_picture',
            'c.balanceId',
            'c.companyRegisterStatusId',
            'c.statusId',
            'c.created_at',
            'c.updated_at',
        ];

        $extraCols = ['billingDay', 'voucherLimit', 'observation', 'registration', 'site', 'facebook', 'instagram'];
        foreach ($extraCols as $extra) {
            if (isset($cols[strtolower($extra)])) {
                $selectCols[] = "c.{$extra}";
            }
        }

        $selectStr = implode(", ", $selectCols);

        $sql = "SELECT {$selectStr}, 
                       COALESCE(b.tripBalance, 0) as tripBalance,
                       ci.estado as stateId,
                       ci.nome as cityName
                FROM company c
                LEFT JOIN balance b ON b.idBalance = c.balanceId
                LEFT JOIN city ci ON ci.id = c.cityId
                WHERE c.id = :id AND c.statusId = 1
                LIMIT 1";

        $row = GenericDao::first($sql, [':id' => $id]);
        if (!$row) {
            throw new Exception("Empresa não encontrada");
        }

        $statusId = (int)($row['companyRegisterStatusId'] ?? 1);
        $statusName = $statusId === 3 ? 'BLOQUEADO' : 'ATIVO';

        $data = [
            'id' => (int)$row['id'],
            'name' => $row['name'] ?? '',
            'fantasyName' => !empty($row['fantasyName']) ? $row['fantasyName'] : ($row['name'] ?? ''),
            'address' => $row['address'] ?? '',
            'document' => $row['document'] ?? '',
            'cityId' => (int)($row['cityId'] ?? 0),
            'stateId' => (int)($row['stateId'] ?? 0),
            'email' => $row['email'] ?? '',
            'phone' => $row['phone'] ?? '',
            'latitude' => $row['latitude'] ?? '',
            'longitude' => $row['longitude'] ?? '',
            'logo_picture' => $row['logo_picture'] ?? '',
            'balanceId' => (int)($row['balanceId'] ?? 0),
            'voucherLimit' => (float)($row['voucherLimit'] ?? 0),
            'billingDay' => (int)($row['billingDay'] ?? 0),
            'observation' => $row['observation'] ?? '',
            'registration' => $row['registration'] ?? '',
            'site' => $row['site'] ?? '',
            'facebook' => $row['facebook'] ?? '',
            'instagram' => $row['instagram'] ?? '',
            'companyRegisterStatusId' => $statusId,
            'company_register_status' => [
                'id' => $statusId,
                'name' => $statusName,
            ],
            'balance' => [
                'idBalance' => (int)($row['balanceId'] ?? 0),
                'tripBalance' => (float)($row['tripBalance'] ?? 0),
            ],
            'created_at' => $row['created_at'] ?? date('Y-m-d H:i:s'),
            'updated_at' => $row['updated_at'] ?? date('Y-m-d H:i:s'),
        ];

        echo $this->returnSuccess("Empresa", $data);
    }

    /**
     * Retorna a lista de colaboradores (workers) da empresa
     * Endpoint: GET /company/{id}/workers
     */
    public function actionWorkers()
    {
        try {
            $companyId = isset($_GET['id']) && is_numeric($_GET['id']) ? (int)$_GET['id'] : null;
            if (!$companyId) {
                throw new Exception("ID da empresa inválido");
            }

            $sql = "SELECT cw.id as idCompanyWorker,
                           cw.companyId,
                           cw.userId,
                           u.idUser,
                           u.name,
                           u.email,
                           u.phone,
                           u.document
                    FROM companyWorker cw
                    INNER JOIN user u ON u.idUser = cw.userId
                    WHERE cw.companyId = :companyId 
                      AND cw.statusId = 1 
                      AND u.statusId = 1
                    ORDER BY u.name ASC";

            $rows = GenericDao::query($sql, [':companyId' => $companyId]);
            $list = [];

            foreach ($rows as $r) {
                $list[] = [
                    'id' => (int)$r['idCompanyWorker'],
                    'idCompanyWorker' => (int)$r['idCompanyWorker'],
                    'companyId' => (int)$r['companyId'],
                    'userId' => (int)$r['idUser'],
                    'user' => [
                        'idUser' => (int)$r['idUser'],
                        'userId' => (int)$r['idUser'],
                        'name' => $r['name'] ?? '',
                        'email' => $r['email'] ?? '',
                        'phone' => $r['phone'] ?? '',
                        'document' => $r['document'] ?? '',
                    ]
                ];
            }

            echo $this->returnSuccess("Colaboradores", $list);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    /**
     * Bloquear empresa
     * Endpoint: PUT /company/{id}/block
     */
    public function actionBlock()
    {
        try {
            $id = isset($_GET['id']) && is_numeric($_GET['id']) ? (int)$_GET['id'] : null;
            if (!$id) {
                throw new Exception("ID da empresa não informado");
            }

            GenericDao::execute("UPDATE company SET companyRegisterStatusId = 3, updated_at = NOW() WHERE id = :id", [':id' => $id]);
            echo $this->returnSuccess("Pessoa jurídica bloqueada com sucesso!", ['id' => $id, 'status' => 'BLOQUEADO']);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    /**
     * Desbloquear empresa
     * Endpoint: PUT /company/{id}/enable
     */
    public function actionEnable()
    {
        try {
            $id = isset($_GET['id']) && is_numeric($_GET['id']) ? (int)$_GET['id'] : null;
            if (!$id) {
                throw new Exception("ID da empresa não informado");
            }

            GenericDao::execute("UPDATE company SET companyRegisterStatusId = 1, updated_at = NOW() WHERE id = :id", [':id' => $id]);
            echo $this->returnSuccess("Pessoa jurídica desbloqueada com sucesso!", ['id' => $id, 'status' => 'ATIVO']);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    /**
     * Alterar / Incrementar saldo de Voucher da empresa
     * Endpoint: POST /company/{id}/voucher/increment
     */
    public function actionVoucherIncrement()
    {
        try {
            $raw = file_get_contents('php://input');
            $body = json_decode($raw, true) ?: [];

            $id = isset($_GET['id']) && is_numeric($_GET['id']) ? (int)$_GET['id'] : (isset($body['legalId']) ? (int)$body['legalId'] : null);
            if (!$id) {
                throw new Exception("ID da empresa não informado");
            }

            $value = isset($body['value']) ? (float)$body['value'] : 0;

            $company = GenericDao::first("SELECT id, balanceId FROM company WHERE id = :id LIMIT 1", [':id' => $id]);
            if (!$company) {
                throw new Exception("Empresa não encontrada");
            }

            $balanceId = (int)($company['balanceId'] ?? 0);

            $pdo = Connection::open();
            if (!$balanceId) {
                // Cria registro em balance se não existir
                $pdo->beginTransaction();
                $stmt = $pdo->prepare("INSERT INTO balance (balance, tripBalance, withheldBalance) VALUES (0, :val, 0)");
                $stmt->execute([':val' => max(0, $value)]);
                $balanceId = (int)$pdo->lastInsertId();
                $pdo->prepare("UPDATE company SET balanceId = :bId WHERE id = :id")->execute([':bId' => $balanceId, ':id' => $id]);
                $pdo->commit();
            } else {
                // Atualiza tripBalance existente
                $stmt = $pdo->prepare("UPDATE balance SET tripBalance = GREATEST(0, tripBalance + :val) WHERE idBalance = :bId");
                $stmt->execute([':val' => $value, ':bId' => $balanceId]);
            }

            $currBalance = GenericDao::first("SELECT tripBalance FROM balance WHERE idBalance = :bId", [':bId' => $balanceId]);
            $newTripBalance = (float)($currBalance['tripBalance'] ?? 0);

            echo $this->returnSuccess("Saldo atualizado com sucesso!", [
                'id' => $id,
                'balanceId' => $balanceId,
                'tripBalance' => $newTripBalance,
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    /**
     * Salvar nova empresa (POST /company)
     */
    private function handleSave()
    {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true) ?: $_POST;

        $fantasyName = trim($body['fantasyName'] ?? ($body['name'] ?? ''));
        $name = trim($body['name'] ?? $fantasyName);
        $document = preg_replace('/\D/', '', $body['document'] ?? '');
        $phone = preg_replace('/\D/', '', $body['phone'] ?? '');
        $email = trim($body['email'] ?? '');
        $address = trim($body['address'] ?? '');
        $cityId = isset($body['cityId']) && is_numeric($body['cityId']) ? (int)$body['cityId'] : null;
        $billingDay = isset($body['billingDay']) && is_numeric($body['billingDay']) ? (int)$body['billingDay'] : 0;
        $voucherLimit = isset($body['voucherLimit']) ? (float)$body['voucherLimit'] : 0;
        $observation = trim($body['observation'] ?? '');
        $registration = trim($body['registration'] ?? '');
        $site = trim($body['site'] ?? '');
        $facebook = trim($body['facebook'] ?? '');
        $instagram = trim($body['instagram'] ?? '');

        if (empty($fantasyName) && empty($name)) {
            throw new Exception("O nome / razão social da empresa é obrigatório");
        }

        $pdo = Connection::open();
        $pdo->beginTransaction();

        try {
            // Cria saldo inicial
            $stmtBal = $pdo->prepare("INSERT INTO balance (balance, tripBalance, withheldBalance) VALUES (0, 0, 0)");
            $stmtBal->execute();
            $balanceId = (int)$pdo->lastInsertId();

            // Monta colunas suportadas
            $cols = $this->getCompanyColumns();
            $insertData = [
                'name' => $name,
                'fantasyName' => $fantasyName,
                'document' => $document,
                'phone' => $phone,
                'email' => $email,
                'address' => $address,
                'cityId' => $cityId,
                'balanceId' => $balanceId,
                'companyRegisterStatusId' => 1,
                'statusId' => 1,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ];

            if (isset($cols['billingday'])) $insertData['billingDay'] = $billingDay;
            if (isset($cols['voucherlimit'])) $insertData['voucherLimit'] = $voucherLimit;
            if (isset($cols['observation'])) $insertData['observation'] = $observation;
            if (isset($cols['registration'])) $insertData['registration'] = $registration;
            if (isset($cols['site'])) $insertData['site'] = $site;
            if (isset($cols['facebook'])) $insertData['facebook'] = $facebook;
            if (isset($cols['instagram'])) $insertData['instagram'] = $instagram;

            $fields = array_keys($insertData);
            $placeholders = array_map(function($f) { return ':' . $f; }, $fields);

            $sqlInsert = "INSERT INTO company (" . implode(", ", $fields) . ") VALUES (" . implode(", ", $placeholders) . ")";
            $stmtComp = $pdo->prepare($sqlInsert);

            $bindParams = [];
            foreach ($insertData as $k => $v) {
                $bindParams[':' . $k] = $v;
            }
            $stmtComp->execute($bindParams);
            $newId = (int)$pdo->lastInsertId();

            // Salva colaboradores se enviados
            if (isset($body['workers']) && is_array($body['workers'])) {
                foreach ($body['workers'] as $w) {
                    $uId = isset($w['idUser']) ? (int)$w['idUser'] : (isset($w['userId']) ? (int)$w['userId'] : null);
                    if ($uId && $uId > 0) {
                        $stmtW = $pdo->prepare("INSERT INTO companyWorker (companyId, userId, statusId, isBlocked, created_at, updated_at) VALUES (:cId, :uId, 1, 0, NOW(), NOW())");
                        $stmtW->execute([':cId' => $newId, ':uId' => $uId]);
                    }
                }
            }

            $pdo->commit();
            echo $this->returnSuccess("Empresa cadastrada com sucesso!", ['id' => $newId]);
        } catch (Exception $e) {
            $pdo->rollBack();
            throw $e;
        }
    }

    /**
     * Atualizar empresa existente (PUT /company)
     */
    private function handleUpdate(?int $paramId)
    {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true) ?: $_POST;

        $id = $paramId ?: (isset($body['id']) && is_numeric($body['id']) ? (int)$body['id'] : null);
        if (!$id) {
            throw new Exception("ID da empresa não informado para edição");
        }

        $fantasyName = trim($body['fantasyName'] ?? ($body['name'] ?? ''));
        $name = trim($body['name'] ?? $fantasyName);
        $document = preg_replace('/\D/', '', $body['document'] ?? '');
        $phone = preg_replace('/\D/', '', $body['phone'] ?? '');
        $email = trim($body['email'] ?? '');
        $address = trim($body['address'] ?? '');
        $cityId = isset($body['cityId']) && is_numeric($body['cityId']) ? (int)$body['cityId'] : null;
        $billingDay = isset($body['billingDay']) && is_numeric($body['billingDay']) ? (int)$body['billingDay'] : 0;
        $voucherLimit = isset($body['voucherLimit']) ? (float)$body['voucherLimit'] : 0;
        $observation = trim($body['observation'] ?? '');
        $registration = trim($body['registration'] ?? '');
        $site = trim($body['site'] ?? '');
        $facebook = trim($body['facebook'] ?? '');
        $instagram = trim($body['instagram'] ?? '');

        $cols = $this->getCompanyColumns();
        $updateFields = [
            'name = :name',
            'fantasyName = :fantasyName',
            'document = :document',
            'phone = :phone',
            'email = :email',
            'address = :address',
            'updated_at = NOW()'
        ];
        $params = [
            ':id' => $id,
            ':name' => $name,
            ':fantasyName' => $fantasyName,
            ':document' => $document,
            ':phone' => $phone,
            ':email' => $email,
            ':address' => $address,
        ];

        if ($cityId) {
            $updateFields[] = 'cityId = :cityId';
            $params[':cityId'] = $cityId;
        }
        if (isset($cols['billingday'])) {
            $updateFields[] = 'billingDay = :billingDay';
            $params[':billingDay'] = $billingDay;
        }
        if (isset($cols['voucherlimit'])) {
            $updateFields[] = 'voucherLimit = :voucherLimit';
            $params[':voucherLimit'] = $voucherLimit;
        }
        if (isset($cols['observation'])) {
            $updateFields[] = 'observation = :observation';
            $params[':observation'] = $observation;
        }
        if (isset($cols['registration'])) {
            $updateFields[] = 'registration = :registration';
            $params[':registration'] = $registration;
        }
        if (isset($cols['site'])) {
            $updateFields[] = 'site = :site';
            $params[':site'] = $site;
        }
        if (isset($cols['facebook'])) {
            $updateFields[] = 'facebook = :facebook';
            $params[':facebook'] = $facebook;
        }
        if (isset($cols['instagram'])) {
            $updateFields[] = 'instagram = :instagram';
            $params[':instagram'] = $instagram;
        }

        $sqlUpdate = "UPDATE company SET " . implode(", ", $updateFields) . " WHERE id = :id";
        GenericDao::execute($sqlUpdate, $params);

        echo $this->returnSuccess("Empresa atualizada com sucesso!", ['id' => $id]);
    }

    /**
     * Excluir empresa (DELETE /company/{id})
     */
    private function handleDelete(?int $id)
    {
        if (!$id) {
            throw new Exception("ID da empresa não informado");
        }

        GenericDao::execute("UPDATE company SET statusId = 2, updated_at = NOW() WHERE id = :id", [':id' => $id]);
        echo $this->returnSuccess("Pessoa jurídica excluída com sucesso!", ['id' => $id]);
    }

    /**
     * Cache em memória das colunas existentes na tabela company
     */
    private function getCompanyColumns(): array
    {
        static $cols = null;
        if ($cols === null) {
            $cols = [];
            try {
                $rawCols = GenericDao::query("SHOW COLUMNS FROM company");
                foreach ($rawCols as $rc) {
                    if (isset($rc['Field'])) {
                        $cols[strtolower($rc['Field'])] = true;
                    }
                }
            } catch (Exception $e) {
                // Se falhar SHOW COLUMNS, usa as colunas padrão
                $cols = [
                    'id' => true, 'name' => true, 'fantasyname' => true, 'document' => true,
                    'phone' => true, 'email' => true, 'address' => true, 'cityid' => true,
                    'balanceid' => true, 'companyregisterstatusid' => true, 'statusid' => true
                ];
            }
        }
        return $cols;
    }

    public function actionRegister()
    {
        $this->handleSave();
    }

    public function actionFieldCheck()
    {
        try {
            $field = $_GET['field'] ?? ($_POST['field'] ?? null);
            $value = $_GET['value'] ?? ($_POST['value'] ?? null);

            if ($field && $value) {
                $clean = preg_replace('/\D/', '', $value);
                $exists = GenericDao::first("SELECT id FROM company WHERE ({$field} = :val OR {$field} = :clean) AND statusId = 1 LIMIT 1", [
                    ':val' => $value,
                    ':clean' => $clean
                ]);
                if ($exists) {
                    throw new Exception("Esse {$field} já está sendo utilizado");
                }
            }

            echo $this->returnSuccess("Status do campo", true);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao verificar o campo");
        }
    }
}
