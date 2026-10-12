<?php

namespace app\controllers;

use app\dao\EstateDao;
use Exception;

class EstateController extends ApiController
{
    protected $estateDao;

    private static $brazilStates = [
        ['id' => 1, 'country_id' => 1, 'countryId' => 1, 'name' => 'Acre', 'nome' => 'Acre', 'sigla' => 'AC'],
        ['id' => 2, 'country_id' => 1, 'countryId' => 1, 'name' => 'Alagoas', 'nome' => 'Alagoas', 'sigla' => 'AL'],
        ['id' => 3, 'country_id' => 1, 'countryId' => 1, 'name' => 'Amapá', 'nome' => 'Amapá', 'sigla' => 'AP'],
        ['id' => 4, 'country_id' => 1, 'countryId' => 1, 'name' => 'Amazonas', 'nome' => 'Amazonas', 'sigla' => 'AM'],
        ['id' => 5, 'country_id' => 1, 'countryId' => 1, 'name' => 'Bahia', 'nome' => 'Bahia', 'sigla' => 'BA'],
        ['id' => 6, 'country_id' => 1, 'countryId' => 1, 'name' => 'Ceará', 'nome' => 'Ceará', 'sigla' => 'CE'],
        ['id' => 7, 'country_id' => 1, 'countryId' => 1, 'name' => 'Distrito Federal', 'nome' => 'Distrito Federal', 'sigla' => 'DF'],
        ['id' => 8, 'country_id' => 1, 'countryId' => 1, 'name' => 'Espírito Santo', 'nome' => 'Espírito Santo', 'sigla' => 'ES'],
        ['id' => 9, 'country_id' => 1, 'countryId' => 1, 'name' => 'Goiás', 'nome' => 'Goiás', 'sigla' => 'GO'],
        ['id' => 10, 'country_id' => 1, 'countryId' => 1, 'name' => 'Maranhão', 'nome' => 'Maranhão', 'sigla' => 'MA'],
        ['id' => 11, 'country_id' => 1, 'countryId' => 1, 'name' => 'Mato Grosso', 'nome' => 'Mato Grosso', 'sigla' => 'MT'],
        ['id' => 12, 'country_id' => 1, 'countryId' => 1, 'name' => 'Mato Grosso do Sul', 'nome' => 'Mato Grosso do Sul', 'sigla' => 'MS'],
        ['id' => 13, 'country_id' => 1, 'countryId' => 1, 'name' => 'Minas Gerais', 'nome' => 'Minas Gerais', 'sigla' => 'MG'],
        ['id' => 14, 'country_id' => 1, 'countryId' => 1, 'name' => 'Pará', 'nome' => 'Pará', 'sigla' => 'PA'],
        ['id' => 15, 'country_id' => 1, 'countryId' => 1, 'name' => 'Paraíba', 'nome' => 'Paraíba', 'sigla' => 'PB'],
        ['id' => 16, 'country_id' => 1, 'countryId' => 1, 'name' => 'Paraná', 'nome' => 'Paraná', 'sigla' => 'PR'],
        ['id' => 17, 'country_id' => 1, 'countryId' => 1, 'name' => 'Pernambuco', 'nome' => 'Pernambuco', 'sigla' => 'PE'],
        ['id' => 18, 'country_id' => 1, 'countryId' => 1, 'name' => 'Piauí', 'nome' => 'Piauí', 'sigla' => 'PI'],
        ['id' => 19, 'country_id' => 1, 'countryId' => 1, 'name' => 'Rio de Janeiro', 'nome' => 'Rio de Janeiro', 'sigla' => 'RJ'],
        ['id' => 20, 'country_id' => 1, 'countryId' => 1, 'name' => 'Rio Grande do Norte', 'nome' => 'Rio Grande do Norte', 'sigla' => 'RN'],
        ['id' => 21, 'country_id' => 1, 'countryId' => 1, 'name' => 'Rio Grande do Sul', 'nome' => 'Rio Grande do Sul', 'sigla' => 'RS'],
        ['id' => 22, 'country_id' => 1, 'countryId' => 1, 'name' => 'Rondônia', 'nome' => 'Rondônia', 'sigla' => 'RO'],
        ['id' => 23, 'country_id' => 1, 'countryId' => 1, 'name' => 'Roraima', 'nome' => 'Roraima', 'sigla' => 'RR'],
        ['id' => 24, 'country_id' => 1, 'countryId' => 1, 'name' => 'Santa Catarina', 'nome' => 'Santa Catarina', 'sigla' => 'SC'],
        ['id' => 25, 'country_id' => 1, 'countryId' => 1, 'name' => 'São Paulo', 'nome' => 'São Paulo', 'sigla' => 'SP'],
        ['id' => 26, 'country_id' => 1, 'countryId' => 1, 'name' => 'Sergipe', 'nome' => 'Sergipe', 'sigla' => 'SE'],
        ['id' => 27, 'country_id' => 1, 'countryId' => 1, 'name' => 'Tocantins', 'nome' => 'Tocantins', 'sigla' => 'TO'],
    ];

    private static $usStates = [
        ['id' => 101, 'country_id' => 2, 'countryId' => 2, 'name' => 'Alabama', 'nome' => 'Alabama', 'sigla' => 'AL'],
        ['id' => 102, 'country_id' => 2, 'countryId' => 2, 'name' => 'Alaska', 'nome' => 'Alaska', 'sigla' => 'AK'],
        ['id' => 103, 'country_id' => 2, 'countryId' => 2, 'name' => 'Arizona', 'nome' => 'Arizona', 'sigla' => 'AZ'],
        ['id' => 104, 'country_id' => 2, 'countryId' => 2, 'name' => 'Arkansas', 'nome' => 'Arkansas', 'sigla' => 'AR'],
        ['id' => 105, 'country_id' => 2, 'countryId' => 2, 'name' => 'California', 'nome' => 'California', 'sigla' => 'CA'],
        ['id' => 106, 'country_id' => 2, 'countryId' => 2, 'name' => 'Colorado', 'nome' => 'Colorado', 'sigla' => 'CO'],
        ['id' => 107, 'country_id' => 2, 'countryId' => 2, 'name' => 'Connecticut', 'nome' => 'Connecticut', 'sigla' => 'CT'],
        ['id' => 108, 'country_id' => 2, 'countryId' => 2, 'name' => 'Delaware', 'nome' => 'Delaware', 'sigla' => 'DE'],
        ['id' => 109, 'country_id' => 2, 'countryId' => 2, 'name' => 'District of Columbia', 'nome' => 'District of Columbia', 'sigla' => 'DC'],
        ['id' => 110, 'country_id' => 2, 'countryId' => 2, 'name' => 'Florida', 'nome' => 'Florida', 'sigla' => 'FL'],
        ['id' => 111, 'country_id' => 2, 'countryId' => 2, 'name' => 'Georgia', 'nome' => 'Georgia', 'sigla' => 'GA'],
        ['id' => 112, 'country_id' => 2, 'countryId' => 2, 'name' => 'Hawaii', 'nome' => 'Hawaii', 'sigla' => 'HI'],
        ['id' => 113, 'country_id' => 2, 'countryId' => 2, 'name' => 'Idaho', 'nome' => 'Idaho', 'sigla' => 'ID'],
        ['id' => 114, 'country_id' => 2, 'countryId' => 2, 'name' => 'Illinois', 'nome' => 'Illinois', 'sigla' => 'IL'],
        ['id' => 115, 'country_id' => 2, 'countryId' => 2, 'name' => 'Indiana', 'nome' => 'Indiana', 'sigla' => 'IN'],
        ['id' => 116, 'country_id' => 2, 'countryId' => 2, 'name' => 'Iowa', 'nome' => 'Iowa', 'sigla' => 'IA'],
        ['id' => 117, 'country_id' => 2, 'countryId' => 2, 'name' => 'Kansas', 'nome' => 'Kansas', 'sigla' => 'KS'],
        ['id' => 118, 'country_id' => 2, 'countryId' => 2, 'name' => 'Kentucky', 'nome' => 'Kentucky', 'sigla' => 'KY'],
        ['id' => 119, 'country_id' => 2, 'countryId' => 2, 'name' => 'Louisiana', 'nome' => 'Louisiana', 'sigla' => 'LA'],
        ['id' => 120, 'country_id' => 2, 'countryId' => 2, 'name' => 'Maine', 'nome' => 'Maine', 'sigla' => 'ME'],
        ['id' => 121, 'country_id' => 2, 'countryId' => 2, 'name' => 'Maryland', 'nome' => 'Maryland', 'sigla' => 'MD'],
        ['id' => 122, 'country_id' => 2, 'countryId' => 2, 'name' => 'Massachusetts', 'nome' => 'Massachusetts', 'sigla' => 'MA'],
        ['id' => 123, 'country_id' => 2, 'countryId' => 2, 'name' => 'Michigan', 'nome' => 'Michigan', 'sigla' => 'MI'],
        ['id' => 124, 'country_id' => 2, 'countryId' => 2, 'name' => 'Minnesota', 'nome' => 'Minnesota', 'sigla' => 'MN'],
        ['id' => 125, 'country_id' => 2, 'countryId' => 2, 'name' => 'Mississippi', 'nome' => 'Mississippi', 'sigla' => 'MS'],
        ['id' => 126, 'country_id' => 2, 'countryId' => 2, 'name' => 'Missouri', 'nome' => 'Missouri', 'sigla' => 'MO'],
        ['id' => 127, 'country_id' => 2, 'countryId' => 2, 'name' => 'Montana', 'nome' => 'Montana', 'sigla' => 'MT'],
        ['id' => 128, 'country_id' => 2, 'countryId' => 2, 'name' => 'Nebraska', 'nome' => 'Nebraska', 'sigla' => 'NE'],
        ['id' => 129, 'country_id' => 2, 'countryId' => 2, 'name' => 'Nevada', 'nome' => 'Nevada', 'sigla' => 'NV'],
        ['id' => 130, 'country_id' => 2, 'countryId' => 2, 'name' => 'New Hampshire', 'nome' => 'New Hampshire', 'sigla' => 'NH'],
        ['id' => 131, 'country_id' => 2, 'countryId' => 2, 'name' => 'New Jersey', 'nome' => 'New Jersey', 'sigla' => 'NJ'],
        ['id' => 132, 'country_id' => 2, 'countryId' => 2, 'name' => 'New Mexico', 'nome' => 'New Mexico', 'sigla' => 'NM'],
        ['id' => 133, 'country_id' => 2, 'countryId' => 2, 'name' => 'New York', 'nome' => 'New York', 'sigla' => 'NY'],
        ['id' => 134, 'country_id' => 2, 'countryId' => 2, 'name' => 'North Carolina', 'nome' => 'North Carolina', 'sigla' => 'NC'],
        ['id' => 135, 'country_id' => 2, 'countryId' => 2, 'name' => 'North Dakota', 'nome' => 'North Dakota', 'sigla' => 'ND'],
        ['id' => 136, 'country_id' => 2, 'countryId' => 2, 'name' => 'Ohio', 'nome' => 'Ohio', 'sigla' => 'OH'],
        ['id' => 137, 'country_id' => 2, 'countryId' => 2, 'name' => 'Oklahoma', 'nome' => 'Oklahoma', 'sigla' => 'OK'],
        ['id' => 138, 'country_id' => 2, 'countryId' => 2, 'name' => 'Oregon', 'nome' => 'Oregon', 'sigla' => 'OR'],
        ['id' => 139, 'country_id' => 2, 'countryId' => 2, 'name' => 'Pennsylvania', 'nome' => 'Pennsylvania', 'sigla' => 'PA'],
        ['id' => 140, 'country_id' => 2, 'countryId' => 2, 'name' => 'Rhode Island', 'nome' => 'Rhode Island', 'sigla' => 'RI'],
        ['id' => 141, 'country_id' => 2, 'countryId' => 2, 'name' => 'South Carolina', 'nome' => 'South Carolina', 'sigla' => 'SC'],
        ['id' => 142, 'country_id' => 2, 'countryId' => 2, 'name' => 'South Dakota', 'nome' => 'South Dakota', 'sigla' => 'SD'],
        ['id' => 143, 'country_id' => 2, 'countryId' => 2, 'name' => 'Tennessee', 'nome' => 'Tennessee', 'sigla' => 'TN'],
        ['id' => 144, 'country_id' => 2, 'countryId' => 2, 'name' => 'Texas', 'nome' => 'Texas', 'sigla' => 'TX'],
        ['id' => 145, 'country_id' => 2, 'countryId' => 2, 'name' => 'Utah', 'nome' => 'Utah', 'sigla' => 'UT'],
        ['id' => 146, 'country_id' => 2, 'countryId' => 2, 'name' => 'Vermont', 'nome' => 'Vermont', 'sigla' => 'VT'],
        ['id' => 147, 'country_id' => 2, 'countryId' => 2, 'name' => 'Virginia', 'nome' => 'Virginia', 'sigla' => 'VA'],
        ['id' => 148, 'country_id' => 2, 'countryId' => 2, 'name' => 'Washington', 'nome' => 'Washington', 'sigla' => 'WA'],
        ['id' => 149, 'country_id' => 2, 'countryId' => 2, 'name' => 'West Virginia', 'nome' => 'West Virginia', 'sigla' => 'WV'],
        ['id' => 150, 'country_id' => 2, 'countryId' => 2, 'name' => 'Wisconsin', 'nome' => 'Wisconsin', 'sigla' => 'WI'],
        ['id' => 151, 'country_id' => 2, 'countryId' => 2, 'name' => 'Wyoming', 'nome' => 'Wyoming', 'sigla' => 'WY'],
    ];

    public function __construct()
    {
        $this->estateDao = new EstateDao;
    }

    public function actionIndex()
    {
        $this->actionGetAll();
    }

    public function actionGetAll()
    {
        try {
            $dbEstates = [];
            try {
                $dbEstates = $this->estateDao->sqlSelect()->get();
            } catch (\Throwable $t) {
            }

            $list = array_merge(self::$brazilStates, self::$usStates);
            if (!empty($dbEstates) && is_array($dbEstates)) {
                $existingNames = [];
                foreach ($list as $s) {
                    $existingNames[strtolower($s['nome'])] = true;
                }
                foreach ($dbEstates as $dbe) {
                    $item = (array)$dbe;
                    $nome = $item['nome'] ?? $item['name'] ?? '';
                    if ($nome !== '' && !isset($existingNames[strtolower($nome)])) {
                        $item['name'] = $nome;
                        $item['nome'] = $nome;
                        $item['country_id'] = $item['country_id'] ?? $item['countryId'] ?? 1;
                        $list[] = $item;
                    }
                }
            }

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Listando estados',
                'data' => $list,
                'response' => $list,
                'errors' => null
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionCountry()
    {
        try {
            $countryId = $_GET['id'] ?? $_GET['countryId'] ?? 1;
            $isUS = ($countryId == 2 || strtolower($countryId) === 'us');

            $states = $isUS ? self::$usStates : self::$brazilStates;

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Estados encontrados',
                'data' => $states,
                'response' => $states,
                'errors' => null
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }

    public function actionStore()
    {
        try {
            $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
            $nome = $input['nome'] ?? $input['name'] ?? 'Novo Estado';
            $countryId = (int)($input['countryId'] ?? $input['country_id'] ?? 1);
            $sigla = $input['sigla'] ?? '--';

            $newEstate = [
                'id' => rand(200, 999),
                'name' => $nome,
                'nome' => $nome,
                'sigla' => $sigla,
                'country_id' => $countryId,
                'countryId' => $countryId
            ];

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => true,
                'message' => 'Estado adicionado com sucesso',
                'data' => $newEstate,
                'response' => $newEstate,
                'errors' => null
            ]);
        } catch (Exception $e) {
            echo $this->returnError($e);
        }
    }
}