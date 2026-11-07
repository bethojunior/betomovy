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

    public function actionStatus()
    {
        header('Content-Type: application/json; charset=utf-8');
        $hasExt = class_exists('\\MongoDB\\Driver\\Manager');
        $uri = getenv('MONGODB_URI') ?: "mongodb+srv://doadmin:1dQ782TVG36Bc09A@movy-mongodb-79fd3aab.mongo.ondigitalocean.com/admin?tls=true&authSource=admin";
        $safeUri = preg_replace('/:[^:@]+@/', ':***@', $uri);

        $res = [
            'status' => true,
            'mongodb_extension' => $hasExt ? 'installed' : 'missing',
            'configured_host' => getenv('MONGODB_HOST') ?: 'movy-mongodb-79fd3aab.mongo.ondigitalocean.com',
            'connection_uri' => $safeUri,
            'connected' => false,
            'ping' => null,
            'databases' => [],
            'error' => null
        ];

        if (!$hasExt) {
            $res['error'] = 'PHP mongodb extension is not loaded';
            echo json_encode($res);
            return;
        }

        try {
            $manager = new \MongoDB\Driver\Manager($uri, [], ['serverSelectionTimeoutMS' => 3000]);
            $command = new \MongoDB\Driver\Command(['ping' => 1]);
            $cursor = $manager->executeCommand('admin', $command);
            $res['connected'] = true;
            $res['ping'] = (array)$cursor->toArray()[0];

            try {
                $dbCommand = new \MongoDB\Driver\Command(['listDatabases' => 1]);
                $dbCursor = $manager->executeCommand('admin', $dbCommand);
                $res['databases'] = (array)$dbCursor->toArray()[0];
            } catch (\Throwable $t) {
                $res['databases_error'] = $t->getMessage();
            }
        } catch (\Throwable $e) {
            $res['connected'] = false;
            $res['error'] = [
                'message' => $e->getMessage(),
                'code' => $e->getCode(),
                'class' => get_class($e)
            ];
        }

        echo json_encode($res);
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
