<?php

namespace app\dao;

use app\constant\RedisKeysConst;
use app\utils\BaseDao;
use app\utils\Headers;
use app\model\Location;
use Exception;
use app\utils\RedisUtil;

/**
 * Refactored by BETHO : THE ETERNAL ROMANCE
 */
class LocationDao extends BaseDao
{

    // comentário feito por BETHO : THE ETERNAL ROMANCE. não apagar
    // esse serviço foi descontinuado, mas o código foi mantido pois o app ainda acessa a rota
    // pq foi desconitinuado? PORQUE JÁ EXISTE ESSA MESMA LÓGICA IMPLEMENTADA NO SEARCH-TRIP NA API-NODE
    // noSqlInsert restaurado: SaveRouteTracingCommand depende do histórico em Redis para gerar polyline
    private const LOCATION_HISTORY_TTL = 172800; // 48h — cobre qualquer viagem + margem para o command rodar

    /**
     * @deprecated A API Node agora é responsável por atualizar last_lat/last_lon do motorista
     * (via canal de socket driver.location, com o mesmo throttle 15s/50m). Manter os dois lados
     * gravando gera carga duplicada no MySQL. O noSqlInsert() abaixo continua rodando pois
     * SaveRouteTracingCommand depende desse histórico para gerar o polyline da viagem.
     */
    public function insert(Location $location): bool
    {
        $this->noSqlInsert($location->toStdClass(), 'location', self::LOCATION_HISTORY_TTL);
        return true;
    }

    public function updateDriverLocation(Location $location)
    {
        return (new DriverDao)->sqlUpdate([
            'last_lat' => ':latitude',
            'last_lon' => ':longitude',
            'last_position_update' => ':now'
        ], [
            ['idDriver', '=', ':driverId']
        ], [
            ':latitude' => $location->getLatitude(),
            ':longitude' => $location->getLongitude(),
            ':now' => now(),
            ':driverId' => $location->getDriverId(),
        ]);
    }

    /**
     * @param \app\model\Location $location
     * @return bool
     * @throws Exception
     */
    public function insertWithoutValidation(Location $location)
    {

        $redis = new RedisUtil();
        $cacheKey = RedisKeysConst::returnDriverLocationKey($location->getDriverId());

        $isFirstExecution = $redis->set($cacheKey, true, 60, ['nx' => true]);

        $this->noSqlInsert($location->toStdClass());

        if ($isFirstExecution) {
            $this->updateDriverLocation($location);
        }
    }

    /**
     * @param $driverId
     * @return array
     * @throws Exception
     */
    public function getDriverLocation($driverId)
    {
        try {

            return $this->noSqlSelect([
                'driverId' => $driverId
            ], [
                'limit' => 1,
                'sort' => ['created_at' => -1],
                'projection' => [
                    '_id' => 0,
                    'latitude' => 1,
                    'longitude' => 1
                ]
            ])[0] ?? [];
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $tripReference
     * @return array
     * @throws Exception
     */
    public function getByTrip($tripReference): array
    {
        try {
            return $this->noSqlSelect(
                ['tripReference' => $tripReference],
                [],
                'location'
            );
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Salva posição GPS no mesmo formato/chave que o Node usa em /location/route.
     * Garante que SaveRouteTracingCommand encontre as posições mesmo em localdev (onde o app
     * manda /location/route para o PHP por causa da porta fixa 8101 no UrlBuilder do app).
     */
    public function saveRoutePosition(string $tripReference, float $lat, float $lng, ?int $driverId): void
    {
        try {
            $this->checkRedisConn();
            $nodePrefix = "app:{$this->databaseName}:node:";
            $listKey    = "{$nodePrefix}trip:{$tripReference}:positions";
            $payload    = json_encode([
                'latitude'       => $lat,
                'longitude'      => $lng,
                'driverId'       => $driverId,
                'tripReference'  => $tripReference,
                'deviceModel'    => 'route-php',
                'created_at'     => date('Y-m-d\TH:i:s.000\Z'),
            ]);
            $this->redis->rpush($listKey, [$payload]);
            $this->redis->expire($listKey, self::LOCATION_HISTORY_TTL);
        } catch (Exception $e) {
            error_log("[saveRoutePosition] ERRO Redis trip={$tripReference}: " . $e->getMessage());
        }
    }

    /**
     * Lê posições GPS salvas pelo serviço Node.js durante /location/route.
     * Node usa REDIS_PREFIX=app:{db}:node: então a chave real é app:{db}:node:trip:{ref}:positions
     */
    public function getByTripFromNode(string $tripReference): array
    {
        $this->checkRedisConn();
        $nodePrefix = "app:{$this->databaseName}:node:";
        $listKey    = "{$nodePrefix}trip:{$tripReference}:positions";

        try {
            $items = $this->redis->lrange($listKey, 0, -1);
            return array_map(fn($item) => json_decode($item, true), $items);
        } catch (Exception $e) {
            return [];
        }
    }

    /**
     * @param Location $location
     * @throws Exception
     */
    public function insertByUser(Location $location)
    {
        $this->validateInsertUserLocation($location);

        $this->noSqlInsert($location->toStdClass());

        if (Headers::getUserId()) (new UserDao)
            ->updateLocation($location, Headers::getUserId());
    }

    /**
     * @param \app\model\Location $location
     * @throws Exception
     */
    private function validateInsertLocation(Location $location)
    {
        if (!$location->getLatitude())
            throw new Exception("Latitude não pode ser vazia");

        if (!$location->getLongitude())
            throw new Exception("Longitude não pode ser vazia");

        if (!$location->getDriverId())
            throw new Exception("DriverId não pode ser vazio");
    }

    /**
     * @param Location $location
     * @throws Exception
     */
    private function validateInsertUserLocation(Location $location)
    {
        if (!$location->getLatitude())
            throw new Exception("Latitude não pode ser vazia");

        if (!$location->getLongitude())
            throw new Exception("Longitude não pode ser vazia");
    }
}
