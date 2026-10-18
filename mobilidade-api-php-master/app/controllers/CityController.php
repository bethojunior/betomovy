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
        $id = $_GET['id'] ?? null;

        if ($method === 'POST') {
            $this->actionStore();
            return;
        }

        if ($method === 'DELETE') {
            $this->actionDelete();
            return;
        }

        $uri = $_SERVER['REQUEST_URI'] ?? '';
        if (stripos($uri, 'tripTypes') !== false || stripos($uri, 'triptypes') !== false) {
            $this->actionTripTypes();
            return;
        }

        if (!empty($id) && is_numeric($id)) {
            $this->actionShow((int)$id);
            return;
        }

        $estateId = $_GET['estateId'] ?? $_GET['estado'] ?? null;
        if (!empty($estateId)) {
            $this->actionGetByEstate($estateId);
            return;
        }

        $this->actionGetAll();
    }

    public function actionShow($id)
    {
        try {
            $found = null;
            try {
                $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
                $stmt = $pdo->prepare("
                    SELECT 
                        c.id, c.nome, c.shortName, c.estado, c.active, c.statusId,
                        ST_AsText(ca.polygon) as polygon
                    FROM city c
                    LEFT JOIN cityArea ca ON (c.id = ca.cityId AND ca.statusId = 1)
                    WHERE c.id = :id
                    ORDER BY ca.id DESC
                    LIMIT 1
                ");
                $stmt->execute([':id' => $id]);
                $row = $stmt->fetch(\PDO::FETCH_ASSOC);
                if ($row) {
                    $found = $row;
                }
            } catch (\Throwable $e) {}

            if (!$found) {
                $allActives = (new \app\services\CityService)->findActives();
                $formatted = $this->formatCities($allActives, true);
                foreach ($formatted as $fc) {
                    if ((int)$fc->id === (int)$id || (int)$fc->cityId === (int)$id) {
                        $found = (array)$fc;
                        break;
                    }
                }
            }

            if ($found) {
                $formatted = $this->formatCities([$found], true);
                $found = (array)($formatted[0] ?? $found);
            } else {
                $found = [
                    'id' => (string)$id,
                    'cityId' => (int)$id,
                    'nome' => 'Cidade',
                    'name' => 'Cidade',
                    'shortName' => 'Cidade',
                    'estado' => '1',
                    'polygon' => null,
                    'active' => 1
                ];
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Cidade localizada',
                'data' => $found,
                'response' => $found,
                'errors' => null
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionArea()
    {
        try {
            $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
            $id = (int)($_GET['id'] ?? $input['id'] ?? 0);
            $name = trim($input['name'] ?? $input['nome'] ?? '');
            $estateId = (int)($input['estate_id'] ?? $input['estado'] ?? 1);
            $shortName = $input['short_name'] ?? $name;
            $polygonInput = $input['polygon'] ?? [];

            if (empty($name) && $id > 0) {
                try {
                    $pdoLookup = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RO);
                    $stmtLookup = $pdoLookup->prepare("SELECT nome, estado FROM city WHERE id = :id LIMIT 1");
                    $stmtLookup->execute([':id' => $id]);
                    $rowLookup = $stmtLookup->fetch(\PDO::FETCH_ASSOC);
                    if ($rowLookup) {
                        $name = $rowLookup['nome'];
                        $shortName = $name;
                        $estateId = (int)($rowLookup['estado'] ?: $estateId);
                    }
                } catch (\Throwable $t) {}
            }

            if (empty($name)) {
                throw new Exception("Nome da cidade é obrigatório");
            }

            $points = [];
            if (is_array($polygonInput)) {
                foreach ($polygonInput as $pt) {
                    if (is_array($pt)) {
                        $lat = $pt['lat'] ?? (isset($pt[0]) && abs($pt[0]) <= 90 ? $pt[0] : ($pt[1] ?? null));
                        $lng = $pt['lng'] ?? (isset($pt[1]) && abs($pt[1]) <= 180 ? $pt[1] : ($pt[0] ?? null));
                        if ($lat !== null && $lng !== null) {
                            $points[] = "{$lat} {$lng}";
                        }
                    }
                }
            }

            $polygonWkt = null;
            if (count($points) >= 3) {
                if ($points[0] !== end($points)) {
                    $points[] = $points[0];
                }
                $polygonWkt = "POLYGON((" . implode(",", $points) . "))";
            }

            $localCityId = $id;
            try {
                $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
                
                // 1. Localiza ou cria a cidade na tabela city
                $stmtFind = $pdo->prepare("SELECT id FROM city WHERE id = :id OR LOWER(nome) = LOWER(:name) LIMIT 1");
                $stmtFind->execute([':id' => $id, ':name' => $name]);
                $row = $stmtFind->fetch(\PDO::FETCH_ASSOC);

                if ($row) {
                    $localCityId = (int)$row['id'];
                    $stmtUp = $pdo->prepare("UPDATE city SET nome = :nome, shortName = :shortName, estado = :estado, active = 1, statusId = 1 WHERE id = :id");
                    $stmtUp->execute([':nome' => $name, ':shortName' => $shortName, ':estado' => $estateId, ':id' => $localCityId]);
                } else {
                    $stmtIns = $pdo->prepare("INSERT INTO city (nome, shortName, estado, active, statusId) VALUES (:nome, :shortName, :estado, 1, 1)");
                    $stmtIns->execute([':nome' => $name, ':shortName' => $shortName, ':estado' => $estateId]);
                    $localCityId = (int)$pdo->lastInsertId();
                }

                // 2. Salva o polígono na tabela cityArea
                if ($localCityId > 0) {
                    try {
                        $stmtDisable = $pdo->prepare("UPDATE cityArea SET statusId = 2 WHERE cityId = :cityId");
                        $stmtDisable->execute([':cityId' => $localCityId]);

                        if (!$polygonWkt) {
                            $polygonWkt = "POLYGON((-15.8 -47.9, -15.8 -47.8, -15.7 -47.8, -15.7 -47.9, -15.8 -47.9))";
                        }

                        $stmtArea = $pdo->prepare("INSERT INTO cityArea (cityId, polygon, statusId) VALUES (:cityId, ST_GeomFromText(:wkt), 1)");
                        $stmtArea->execute([':cityId' => $localCityId, ':wkt' => $polygonWkt]);
                    } catch (\Throwable $caEx) {
                    }
                }

                // 3. Vincula ao perfil padrão de administradores
                if ($localCityId > 0) {
                    try {
                        $pdo->query("INSERT IGNORE INTO roleCity (roleId, cityId) VALUES (1, {$localCityId}), (2, {$localCityId})");
                    } catch (\Throwable $rEx) {
                    }
                }
            } catch (\Throwable $dbEx) {
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Área da cidade salva com sucesso',
                'data' => [
                    'id' => $localCityId,
                    'name' => $name,
                    'estate_id' => $estateId,
                    'polygon' => $polygonWkt
                ],
                'response' => ['Área da cidade salva com sucesso'],
                'errors' => null
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionMirroring()
    {
        try {
            $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
            $mirroringCityId = (int)($input['mirroringCityId'] ?? 0);
            $cityMirrorId = (int)($input['cityMirrorId'] ?? 0);

            try {
                $pdo = \app\utils\Connection::getConnection(\app\utils\Connection::DB_MYSQL_RW);
                if ($mirroringCityId > 0 && $cityMirrorId > 0) {
                    // Copiar configurações de cityConfig se existirem
                    $stmtCopy = $pdo->prepare("
                        INSERT IGNORE INTO cityConfig (cityId, keyName, value)
                        SELECT :newCityId, keyName, value FROM cityConfig WHERE cityId = :mirrorId
                    ");
                    $stmtCopy->execute([':newCityId' => $mirroringCityId, ':mirrorId' => $cityMirrorId]);
                }
            } catch (\Throwable $t) {
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Configurações de cidade espelhadas com sucesso',
                'data' => true,
                'response' => ['Configurações de cidade espelhadas com sucesso'],
                'errors' => null
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionStore()
    {
        try {
            $rawInput = file_get_contents('php://input');
            $input = json_decode($rawInput, true);
            if (!is_array($input) || empty($input)) {
                $input = $_POST;
            }

            $nome = trim($input['nome'] ?? $input['name'] ?? '');
            $estado = (int)($input['estado'] ?? $input['estateId'] ?? 1);
            $polygon = $input['polygon'] ?? null;

            if (empty($nome)) {
                throw new Exception("Nome da cidade é obrigatório");
            }

            $cityId = 0;
            try {
                $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
                $stmtFind = $pdo->prepare("SELECT id FROM city WHERE LOWER(nome) = LOWER(:name) LIMIT 1");
                $stmtFind->execute([':name' => $nome]);
                $existingId = $stmtFind->fetchColumn();

                if ($existingId) {
                    $cityId = (int)$existingId;
                    $stmtUp = $pdo->prepare("UPDATE city SET estado = :estado, active = 1, statusId = 1 WHERE id = :id");
                    $stmtUp->execute([':estado' => $estado, ':id' => $cityId]);
                } else {
                    $stmtIns = $pdo->prepare("INSERT INTO city (nome, shortName, estado, active, statusId) VALUES (:nome, :shortName, :estado, 1, 1)");
                    $stmtIns->execute([':nome' => $nome, ':shortName' => $nome, ':estado' => $estado]);
                    $cityId = (int)$pdo->lastInsertId();
                }

                if ($cityId > 0) {
                    try {
                        $pdo->query("INSERT IGNORE INTO roleCity (roleId, cityId) VALUES (1, {$cityId}), (2, {$cityId})");
                    } catch (\Throwable $rEx) {
                    }
                }
            } catch (\Throwable $dbEx) {
            }

            if ($cityId === 0) {
                $cityId = rand(1000, 9999);
            }

            $newCity = [
                'id' => $cityId,
                'cityId' => $cityId,
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

            $cities = [];
            try {
                $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
                $stmt = $pdo->query("
                    SELECT 
                        c.id, c.nome, c.shortName, c.estado, c.active,
                        ca.polygon
                    FROM city c
                    LEFT JOIN cityArea ca ON (c.id = ca.cityId AND ca.statusId = 1)
                    ORDER BY c.nome ASC
                ");
                $cities = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            } catch (\Throwable $e) {
                $cities = $this->cityDao->getByEstate(null);
            }

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
        $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        $cityId = (int)($_GET['id'] ?? ($_GET['cityId'] ?? ($_SERVER['HTTP_CITYID'] ?? 0)));

        if ($method === 'PUT' || $method === 'POST') {
            $this->actionUpdateCityConfig($cityId);
            return;
        }

        if ($cityId > 0 && !isset($_GET['lat']) && !isset($_GET['lng'])) {
            $this->actionGetCityConfigView($cityId);
            return;
        }

        $this->actionGetConfig();
    }

    public function actionGetCityConfigView($cityId = null)
    {
        try {
            $cityId = (int)($cityId ?: ($_GET['id'] ?? ($_GET['cityId'] ?? ($_SERVER['HTTP_CITYID'] ?? 0))));
            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);

            if ($cityId <= 0) {
                $stmtFirst = $pdo->query("SELECT id FROM city WHERE active = 1 ORDER BY id ASC LIMIT 1");
                $first = $stmtFirst ? $stmtFirst->fetch(\PDO::FETCH_ASSOC) : null;
                $cityId = $first ? (int)$first['id'] : 0;
            }

            if ($cityId <= 0) {
                echo $this->returnSuccess("Nenhuma cidade informada", []);
                return;
            }

            // Garante que exista registro na tabela cityConfig para esta cidade
            $stmtCheck = $pdo->prepare("SELECT 1 FROM cityConfig WHERE cityId = :cityId LIMIT 1");
            $stmtCheck->execute([':cityId' => $cityId]);
            if (!$stmtCheck->fetch()) {
                $stmtTpl = $pdo->query("SELECT * FROM cityConfig LIMIT 1");
                $tpl = $stmtTpl ? $stmtTpl->fetch(\PDO::FETCH_ASSOC) : null;
                if ($tpl) {
                    unset($tpl['id'], $tpl['idCityConfig']);
                    $tpl['cityId'] = $cityId;
                    $cols = array_keys($tpl);
                    $colNames = implode('`, `', $cols);
                    $placeholders = ':' . implode(', :', $cols);
                    $stmtIns = $pdo->prepare("INSERT INTO cityConfig (`{$colNames}`) VALUES ({$placeholders})");
                    $stmtIns->execute($tpl);
                }
            }

            $rows = [];
            try {
                $stmtView = $pdo->prepare("
                    SELECT 
                        `attribute`,
                        `value`,
                        `description`,
                        `inputType`,
                        `cityId`
                    FROM city_config_view
                    WHERE cityId = :cityId
                ");
                $stmtView->execute([':cityId' => $cityId]);
                $rows = $stmtView->fetchAll(\PDO::FETCH_ASSOC);
            } catch (\Throwable $tv) {
                $rows = [];
            }

            if (empty($rows)) {
                $rows = $this->buildCityConfigRowsFromTable($pdo, $cityId);
            } else {
                // Decode enabledDriverFields if it is json
                foreach ($rows as &$r) {
                    if ($r['attribute'] === 'enabledDriverFields' && !empty($r['value'])) {
                        $dec = json_decode($r['value'], true);
                        if (is_array($dec)) {
                            $r['value'] = $dec;
                        }
                    }
                }
            }

            echo $this->returnSuccess("Configurações da cidade encontradas", $rows);
        } catch (\Throwable $e) {
            echo $this->returnError($e, "Erro ao buscar configurações da cidade");
        }
    }

    public function actionUpdateCityConfig($cityId = null)
    {
        try {
            $cityId = (int)($cityId ?: ($_GET['id'] ?? ($_GET['cityId'] ?? ($_SERVER['HTTP_CITYID'] ?? 0))));
            if ($cityId <= 0) {
                throw new Exception("ID da cidade não informado");
            }

            $rawInput = file_get_contents('php://input');
            $payload = json_decode($rawInput, true);
            if (!is_array($payload)) {
                $payload = $_POST;
            }

            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);

            $globalKeys = [
                'whatsapp_zafira_validated_driver_message',
                'whatsapp_zafira_validated_client_message',
            ];

            $stmtCols = $pdo->query("SHOW COLUMNS FROM cityConfig");
            $validCols = $stmtCols ? $stmtCols->fetchAll(\PDO::FETCH_COLUMN) : [];

            // Garante que cityConfig existe
            $stmtCheck = $pdo->prepare("SELECT 1 FROM cityConfig WHERE cityId = :cityId LIMIT 1");
            $stmtCheck->execute([':cityId' => $cityId]);
            if (!$stmtCheck->fetch()) {
                $stmtTpl = $pdo->query("SELECT * FROM cityConfig LIMIT 1");
                $tpl = $stmtTpl ? $stmtTpl->fetch(\PDO::FETCH_ASSOC) : null;
                if ($tpl) {
                    unset($tpl['id'], $tpl['idCityConfig']);
                    $tpl['cityId'] = $cityId;
                    $cols = array_keys($tpl);
                    $colNames = implode('`, `', $cols);
                    $placeholders = ':' . implode(', :', $cols);
                    $stmtIns = $pdo->prepare("INSERT INTO cityConfig (`{$colNames}`) VALUES ({$placeholders})");
                    $stmtIns->execute($tpl);
                }
            }

            foreach ($payload as $key => $val) {
                if (in_array($key, $globalKeys, true)) {
                    $stmtGlobal = $pdo->prepare("UPDATE config SET `value` = :val WHERE `key` = :k");
                    $stmtGlobal->execute([':val' => (string)$val, ':k' => $key]);
                    continue;
                }

                if (in_array($key, $validCols, true)) {
                    if (is_array($val) || is_object($val)) {
                        $val = json_encode($val);
                    }
                    $stmtUpdate = $pdo->prepare("UPDATE cityConfig SET `{$key}` = :val WHERE cityId = :cityId");
                    $stmtUpdate->execute([':val' => $val, ':cityId' => $cityId]);
                }
            }

            $this->actionGetCityConfigView($cityId);
        } catch (\Throwable $e) {
            echo $this->returnError($e, "Erro ao atualizar configuração da cidade");
        }
    }

    private function buildCityConfigRowsFromTable(\PDO $pdo, int $cityId): array
    {
        $stmt = $pdo->prepare("SELECT * FROM cityConfig WHERE cityId = :cityId LIMIT 1");
        $stmt->execute([':cityId' => $cityId]);
        $cfg = $stmt->fetch(\PDO::FETCH_ASSOC);

        if (!$cfg) {
            return [];
        }

        $definitions = [
            'kmRemainingToPutDriverPreAvailable' => ['Distância que falta para colocar o motorista que está em viagem com status de pré-disponível (Em KM)', 'number'],
            'quantityTripWayPoints' => ['Quantidade de paradas que é permitido para aquela cidade', 'number'],
            'cancellationCustomerFeeValue' => ['Se valor for maior que 0, a cidade terá taxa de cancelamento', 'number'],
            'waitingTimeCustomerCancellationFee' => ['Tempo em segundos do tempo que o motorista poderá cancelar a corrida sem penalidades e gerando taxa de cancelamento para o cliente', 'number'],
            'routePercentageCancellationFee' => ['Porcentagem de deslocamento do motorista para inserir taxa de cancelamento ao cliente', 'number'],
            'daysToBillCancellationFee' => ['Caso a corrida for pagamento eletrônico, esses serão os dias postergados para efetuar o repasse da taxa para o motorista', 'number'],
            'securityContactNumber' => ['Número de contato de segurança para o botão de panico', 'tel'],
            'supportContactNumber' => ['Número de contato de suporte', 'tel'],
            'supportEmail' => ['Email de suporte', 'email'],
            'urlFacebook' => ['URL perfil do facebook da cidade', 'link'],
            'urlInstagram' => ['URL do perfil do instagram da cidade', 'link'],
            'enableTripSharing' => ['Habilita compartilhamento de viagem', 'boolean'],
            'enableTripSuggestion' => ['Habilita sugestões de viagens caso o cliente não seja atendido', 'boolean'],
            'enableTripRecalculation' => ['Habilita recálculo de rotas no final da viagem', 'boolean'],
            'enableDriverDataSheet' => ['Habilita a ficha técnica do motorista na cidade', 'boolean'],
            'enableChoicePriceTripRecalculation' => ['Habilita escolha de preço pelo motorista ao final de uma viagem recalculada', 'boolean'],
            'showPriceWhileTrip' => ['Exibir preço ao motorista durante a viagem', 'boolean'],
            'showUserRating' => ['Exibe a avaliação entre cliente e motorista ao final da viagem', 'boolean'],
            'enableCallInChat' => ['Habilita ligação durante um chat de viagem', 'boolean'],
            'enableTripScheduled' => ['Habilita viagem agendada', 'boolean'],
            'enableKnobTrip' => ['Habilita chamada de maçaneta (App Cliente e Motorista)', 'boolean'],
            'enableTripTurbo' => ['Habilita viagem Turbo', 'boolean'],
            'enableSearchDriver' => ['Se ativo, exibe a opção de buscar motorista (botão chamar); quando desativado, exibe somente botão de agendamento.', 'boolean'],
            'showCategoriesOnHome' => ['Exibir atalhos de categorias de chamado na tela inicial do cliente', 'boolean'],
            'quantityDriversCloseOnCall' => ['Quantidade de motoristas próximos a ser chamado no chamado individual', 'number'],
            'kmForCalculatePrice' => ['Distância máxima para calcular preço', 'number'],
            'enabledDriverFields' => ['Campos que serão exibidos no app do motorista', 'json'],
            'timezone' => ['Timezone da cidade', 'text'],
            'typeMoney' => ['Moeda utilizada na cidade', 'text'],
            'enableRouteDrawingInTicketScreen' => ['Habilitar desenho de rota na tela de chamado', 'boolean'],
            'enableDepartureAddressConfirmation' => ['Habilitar confirmação de endereço de partida', 'boolean'],
            'showFormOfPaymentToDriverDuringTrip' => ['Mostrar forma de pagamento ao motorista durante a viagem', 'boolean'],
            'showCancellationFeeForCustomer' => ['Informar taxa de cancelamento em aberto para o cliente na tela de chamado', 'boolean'],
            'allowDriverGenerateCancellationFee' => ['Permitir que o motorista escolha gerar taxa de cancelamento caso cancele a viagem', 'boolean'],
            'recalculationFromKm' => ['Realizar recálculo na viagem a partir de (km)', 'number'],
            'showNetValueForDriverOnCall' => ['Mostrar valor líquido para motorista no chamado', 'boolean'],
            'addTripNote' => ['Adicionar descrição da viagem antes do chamado', 'boolean'],
            'enableValidationDocumentInTrip' => ['Habilitar fazer verificação de documento', 'boolean'],
            'marginForRecalculation' => ['Margem para o recálculo em km', 'number'],
            'showDynamicAreaInMap' => ['Mostrar áreas com dinâmicas no mapa do motorista', 'boolean'],
            'showRiskAreaInCall' => ['Mostrar a área de risco no chamado', 'boolean'],
            'maximumAmountNegativeBalanceDriver' => ['Valor máximo de saldo negativo do motorista', 'number'],
            'prepayPerPeriod' => ['Define o modo pré-pago: 0 - Desabilitado, 1 - Ativado por saldo, 2 - Ativado por período, 3 - Ambos.', 'text'],
            'enableCustomOrderTripType' => ['Habilitar ordem personalizada dos tipos de viagem', 'boolean'],
            'enableZafiraValidationMonitor' => ['Habilita validação de cadastro Zafira no Monitor nesta cidade', 'boolean'],
            'enableZafiraValidationApp' => ['Habilita validação de cadastro Zafira no App nesta cidade', 'boolean'],
            'requireCustomerDataKnobTrip' => ['Exige CPF, email e validação Zafira na maçaneta manual', 'boolean'],
            'zafiraValidationPrice' => ['Valor cobrado por validação Zafira quando habilitada (padrão: R$ 0,99)', 'number'],
        ];

        $rows = [];
        foreach ($definitions as $attr => $def) {
            $val = $cfg[$attr] ?? null;
            if ($def[1] === 'boolean') {
                $val = ($val !== null && $val != '0') ? '1' : '0';
            } elseif ($def[1] === 'json' && !empty($val)) {
                $dec = json_decode($val, true);
                if (is_array($dec)) {
                    $val = $dec;
                }
            }

            $rows[] = [
                'attribute' => $attr,
                'value' => $val !== null ? $val : '',
                'description' => $def[0],
                'inputType' => $def[1],
                'cityId' => $cityId,
            ];
        }

        // WhatsApp Zafira global templates
        try {
            $stmtWpp = $pdo->query("SELECT `key`, `value` FROM config WHERE `key` IN ('whatsapp_zafira_validated_driver_message', 'whatsapp_zafira_validated_client_message')");
            $wppConfigs = $stmtWpp ? $stmtWpp->fetchAll(\PDO::FETCH_KEY_PAIR) : [];
        } catch (\Throwable $tw) {
            $wppConfigs = [];
        }

        $rows[] = [
            'attribute' => 'whatsapp_zafira_validated_driver_message',
            'value' => $wppConfigs['whatsapp_zafira_validated_driver_message'] ?? '',
            'description' => 'Template WhatsApp enviado ao motorista após validação Zafira no monitor. Placeholders: {firstName}, {projectName}.',
            'inputType' => 'textarea',
            'cityId' => $cityId,
        ];

        $rows[] = [
            'attribute' => 'whatsapp_zafira_validated_client_message',
            'value' => $wppConfigs['whatsapp_zafira_validated_client_message'] ?? '',
            'description' => 'Template WhatsApp enviado ao cliente após validação Zafira no monitor. Placeholders: {firstName}, {projectName}.',
            'inputType' => 'textarea',
            'cityId' => $cityId,
        ];

        return $rows;
    }

    public function actionTripTypes()
    {
        try {
            $cityId = (int)($_GET['id'] ?? ($_SERVER['HTTP_CITYID'] ?? 0));
            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);

            $stmt = $pdo->query("
                SELECT 
                    tt.idTripType AS tripTypeId,
                    tt.idTripType AS id,
                    tt.type,
                    COALESCE(tt.name, tt.type) as name,
                    tt.description,
                    tt.picture,
                    COALESCE(tt.serviceOption, 0) AS serviceOption
                FROM tripType tt
                WHERE tt.statusId = 1
                ORDER BY tt.idTripType ASC
            ");
            $list = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            if (empty($list)) {
                $stmtAll = $pdo->query("
                    SELECT 
                        idTripType AS tripTypeId,
                        idTripType AS id,
                        type,
                        name,
                        description,
                        picture,
                        COALESCE(serviceOption, 0) AS serviceOption
                    FROM tripType
                    ORDER BY idTripType ASC
                ");
                $list = $stmtAll->fetchAll(\PDO::FETCH_ASSOC);
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Tipos de viagens encontrados',
                'data' => $list,
                'response' => $list,
                'errors' => null
            ]);
        } catch (\Throwable $e) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Tipos de viagens padrão',
                'data' => [
                    ['tripTypeId' => 1, 'id' => 1, 'type' => 'Carro', 'name' => 'Carro', 'description' => '', 'picture' => '', 'serviceOption' => 0],
                    ['tripTypeId' => 2, 'id' => 2, 'type' => 'Moto', 'name' => 'Moto', 'description' => '', 'picture' => '', 'serviceOption' => 0],
                    ['tripTypeId' => 3, 'id' => 3, 'type' => 'Entrega', 'name' => 'Entrega', 'description' => '', 'picture' => '', 'serviceOption' => 1]
                ],
                'response' => [
                    ['tripTypeId' => 1, 'id' => 1, 'type' => 'Carro', 'name' => 'Carro', 'description' => '', 'picture' => '', 'serviceOption' => 0],
                    ['tripTypeId' => 2, 'id' => 2, 'type' => 'Moto', 'name' => 'Moto', 'description' => '', 'picture' => '', 'serviceOption' => 0],
                    ['tripTypeId' => 3, 'id' => 3, 'type' => 'Entrega', 'name' => 'Entrega', 'description' => '', 'picture' => '', 'serviceOption' => 1]
                ],
                'errors' => null
            ]);
        }
    }

    public function actionGetActives()
    {
        try {
            $cities = [];
            try {
                $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
                $stmt = $pdo->query("
                    SELECT DISTINCT
                        c.id, c.nome, c.shortName, c.estado, c.active, c.statusId
                    FROM city c
                    INNER JOIN cityArea ca ON (c.id = ca.cityId AND ca.statusId = 1)
                    WHERE ca.polygon IS NOT NULL
                    ORDER BY c.nome ASC
                ");
                $cities = $stmt->fetchAll(\PDO::FETCH_ASSOC);

                if (empty($cities)) {
                    $stmt2 = $pdo->query("
                        SELECT DISTINCT
                            c.id, c.nome, c.shortName, c.estado, c.active, c.statusId
                        FROM city c
                        WHERE c.id IN (SELECT DISTINCT cityId FROM cityConfig WHERE cityId IS NOT NULL)
                        ORDER BY c.nome ASC
                    ");
                    $cities = $stmt2->fetchAll(\PDO::FETCH_ASSOC);
                }
            } catch (\Throwable $e) {
                $cities = (new CityService)->findActives();
            }

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
            $cities = [];
            try {
                $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
                $stmt = $pdo->query("
                    SELECT 
                        c.id, c.nome, c.shortName, c.estado, c.active, c.statusId,
                        ST_AsText(ca.polygon) as polygon
                    FROM city c
                    INNER JOIN cityArea ca ON (c.id = ca.cityId AND ca.statusId = 1)
                    WHERE ca.polygon IS NOT NULL
                    ORDER BY c.nome ASC
                ");
                $cities = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            } catch (\Throwable $e) {
                $cities = (new CityService)->findActives();
            }

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
            $estadoNum = (int)($c['estado'] ?? $c['estateId'] ?? ($def['estado'] ?? 1));
            $isUS = ($estadoNum >= 100) || in_array(strtolower($name), ['miami', 'orlando', 'new york', 'los angeles', 'chicago', 'houston', 'phoenix']);
            $country = $c['country'] ?? ($def['country'] ?? ($isUS ? 'US' : 'BR'));

            $lat = isset($c['latitude']) && is_numeric($c['latitude']) ? (float)$c['latitude'] : ($def['lat'] ?? ($isUS ? 25.7617 : -15.793889));
            $lng = isset($c['longitude']) && is_numeric($c['longitude']) ? (float)$c['longitude'] : ($def['lng'] ?? ($isUS ? -80.1918 : -47.882778));

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
            $c['estado'] = (string)$estadoNum;
            $c['estateId'] = (string)$estadoNum;
            $c['statusId'] = (string)($c['statusId'] ?? $c['active'] ?? '1');
            $c['active'] = $c['statusId'];

            if (!empty($c['polygon']) && is_string($c['polygon']) && strpos($c['polygon'], 'POLYGON((') !== false) {
                // Keep the real valid polygon from DB
            } elseif ($withPolygon) {
                $c['polygon'] = $defaultPolygon;
            }

            return (object)$c;
        }, (array)$rawList));
    }
}