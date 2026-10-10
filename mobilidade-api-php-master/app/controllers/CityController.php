<?php

namespace app\controllers;
use app\dao\CityDao;
use app\services\CityConfigService;
use app\services\CityService;
use Exception;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 18/07/2018
 * Time: 14:18
 */
class CityController extends ApiController
{
    protected $cityDao;

    public function __construct()
    {
        $this->cityDao = new CityDao;
    }

    public function actionGetAll()
    {
        try {
            $cities = $this->cityDao->getByEstate($_GET['estado'] ?? null);
            $formatted = $this->formatCities($cities, false);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Lista de cidades',
                'data' => $formatted,
                'response' => $formatted,
                'errors' => null
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetConfig()
    {
        try {
            echo $this->returnSuccess("Configurações encontradas",
                (new CityConfigService)
                    ->findFully(
                        $this->request(false)
                    )
            );
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar configurações da cidade");
        }
    }

    public function actionConfig()
    {
        $this->actionGetConfig();
    }

    public function actionGetActives()
    {
        try {
            $cities = (new CityService)->findActives();
            $formatted = $this->formatCities($cities, false);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Cidades encontradas',
                'data' => $formatted,
                'response' => $formatted,
                'errors' => null
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar as cidades");
        }
    }

    public function actionActives()
    {
        $this->actionGetActives();
    }

    public function actionActivesFully()
    {
        try {
            $cities = (new CityService)->findActives();
            $formatted = $this->formatCities($cities, true);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Cidades encontradas',
                'data' => $formatted,
                'response' => $formatted,
                'errors' => null
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e, "Erro ao buscar as cidades ativas");
        }
    }

    private function formatCities($cities, bool $withPolygon = false)
    {
        $defaultCoords = [
            '1' => ['lat' => -23.5505, 'lng' => -46.6333, 'nome' => 'São Paulo'],
            '2' => ['lat' => -22.9068, 'lng' => -43.1729, 'nome' => 'Rio de Janeiro'],
            '3' => ['lat' => -3.7319,  'lng' => -38.5267, 'nome' => 'Fortaleza'],
            '4' => ['lat' => -12.9777, 'lng' => -38.5016, 'nome' => 'Salvador'],
        ];

        return array_values(array_map(function ($item) use ($defaultCoords, $withPolygon) {
            $c = is_object($item) ? get_object_vars($item) : (array)$item;
            $id = $c['id'] ?? $c['idCity'] ?? 1;
            $name = $c['nome'] ?? $c['name'] ?? 'Cidade';
            $cityId = (int)$id;

            $coords = $defaultCoords[(string)$id] ?? [
                'lat' => -3.7319,
                'lng' => -38.5267
            ];

            $lat = isset($c['latitude']) && is_numeric($c['latitude']) ? (float)$c['latitude'] : $coords['lat'];
            $lng = isset($c['longitude']) && is_numeric($c['longitude']) ? (float)$c['longitude'] : $coords['lng'];

            $dLat = 0.12;
            $dLng = 0.12;
            $p1 = ($lat - $dLat) . ' ' . ($lng - $dLng);
            $p2 = ($lat + $dLat) . ' ' . ($lng - $dLng);
            $p3 = ($lat + $dLat) . ' ' . ($lng + $dLng);
            $p4 = ($lat - $dLat) . ' ' . ($lng + $dLng);
            $defaultPolygon = "POLYGON(($p1,$p2,$p3,$p4,$p1))";

            $c['id'] = (string)$id;
            $c['idCity'] = (string)$id;
            $c['cityId'] = $cityId;
            $c['nome'] = $name;
            $c['name'] = $name;
            $c['shortName'] = $name;
            $c['estado'] = (string)($c['estado'] ?? $c['estateId'] ?? '1');
            $c['estateId'] = $c['estado'];
            $c['statusId'] = (string)($c['statusId'] ?? $c['active'] ?? '1');
            $c['active'] = $c['statusId'];

            if ($withPolygon || !empty($c['polygon'])) {
                if (empty($c['polygon']) || !is_string($c['polygon']) || strpos($c['polygon'], 'POLYGON((') === false) {
                    $c['polygon'] = $defaultPolygon;
                }
            }

            return (object)$c;
        }, (array)$cities));
    }
}