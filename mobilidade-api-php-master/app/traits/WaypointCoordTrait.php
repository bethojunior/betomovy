<?php

namespace app\traits;

trait WaypointCoordTrait
{
    /**
     * Converte um waypoint (objeto {latitude, longitude, ...} ou array) para string de coordenada.
     *
     * @param mixed  $wp     Waypoint: stdClass com latitude/longitude, array associativo, ou array [lat, lng]
     * @param string $format 'lat,lng' (Google) ou 'lng,lat' (Mapbox)
     */
    protected function waypointToCoord($wp, string $format = 'lat,lng'): string
    {
        if (is_object($wp) && isset($wp->latitude, $wp->longitude)) {
            return $format === 'lng,lat'
                ? "{$wp->longitude},{$wp->latitude}"
                : "{$wp->latitude},{$wp->longitude}";
        }

        if (is_array($wp) && isset($wp['latitude'], $wp['longitude'])) {
            return $format === 'lng,lat'
                ? "{$wp['longitude']},{$wp['latitude']}"
                : "{$wp['latitude']},{$wp['longitude']}";
        }

        // Fallback: formato legado [lat, lng] (array simples ou objeto sem latitude/longitude)
        if (is_object($wp)) {
            $wp = get_object_vars($wp);
        }

        $coords = array_values(array_slice((array)$wp, 0, 2));
        return $format === 'lng,lat'
            ? implode(',', array_reverse($coords))
            : implode(',', $coords);
    }
}
