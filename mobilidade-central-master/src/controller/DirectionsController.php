<?php

class DirectionsController
{
    private const MAPBOX_DIRECTIONS_URL = 'https://api.mapbox.com/directions/v5/mapbox/driving';
    private const GEOMETRY_FORMAT = 'polyline';

    public function actionDirection()
    {
        $request = json_decode(file_get_contents('php://input'));

        $token = $request->key ?? '';

        if (!$token) {
            $this->respondJson(['routes' => [], 'error' => 'Mapbox token not provided'], 400);
            return;
        }

        $coordinates = $this->getCoordinatesFromRequest($request);

        if (count($coordinates) < 2) {
            $this->respondJson(['routes' => [], 'error' => 'Invalid coordinates'], 400);
            return;
        }

        $result = $this->requestMapbox($this->buildDirectionsUrl($coordinates, $token));

        if (!$result['status']) {
            $this->respondJson(['routes' => [], 'error' => $result['error']]);
            return;
        }

        $data = json_decode($result['body'], true);

        if (!is_array($data)) {
            $this->respondJson(['routes' => [], 'error' => 'Invalid Mapbox response']);
            return;
        }

        $this->respondJson($this->normalizeMapboxResponse($data));
    }

    private function getCoordinatesFromRequest($request)
    {
        $coordinates = array_merge(
            [$request->origin ?? ''],
            $this->parseWaypoints($request->waypoints ?? ''),
            [$request->destination ?? '']
        );

        return array_values(array_filter(array_map([$this, 'toMapboxCoordinate'], $coordinates)));
    }

    private function buildDirectionsUrl(array $coordinates, string $token): string
    {
        return self::MAPBOX_DIRECTIONS_URL
            . '/' . implode(';', $coordinates)
            . '?' . http_build_query([
                'geometries' => self::GEOMETRY_FORMAT,
                'overview' => 'full',
                'access_token' => $token,
            ]);
    }

    private function requestMapbox(string $url): array
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $body = curl_exec($ch);
        $error = curl_error($ch);
        curl_close($ch);

        if ($body === false) {
            return ['status' => false, 'error' => $error ?: 'Mapbox request failed'];
        }

        return ['status' => true, 'body' => $body];
    }

    private function normalizeMapboxResponse(array $data): array
    {
        if (!isset($data['routes']) || count($data['routes']) === 0) {
            return ['routes' => [], 'error' => $data['message'] ?? 'No route found'];
        }

        $route = $data['routes'][0];

        return [
            'routes' => [[
                'overview_polyline' => [
                    'points' => $route['geometry'] ?? '',
                ],
                'duration' => $route['duration'] ?? 0,
                'distance' => $route['distance'] ?? 0,
            ]],
        ];
    }

    private function respondJson(array $payload, int $statusCode = 200): void
    {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($payload);
    }

    private function parseWaypoints($waypoints)
    {
        if (is_array($waypoints)) {
            return $waypoints;
        }

        if (!is_string($waypoints) || trim($waypoints) === '') {
            return [];
        }

        return array_filter(explode('|', $waypoints));
    }

    private function toMapboxCoordinate($coordinate)
    {
        if (is_object($coordinate)) {
            $lat = $coordinate->lat ?? $coordinate->latitude ?? '';
            $lng = $coordinate->lng ?? $coordinate->longitude ?? '';
            $coordinate = $lat . ',' . $lng;
        }

        if (is_array($coordinate)) {
            $lat = $coordinate['lat'] ?? $coordinate['latitude'] ?? '';
            $lng = $coordinate['lng'] ?? $coordinate['longitude'] ?? '';
            $coordinate = $lat . ',' . $lng;
        }

        $parts = explode(',', (string) $coordinate);

        if (count($parts) < 2) {
            return null;
        }

        $lat = trim($parts[0]);
        $lng = trim($parts[1]);

        if (!is_numeric($lat) || !is_numeric($lng)) {
            return null;
        }

        // Mapbox Directions API espera "lng,lat".
        return $lng . ',' . $lat;
    }
}
