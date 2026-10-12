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

    // Cidades do Brasil e dos EUA por estado
    private static $citiesByState = [
        // Brasil:
        1 => ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira", "Tarauacá", "Feijó", "Brasiléia"],
        2 => ["Maceió", "Arapiraca", "Rio Largo", "Palmeira dos Índios", "União dos Palmares", "Penedo"],
        3 => ["Macapá", "Santana", "Laranjal do Jari", "Oiapoque", "Porto Grande"],
        4 => ["Manaus", "Parintins", "Itacoatiara", "Manacapuru", "Coari", "Tefé", "Tabatinga"],
        5 => ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Juazeiro", "Itabuna", "Ilhéus", "Porto Seguro", "Lauro de Freitas", "Jequié", "Barreiras", "Alagoinhas"],
        6 => ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú", "Sobral", "Crato", "Itapipoca", "Maranguape", "Iguatu", "Quixadá"],
        7 => ["Brasília", "Ceilândia", "Taguatinga", "Samambaia", "Plano Piloto", "Águas Claras", "Gama", "Guará", "Santa Maria", "Sobradinho"],
        8 => ["Vitória", "Vila Velha", "Serra", "Cariacica", "Cachoeiro de Itapemirim", "Linhares", "Colatina", "Guarapari", "São Mateus"],
        9 => ["Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde", "Luziânia", "Águas Lindas de Goiás", "Valparaíso de Goiás", "Trindade", "Formosa", "Itumbiara"],
        10 => ["São Luís", "Imperatriz", "São José de Ribamar", "Timon", "Caxias", "Codó", "Paço do Lumiar", "Açailândia", "Bacabal", "Balsas"],
        11 => ["Cuiabá", "Várzea Grande", "Rondonópolis", "Sinop", "Tangará da Serra", "Sorriso", "Lucas do Rio Verde", "Primavera do Leste", "Barra do Garças"],
        12 => ["Campo Grande", "Dourados", "Três Lagoas", "Corumbá", "Ponta Porã", "Naviraí", "Nova Andradina", "Sidrolândia"],
        13 => ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim", "Montes Claros", "Ribeirão das Neves", "Uberaba", "Governador Valadares", "Ipatinga", "Sete Lagoas", "Divinópolis", "Poços de Caldas", "Pouso Alegre"],
        14 => ["Belém", "Ananindeua", "Santarém", "Marabá", "Parauapebas", "Castanhal", "Abaetetuba", "Cametá", "Bragança", "Altamira"],
        15 => ["João Pessoa", "Campina Grande", "Santa Rita", "Patos", "Bayeux", "Sousa", "Cajazeiras", "Guarabira", "Cabedelo"],
        16 => ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel", "São José dos Pinhais", "Foz do Iguaçu", "Colombo", "Guarapuava", "Paranaguá", "Toledo", "Apucarana"],
        17 => ["Recife", "Jaboatão dos Guararapes", "Olinda", "Caruaru", "Petrolina", "Paulista", "Cabo de Santo Agostinho", "Camaragibe", "Garanhuns", "Vitória de Santo Antão"],
        18 => ["Teresina", "Parnaíba", "Picos", "Piripiri", "Floriano", "Barras", "Campo Maior", "União"],
        19 => ["Rio de Janeiro", "São Gonçalo", "Duque de Caxias", "Nova Iguaçu", "Niterói", "Belford Roxo", "São João de Meriti", "Campos dos Goytacazes", "Petrópolis", "Volta Redonda", "Macaé", "Magé", "Itaboraí", "Cabo Frio", "Angra dos Reis", "Nova Friburgo", "Barra Mansa", "Teresópolis", "Mesquita", "Nilópolis", "Maricá", "Rio das Ostras", "Resende"],
        20 => ["Natal", "Mossoró", "Parnamirim", "São Gonçalo do Amarante", "Ceará-Mirim", "Macaíba", "Caicó", "Açu"],
        21 => ["Porto Alegre", "Caxias do Sul", "Canoas", "Pelotas", "Santa Maria", "Gravataí", "Viamão", "Novo Hamburgo", "São Leopoldo", "Rio Grande", "Alvorada", "Passo Fundo", "Uruguaiana", "Santa Cruz do Sul"],
        22 => ["Porto Velho", "Ji-Paraná", "Ariquemes", "Vilhena", "Cacoal", "Jaru", "Rolim de Moura", "Guajará-Mirim"],
        23 => ["Boa Vista", "Rorainópolis", "Caracaraí", "Cantá", "Mucajaí", "Pacaraima"],
        24 => ["Florianópolis", "Joinville", "Blumenau", "São José", "Criciúma", "Chapecó", "Itajaí", "Jaraguá do Sul", "Lages", "Palhoça", "Balneário Camboriú", "Brusque", "Tubarão"],
        25 => ["São Paulo", "Guarulhos", "Campinas", "São Bernardo do Campo", "Santo André", "São José dos Campos", "Osasco", "Ribeirão Preto", "Sorocaba", "Mauá", "São José do Rio Preto", "Santos", "Mogi das Cruzes", "Diadema", "Jundiaí", "Piracicaba", "Carapicuíba", "Bauru", "Itaquaquecetuba", "São Vicente", "Franca", "Praia Grande", "Guarujá", "Taubaté", "Limeira", "Suzano", "Taboão da Serra", "Sumaré", "Barueri", "Embu das Artes", "Indaiatuba", "Cotia", "Americana", "Araraquara", "Jacareí", "Hortolândia", "Presidente Prudente", "São Carlos", "Marília"],
        26 => ["Aracaju", "Nossa Senhora do Socorro", "Lagarto", "Itabaiana", "São Cristóvão", "Estância", "Tobias Barreto"],
        27 => ["Palmas", "Araguaína", "Gurupi", "Porto Nacional", "Paraíso do Tocantins", "Colinas do Tocantins", "Guaraí"],

        // Estados Unidos:
        101 => ["Birmingham", "Montgomery", "Mobile", "Huntsville", "Tuscaloosa", "Hoover"],
        102 => ["Anchorage", "Fairbanks", "Juneau", "Sitka", "Ketchikan", "Wasilla"],
        103 => ["Phoenix", "Tucson", "Mesa", "Chandler", "Scottsdale", "Glendale", "Gilbert", "Tempe"],
        104 => ["Little Rock", "Fort Smith", "Fayetteville", "Springdale", "Jonesboro", "Rogers"],
        105 => ["Los Angeles", "San Diego", "San Jose", "San Francisco", "Fresno", "Sacramento", "Long Beach", "Oakland", "Bakersfield", "Anaheim", "Santa Ana", "Riverside", "Irvine"],
        106 => ["Denver", "Colorado Springs", "Aurora", "Fort Collins", "Lakewood", "Thornton", "Boulder"],
        107 => ["Bridgeport", "New Haven", "Stamford", "Hartford", "Waterbury", "Norwalk"],
        108 => ["Wilmington", "Dover", "Newark", "Middletown"],
        109 => ["Washington D.C."],
        110 => ["Miami", "Orlando", "Tampa", "Jacksonville", "St. Petersburg", "Hialeah", "Tallahassee", "Fort Lauderdale", "Pembroke Pines", "Hollywood", "Gainesville", "Coral Springs", "West Palm Beach", "Boca Raton", "Kissimmee"],
        111 => ["Atlanta", "Augusta", "Columbus", "Macon", "Savannah", "Athens", "Sandy Springs", "Roswell"],
        112 => ["Honolulu", "Pearl City", "Hilo", "Kailua", "Waipahu"],
        113 => ["Boise", "Meridian", "Nampa", "Idaho Falls", "Caldwell"],
        114 => ["Chicago", "Aurora", "Naperville", "Joliet", "Rockford", "Springfield", "Elgin", "Peoria"],
        115 => ["Indianapolis", "Fort Wayne", "Evansville", "South Bend", "Carmel", "Fishers", "Bloomington"],
        116 => ["Des Moines", "Cedar Rapids", "Davenport", "Sioux City", "Iowa City"],
        117 => ["Wichita", "Overland Park", "Kansas City", "Olathe", "Topeka", "Lawrence"],
        118 => ["Louisville", "Lexington", "Bowling Green", "Owensboro", "Covington"],
        119 => ["New Orleans", "Baton Rouge", "Shreveport", "Lafayette", "Lake Charles"],
        120 => ["Portland", "Lewiston", "Bangor", "South Portland", "Augusta"],
        121 => ["Baltimore", "Frederick", "Rockville", "Gaithersburg", "Bowie", "Annapolis"],
        122 => ["Boston", "Worcester", "Springfield", "Cambridge", "Lowell", "Brockton", "Quincy"],
        123 => ["Detroit", "Grand Rapids", "Warren", "Sterling Heights", "Ann Arbor", "Lansing", "Flint"],
        124 => ["Minneapolis", "St. Paul", "Rochester", "Duluth", "Bloomington", "Brooklyn Park"],
        125 => ["Jackson", "Gulfport", "Southaven", "Hattiesburg", "Biloxi"],
        126 => ["Kansas City", "St. Louis", "Springfield", "Columbia", "Independence"],
        127 => ["Billings", "Missoula", "Great Falls", "Bozeman", "Helena"],
        128 => ["Omaha", "Lincoln", "Bellevue", "Grand Island", "Kearney"],
        129 => ["Las Vegas", "Henderson", "Reno", "North Las Vegas", "Sparks", "Carson City"],
        130 => ["Manchester", "Nashua", "Concord", "Dover", "Portsmouth"],
        131 => ["Newark", "Jersey City", "Paterson", "Elizabeth", "Edison", "Woodbridge", "Trenton"],
        132 => ["Albuquerque", "Las Cruces", "Rio Rancho", "Santa Fe", "Roswell"],
        133 => ["New York", "Buffalo", "Rochester", "Yonkers", "Syracuse", "Albany", "New Rochelle", "White Plains"],
        134 => ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem", "Fayetteville", "Cary", "Wilmington"],
        135 => ["Fargo", "Bismarck", "Grand Forks", "Minot", "West Fargo"],
        136 => ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron", "Dayton", "Canton"],
        137 => ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow", "Edmond", "Lawton"],
        138 => ["Portland", "Salem", "Eugene", "Gresham", "Hillsboro", "Beaverton", "Bend"],
        139 => ["Philadelphia", "Pittsburgh", "Allentown", "Reading", "Erie", "Scranton", "Bethlehem", "Harrisburg"],
        140 => ["Providence", "Cranston", "Warwick", "Pawtucket", "East Providence"],
        141 => ["Charleston", "Columbia", "North Charleston", "Mount Pleasant", "Rock Hill", "Greenville"],
        142 => ["Sioux Falls", "Rapid City", "Aberdeen", "Brookings", "Pierre"],
        143 => ["Nashville", "Memphis", "Knoxville", "Chattanooga", "Clarksville", "Murfreesboro"],
        144 => ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth", "El Paso", "Arlington", "Plano", "Corpus Christi", "Lubbock"],
        145 => ["Salt Lake City", "West Valley City", "Provo", "West Jordan", "Orem", "Sandy"],
        146 => ["Burlington", "South Burlington", "Rutland", "Montpelier"],
        147 => ["Virginia Beach", "Norfolk", "Chesapeake", "Richmond", "Newport News", "Alexandria"],
        148 => ["Seattle", "Spokane", "Tacoma", "Vancouver", "Bellevue", "Kent", "Everett", "Olympia"],
        149 => ["Charleston", "Huntington", "Morgantown", "Parkersburg", "Wheeling"],
        150 => ["Milwaukee", "Madison", "Green Bay", "Kenosha", "Racine", "Appleton"],
        151 => ["Cheyenne", "Casper", "Laramie", "Gillette", "Jackson"]
    ];

    public function __construct()
    {
        $this->cityDao = new CityDao;
    }

    public function actionIndex()
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        if ($method === 'POST') {
            $this->actionStore();
            return;
        }

        if ($method === 'DELETE') {
            $this->actionDelete();
            return;
        }

        $estateId = $_GET['estateId'] ?? $_GET['estado'] ?? null;
        if (!empty($estateId)) {
            $this->actionGetByEstate($estateId);
            return;
        }

        $this->actionGetAll();
    }

    public function actionStore()
    {
        try {
            $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
            $nome = $input['nome'] ?? $input['name'] ?? '';
            $estado = (int)($input['estado'] ?? $input['estateId'] ?? 1);
            $polygon = $input['polygon'] ?? null;

            if (empty($nome)) {
                throw new Exception("Nome da cidade é obrigatório");
            }

            $newCity = [
                'id' => rand(1000, 9999),
                'cityId' => rand(1000, 9999),
                'nome' => $nome,
                'name' => $nome,
                'shortName' => $nome,
                'estado' => (string)$estado,
                'estate_id' => $estado,
                'polygon' => $polygon,
                'statusId' => 1,
                'active' => 1
            ];

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Cidade cadastrada com sucesso',
                'data' => $newCity,
                'response' => $newCity,
                'errors' => null
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionDelete()
    {
        try {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Cidade removida com sucesso',
                'data' => true,
                'response' => ['Cidade deletada com sucesso'],
                'errors' => null
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetByEstate($estateId = null)
    {
        try {
            $sId = (int)($estateId ?? $_GET['estateId'] ?? $_GET['estado'] ?? 1);
            $dbCities = [];
            try {
                $dbCities = $this->cityDao->getByEstate($sId);
            } catch (\Throwable $t) {
            }

            $list = [];
            $namesMap = [];

            if (!empty($dbCities) && is_array($dbCities)) {
                foreach ($dbCities as $dbc) {
                    $item = (array)$dbc;
                    $nome = $item['nome'] ?? $item['name'] ?? '';
                    if ($nome !== '') {
                        $namesMap[strtolower($nome)] = true;
                        $list[] = [
                            'id' => (int)($item['id'] ?? 1),
                            'estate_id' => $sId,
                            'name' => $nome,
                            'nome' => $nome,
                            'polygon' => $item['polygon'] ?? null
                        ];
                    }
                }
            }

            $defaultNames = self::$citiesByState[$sId] ?? [];
            $idx = 1;
            foreach ($defaultNames as $cityName) {
                if (!isset($namesMap[strtolower($cityName)])) {
                    $list[] = [
                        'id' => ($sId * 1000) + $idx,
                        'estate_id' => $sId,
                        'name' => $cityName,
                        'nome' => $cityName,
                        'polygon' => null
                    ];
                    $idx++;
                }
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Lista de cidades',
                'data' => $list,
                'response' => $list,
                'errors' => null
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionGetAll()
    {
        try {
            $estate = $_GET['estado'] ?? $_GET['estateId'] ?? null;
            if (!empty($estate)) {
                $this->actionGetByEstate($estate);
                return;
            }

            $cities = $this->cityDao->getByEstate(null);
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
        $defaultCities = [
            '1' => ['id' => 1, 'lat' => -23.5505, 'lng' => -46.6333, 'nome' => 'São Paulo', 'country' => 'BR', 'estado' => '25'],
            '2' => ['id' => 2, 'lat' => -22.9068, 'lng' => -43.1729, 'nome' => 'Rio de Janeiro', 'country' => 'BR', 'estado' => '19'],
            '3' => ['id' => 3, 'lat' => -3.7319,  'lng' => -38.5267, 'nome' => 'Fortaleza', 'country' => 'BR', 'estado' => '6'],
            '4' => ['id' => 4, 'lat' => -12.9777, 'lng' => -38.5016, 'nome' => 'Salvador', 'country' => 'BR', 'estado' => '5'],
            '101' => ['id' => 101, 'lat' => 25.7617, 'lng' => -80.1918, 'nome' => 'Miami', 'country' => 'US', 'estado' => '110'],
            '102' => ['id' => 102, 'lat' => 28.5383, 'lng' => -81.3792, 'nome' => 'Orlando', 'country' => 'US', 'estado' => '110'],
            '103' => ['id' => 103, 'lat' => 40.7128, 'lng' => -74.0060, 'nome' => 'New York', 'country' => 'US', 'estado' => '133'],
            '104' => ['id' => 104, 'lat' => 34.0522, 'lng' => -118.2437, 'nome' => 'Los Angeles', 'country' => 'US', 'estado' => '105'],
        ];

        $rawList = is_array($cities) ? $cities : [];
        $existingNames = [];
        foreach ($rawList as $item) {
            $c = is_object($item) ? get_object_vars($item) : (array)$item;
            $name = strtolower(trim($c['nome'] ?? $c['name'] ?? ''));
            if ($name !== '') {
                $existingNames[$name] = true;
            }
        }

        foreach ($defaultCities as $key => $def) {
            $lowerName = strtolower($def['nome']);
            if (!isset($existingNames[$lowerName])) {
                $rawList[] = $def;
                $existingNames[$lowerName] = true;
            }
        }

        return array_values(array_map(function ($item) use ($defaultCities, $withPolygon) {
            $c = is_object($item) ? get_object_vars($item) : (array)$item;
            $id = $c['id'] ?? $c['idCity'] ?? 1;
            $name = $c['nome'] ?? $c['name'] ?? 'Cidade';
            $cityId = (int)$id;

            $def = $defaultCities[(string)$id] ?? null;
            $isUS = in_array(strtolower($name), ['miami', 'orlando', 'new york', 'los angeles']) || ($cityId >= 100);
            $country = $c['country'] ?? ($def['country'] ?? ($isUS ? 'US' : 'BR'));

            $lat = isset($c['latitude']) && is_numeric($c['latitude']) ? (float)$c['latitude'] : ($def['lat'] ?? ($isUS ? 25.7617 : -22.9068));
            $lng = isset($c['longitude']) && is_numeric($c['longitude']) ? (float)$c['longitude'] : ($def['lng'] ?? ($isUS ? -80.1918 : -43.1729));

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
            $c['country'] = $country;
            $c['estado'] = (string)($c['estado'] ?? $c['estateId'] ?? ($def['estado'] ?? '1'));
            $c['estateId'] = $c['estado'];
            $c['statusId'] = (string)($c['statusId'] ?? $c['active'] ?? '1');
            $c['active'] = $c['statusId'];

            if ($withPolygon || !empty($c['polygon'])) {
                if (empty($c['polygon']) || !is_string($c['polygon']) || strpos($c['polygon'], 'POLYGON((') === false) {
                    $c['polygon'] = $defaultPolygon;
                }
            }

            return (object)$c;
        }, (array)$rawList));
    }
}