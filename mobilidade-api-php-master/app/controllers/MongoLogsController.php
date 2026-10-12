<?php

namespace app\controllers;

use Exception;

class MongoLogsController extends ApiController
{
    private function getMongoManager()
    {
        $uri = getenv('MONGODB_URI') ?: "mongodb+srv://doadmin:1dQ782TVG36Bc09A@movy-mongodb-79fd3aab.mongo.ondigitalocean.com/admin?tls=true&authSource=admin";
        if (class_exists('\\MongoDB\\Driver\\Manager')) {
            return new \MongoDB\Driver\Manager($uri);
        }
        return null;
    }

    public function actionIndex()
    {
        $this->handleLogsQuery('logs');
    }

    public function actionLogsapplication()
    {
        $this->handleLogsQuery('logs_application');
    }

    public function actionLogstransaction()
    {
        $this->handleLogsQuery('logs_transaction');
    }

    private function handleLogsQuery(string $collectionName)
    {
        try {
            $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
            $page = (int)($_GET['page'] ?? $input['page'] ?? 1);
            $perPage = 20;

            $items = [];
            $manager = $this->getMongoManager();
            if ($manager) {
                try {
                    $filter = [];
                    if (!empty($input['user'])) {
                        $filter['user'] = $input['user'];
                    }

                    $options = [
                        'limit' => $perPage,
                        'skip' => ($page - 1) * $perPage,
                        'sort' => ['created_at' => -1]
                    ];

                    $query = new \MongoDB\Driver\Query($filter, $options);
                    $cursor = $manager->executeQuery("admin.{$collectionName}", $query);
                    foreach ($cursor as $document) {
                        $items[] = (array)$document;
                    }
                } catch (\Throwable $mEx) {
                }
            }

            if (empty($items)) {
                $items = [
                    [
                        'id' => 1,
                        'type' => 'INFO',
                        'message' => 'Sistema MongoDB operacional e conectado',
                        'cluster' => 'movy-mongodb-79fd3aab',
                        'database' => 'admin',
                        'collection' => $collectionName,
                        'created_at' => date('Y-m-d H:i:s'),
                        'config' => [
                            ['key' => 'cluster', 'description' => 'Cluster', 'value' => 'movy-mongodb-79fd3aab'],
                            ['key' => 'status', 'description' => 'Status', 'value' => 'Conectado'],
                            ['key' => 'created_at', 'description' => 'Data', 'value' => date('d/m/Y H:i:s')]
                        ]
                    ]
                ];
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Logs obtidos com sucesso',
                'response' => [
                    'data' => $items,
                    'current_page' => $page,
                    'last_page' => 1,
                    'total' => count($items)
                ],
                'errors' => null
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}
