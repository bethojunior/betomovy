<?php

namespace app\controllers;

use app\services\AcquirerService;
use app\validator\AcquirerValidator;
use app\utils\Connection;
use Exception;
use PDO;

class AcquirerController extends ApiController
{
    private AcquirerService $acquirerService;

    public function __construct()
    {
        $this->acquirerService = new AcquirerService();
    }

    public function actionIndex()
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $id = $_GET['id'] ?? null;

        if ($method === 'PUT' || ($method === 'POST' && !empty($id))) {
            $this->actionUpdate();
            return;
        }

        $this->actionList();
    }

    public function actionList()
    {
        try {
            $defaultAcquirers = [
                [
                    'idFinancialIntermediary' => 1,
                    'name' => 'Mercado Pago',
                    'active' => 1,
                    'acquirer_meta_data' => [
                        [
                            'financialIntermediaryId' => 1,
                            'key' => 'public_key',
                            'description' => 'Chave Pública (Public Key)',
                            'value' => 'APP_USR-6725345719379685-101214-sample-public-key'
                        ],
                        [
                            'financialIntermediaryId' => 1,
                            'key' => 'access_token',
                            'description' => 'Token de Acesso (Access Token)',
                            'value' => 'APP_USR-6725345719379685-101214-sample-access-token'
                        ]
                    ]
                ],
                [
                    'idFinancialIntermediary' => 2,
                    'name' => 'Cielo',
                    'active' => 0,
                    'acquirer_meta_data' => [
                        [
                            'financialIntermediaryId' => 2,
                            'key' => 'merchant_id',
                            'description' => 'Merchant ID',
                            'value' => ''
                        ],
                        [
                            'financialIntermediaryId' => 2,
                            'key' => 'merchant_key',
                            'description' => 'Merchant Key',
                            'value' => ''
                        ]
                    ]
                ],
                [
                    'idFinancialIntermediary' => 3,
                    'name' => 'Rede',
                    'active' => 0,
                    'acquirer_meta_data' => [
                        [
                            'financialIntermediaryId' => 3,
                            'key' => 'pv',
                            'description' => 'PV',
                            'value' => ''
                        ],
                        [
                            'financialIntermediaryId' => 3,
                            'key' => 'token',
                            'description' => 'Token',
                            'value' => ''
                        ]
                    ]
                ],
                [
                    'idFinancialIntermediary' => 4,
                    'name' => 'PagSeguro / PagBank',
                    'active' => 0,
                    'acquirer_meta_data' => [
                        [
                            'financialIntermediaryId' => 4,
                            'key' => 'email',
                            'description' => 'E-mail PagSeguro',
                            'value' => ''
                        ],
                        [
                            'financialIntermediaryId' => 4,
                            'key' => 'token',
                            'description' => 'Token PagSeguro',
                            'value' => ''
                        ]
                    ]
                ],
                [
                    'idFinancialIntermediary' => 5,
                    'name' => 'Stone / Pagar.me',
                    'active' => 0,
                    'acquirer_meta_data' => [
                        [
                            'financialIntermediaryId' => 5,
                            'key' => 'api_key',
                            'description' => 'API Key',
                            'value' => ''
                        ],
                        [
                            'financialIntermediaryId' => 5,
                            'key' => 'encryption_key',
                            'description' => 'Encryption Key',
                            'value' => ''
                        ]
                    ]
                ],
                [
                    'idFinancialIntermediary' => 6,
                    'name' => 'Stripe',
                    'active' => 0,
                    'acquirer_meta_data' => [
                        [
                            'financialIntermediaryId' => 6,
                            'key' => 'publishable_key',
                            'description' => 'Publishable Key',
                            'value' => ''
                        ],
                        [
                            'financialIntermediaryId' => 6,
                            'key' => 'secret_key',
                            'description' => 'Secret Key',
                            'value' => ''
                        ]
                    ]
                ]
            ];

            $acquirers = $defaultAcquirers;

            try {
                $pdo = Connection::getConnection(Connection::DB_MYSQL_RO);
                $stmt = $pdo->query("SELECT * FROM financialIntermediary ORDER BY idFinancialIntermediary ASC");
                $dbIntermediaries = $stmt ? $stmt->fetchAll(PDO::FETCH_ASSOC) : [];

                if (!empty($dbIntermediaries)) {
                    $acquirers = [];
                    foreach ($dbIntermediaries as $di) {
                        $fId = (int)$di['idFinancialIntermediary'];
                        $stmtMeta = $pdo->prepare("SELECT * FROM financialIntermediaryMetadata WHERE financialIntermediaryId = :fId");
                        $stmtMeta->execute([':fId' => $fId]);
                        $metaRows = $stmtMeta->fetchAll(PDO::FETCH_ASSOC);

                        $metaData = [];
                        foreach ($metaRows as $mr) {
                            $metaData[] = [
                                'financialIntermediaryId' => $fId,
                                'key' => $mr['key'] ?? $mr['name'] ?? '',
                                'description' => $mr['description'] ?? $mr['key'] ?? '',
                                'value' => $mr['value'] ?? ''
                            ];
                        }

                        $acquirers[] = [
                            'idFinancialIntermediary' => $fId,
                            'name' => $di['name'] ?? 'Adquirente',
                            'active' => (int)($di['active'] ?? 0),
                            'acquirer_meta_data' => $metaData
                        ];
                    }
                }
            } catch (\Throwable $t) {
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Adquirentes listadas com sucesso',
                'data' => $acquirers,
                'response' => $acquirers,
                'errors' => null
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionUpdate()
    {
        try {
            $id = (int)($_GET['id'] ?? 1);
            $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
            $metadata = $input['metadata'] ?? [];

            try {
                $pdo = Connection::getConnection(Connection::DB_MYSQL_RW);
                $pdo->query("UPDATE financialIntermediary SET active = 0");
                $stmtAct = $pdo->prepare("UPDATE financialIntermediary SET active = 1 WHERE idFinancialIntermediary = :id");
                $stmtAct->execute([':id' => $id]);

                if (!empty($metadata) && is_array($metadata)) {
                    foreach ($metadata as $item) {
                        $key = $item['key'] ?? '';
                        $val = $item['value'] ?? '';
                        if (!empty($key)) {
                            $stmtSave = $pdo->prepare("
                                INSERT INTO financialIntermediaryMetadata (financialIntermediaryId, `key`, `value`) 
                                VALUES (:fId, :key, :val)
                                ON DUPLICATE KEY UPDATE `value` = :valUpdate
                            ");
                            $stmtSave->execute([
                                ':fId' => $id,
                                ':key' => $key,
                                ':val' => $val,
                                ':valUpdate' => $val
                            ]);
                        }
                    }
                }
            } catch (\Throwable $t) {
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Adquirente alterada com sucesso!',
                'data' => true,
                'response' => ['Adquirente alterada com sucesso!'],
                'errors' => null
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionCurrent()
    {
        try {
            $request = $this->request(false);
            
            AcquirerValidator::validate($request);
            
            $acquirer = $this->acquirerService->getActiveAcquirerData(
                $request->payment_form_id,
                $request->city_id
            );

            $acquirer->setConfigs([]);

            echo $this->returnSuccess('Sucesso ao buscar adquirente ativo', $acquirer->toArray());
        } catch (\Exception $e) {
            echo $this->returnError($e, 'Erro ao buscar adquirente ativo', 400);
        }
    }
}
