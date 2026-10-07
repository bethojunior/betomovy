<?php


namespace app\commands;

use app\dao\LocationDao;
use app\dao\TripRouteTracingDao;
use app\model\TripRouteTracing;
use app\utils\Command;
use Exception;
use Polyline;

class SaveRouteTracingCommand extends Command
{
    private $tripRouteTracingDao;
    private $locationDao;

    public function __construct($params = null)
    {
        parent::__construct($params);
        $this->tripRouteTracingDao = new TripRouteTracingDao;
        $this->locationDao = new LocationDao;
    }

    public function handle(): void
    {
        $tripReference = $this->params[2] ?? '';

        error_log("[SaveRouteTracing] iniciando trip={$tripReference}");

        try {
            $nodeLocations = $this->locationDao->getByTripFromNode($tripReference);
            $phpLocations  = count($nodeLocations) > 0
                ? []
                : $this->locationDao->getByTrip($tripReference);
            $locations     = array_merge($phpLocations, $nodeLocations);

            error_log("[SaveRouteTracing] trip={$tripReference} php=" . count($phpLocations) . " node=" . count($nodeLocations) . " total=" . count($locations));

            $tracing  = $this->encodeLocations($locations);
            $existing = $this->tripRouteTracingDao->findByTrip($tripReference);

            error_log("[SaveRouteTracing] trip={$tripReference} tracing_len=" . strlen($tracing) . " existing=" . (!empty($existing) ? 'sim' : 'nao'));

            if (!empty($existing)) {
                $this->tripRouteTracingDao->updateRoute($tripReference, $tracing);
                error_log("[SaveRouteTracing] trip={$tripReference} UPDATE OK");
                return;
            }

            $tripRouteTracing = new TripRouteTracing();
            $tripRouteTracing->setTripReference($tripReference);
            $tripRouteTracing->setTracing($tracing);

            $this->tripRouteTracingDao->sqlInsert($tripRouteTracing);
            error_log("[SaveRouteTracing] trip={$tripReference} INSERT OK");
        } catch (Exception $e) {
            error_log("[SaveRouteTracing] ERRO trip={$tripReference}: " . $e->getMessage());
            echo "Erro ao salvar rota: " . $e->getMessage();
        }
    }

    public function encodeLocations(array $locations)
    {
        $points = [];

        foreach ($locations as $position) {
            $lat = is_array($position) ? ($position['latitude'] ?? null) : ($position->latitude ?? null);
            $lng = is_array($position) ? ($position['longitude'] ?? null) : ($position->longitude ?? null);

            if ($lat === null || $lng === null || $lat == 0 || $lng == 0) continue;

            $points[] = [(float) $lat, (float) $lng];
        }

        return Polyline::encode($points);
    }
}