<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/06/2019
 * Time: 18:37
 */

namespace App\Services\Locale;


use App\Models\Locale\Estate;
use App\Repositories\Locale\EstateRepository;
use App\Utils\Admin704Apps\Admin704Apps;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;

class EstateService
{
    /**
     * @var EstateRepository|Model
     */
    private $repository;

    /**
     * @var Admin704Apps
     */
    private $admin704Apps;

    public function __construct(EstateRepository $repository, Admin704Apps $admin704Apps)
    {
        $this->repository = $repository;
        $this->admin704Apps = $admin704Apps;
    }

    /**
     * @throws \Exception
     */
    public function all($query = null)
    {
        return $this->admin704Apps->getEstates($query);
    }

    /**
     * @throws \Exception
     */
    public function find($id)
    {
        return $this->admin704Apps->getEstateById($id);
    }

    /**
     * @throws \Exception
     */
    public function store(array $data)
    {
//        $data['name'] = $data['nome'];
//        $data['country_id'] = $data['countryId'];
//
//        unset($data['nome']);
//        unset($data['countryId']);

        return $this->admin704Apps->createEstate($data);
    }

    /**
     * @throws \Exception
     */
    public function update(int $id, array $data)
    {
        $data['name'] = $data['nome'];
        $data['country_id'] = $data['countryId'];

        unset($data['nome']);
        unset($data['countryId']);

        return $this->admin704Apps->updateEstate($id, $data);
    }

    /**
     * @throws \Exception
     */
    public function delete(int $id)
    {
        return $this->admin704Apps->deleteEstate($id);
    }

    /**
     * @throws \Exception
     */
    public function getEstatesByCountryId(int $countryId)
    {
        try {
            $data = $this->admin704Apps->getEstatesByCountryId($countryId);
            if (!empty($data)) {
                return $data;
            }
        } catch (\Throwable $e) {}

        if ($countryId == 2) {
            return [
                ['id' => 101, 'name' => 'Alabama', 'nome' => 'Alabama', 'sigla' => 'AL', 'country_id' => 2],
                ['id' => 102, 'name' => 'Alaska', 'nome' => 'Alaska', 'sigla' => 'AK', 'country_id' => 2],
                ['id' => 103, 'name' => 'Arizona', 'nome' => 'Arizona', 'sigla' => 'AZ', 'country_id' => 2],
                ['id' => 104, 'name' => 'Arkansas', 'nome' => 'Arkansas', 'sigla' => 'AR', 'country_id' => 2],
                ['id' => 105, 'name' => 'California', 'nome' => 'California', 'sigla' => 'CA', 'country_id' => 2],
                ['id' => 106, 'name' => 'Colorado', 'nome' => 'Colorado', 'sigla' => 'CO', 'country_id' => 2],
                ['id' => 107, 'name' => 'Connecticut', 'nome' => 'Connecticut', 'sigla' => 'CT', 'country_id' => 2],
                ['id' => 108, 'name' => 'Delaware', 'nome' => 'Delaware', 'sigla' => 'DE', 'country_id' => 2],
                ['id' => 109, 'name' => 'District of Columbia', 'nome' => 'District of Columbia', 'sigla' => 'DC', 'country_id' => 2],
                ['id' => 110, 'name' => 'Florida', 'nome' => 'Florida', 'sigla' => 'FL', 'country_id' => 2],
                ['id' => 111, 'name' => 'Georgia', 'nome' => 'Georgia', 'sigla' => 'GA', 'country_id' => 2],
                ['id' => 112, 'name' => 'Hawaii', 'nome' => 'Hawaii', 'sigla' => 'HI', 'country_id' => 2],
                ['id' => 113, 'name' => 'Idaho', 'nome' => 'Idaho', 'sigla' => 'ID', 'country_id' => 2],
                ['id' => 114, 'name' => 'Illinois', 'nome' => 'Illinois', 'sigla' => 'IL', 'country_id' => 2],
                ['id' => 115, 'name' => 'Indiana', 'nome' => 'Indiana', 'sigla' => 'IN', 'country_id' => 2],
                ['id' => 116, 'name' => 'Iowa', 'nome' => 'Iowa', 'sigla' => 'IA', 'country_id' => 2],
                ['id' => 117, 'name' => 'Kansas', 'nome' => 'Kansas', 'sigla' => 'KS', 'country_id' => 2],
                ['id' => 118, 'name' => 'Kentucky', 'nome' => 'Kentucky', 'sigla' => 'KY', 'country_id' => 2],
                ['id' => 119, 'name' => 'Louisiana', 'nome' => 'Louisiana', 'sigla' => 'LA', 'country_id' => 2],
                ['id' => 120, 'name' => 'Maine', 'nome' => 'Maine', 'sigla' => 'ME', 'country_id' => 2],
                ['id' => 121, 'name' => 'Maryland', 'nome' => 'Maryland', 'sigla' => 'MD', 'country_id' => 2],
                ['id' => 122, 'name' => 'Massachusetts', 'nome' => 'Massachusetts', 'sigla' => 'MA', 'country_id' => 2],
                ['id' => 123, 'name' => 'Michigan', 'nome' => 'Michigan', 'sigla' => 'MI', 'country_id' => 2],
                ['id' => 124, 'name' => 'Minnesota', 'nome' => 'Minnesota', 'sigla' => 'MN', 'country_id' => 2],
                ['id' => 125, 'name' => 'Mississippi', 'nome' => 'Mississippi', 'sigla' => 'MS', 'country_id' => 2],
                ['id' => 126, 'name' => 'Missouri', 'nome' => 'Missouri', 'sigla' => 'MO', 'country_id' => 2],
                ['id' => 127, 'name' => 'Montana', 'nome' => 'Montana', 'sigla' => 'MT', 'country_id' => 2],
                ['id' => 128, 'name' => 'Nebraska', 'nome' => 'Nebraska', 'sigla' => 'NE', 'country_id' => 2],
                ['id' => 129, 'name' => 'Nevada', 'nome' => 'Nevada', 'sigla' => 'NV', 'country_id' => 2],
                ['id' => 130, 'name' => 'New Hampshire', 'nome' => 'New Hampshire', 'sigla' => 'NH', 'country_id' => 2],
                ['id' => 131, 'name' => 'New Jersey', 'nome' => 'New Jersey', 'sigla' => 'NJ', 'country_id' => 2],
                ['id' => 132, 'name' => 'New Mexico', 'nome' => 'New Mexico', 'sigla' => 'NM', 'country_id' => 2],
                ['id' => 133, 'name' => 'New York', 'nome' => 'New York', 'sigla' => 'NY', 'country_id' => 2],
                ['id' => 134, 'name' => 'North Carolina', 'nome' => 'North Carolina', 'sigla' => 'NC', 'country_id' => 2],
                ['id' => 135, 'name' => 'North Dakota', 'nome' => 'North Dakota', 'sigla' => 'ND', 'country_id' => 2],
                ['id' => 136, 'name' => 'Ohio', 'nome' => 'Ohio', 'sigla' => 'OH', 'country_id' => 2],
                ['id' => 137, 'name' => 'Oklahoma', 'nome' => 'Oklahoma', 'sigla' => 'OK', 'country_id' => 2],
                ['id' => 138, 'name' => 'Oregon', 'nome' => 'Oregon', 'sigla' => 'OR', 'country_id' => 2],
                ['id' => 139, 'name' => 'Pennsylvania', 'nome' => 'Pennsylvania', 'sigla' => 'PA', 'country_id' => 2],
                ['id' => 140, 'name' => 'Rhode Island', 'nome' => 'Rhode Island', 'sigla' => 'RI', 'country_id' => 2],
                ['id' => 141, 'name' => 'South Carolina', 'nome' => 'South Carolina', 'sigla' => 'SC', 'country_id' => 2],
                ['id' => 142, 'name' => 'South Dakota', 'nome' => 'South Dakota', 'sigla' => 'SD', 'country_id' => 2],
                ['id' => 143, 'name' => 'Tennessee', 'nome' => 'Tennessee', 'sigla' => 'TN', 'country_id' => 2],
                ['id' => 144, 'name' => 'Texas', 'nome' => 'Texas', 'sigla' => 'TX', 'country_id' => 2],
                ['id' => 145, 'name' => 'Utah', 'nome' => 'Utah', 'sigla' => 'UT', 'country_id' => 2],
                ['id' => 146, 'name' => 'Vermont', 'nome' => 'Vermont', 'sigla' => 'VT', 'country_id' => 2],
                ['id' => 147, 'name' => 'Virginia', 'nome' => 'Virginia', 'sigla' => 'VA', 'country_id' => 2],
                ['id' => 148, 'name' => 'Washington', 'nome' => 'Washington', 'sigla' => 'WA', 'country_id' => 2],
                ['id' => 149, 'name' => 'West Virginia', 'nome' => 'West Virginia', 'sigla' => 'WV', 'country_id' => 2],
                ['id' => 150, 'name' => 'Wisconsin', 'nome' => 'Wisconsin', 'sigla' => 'WI', 'country_id' => 2],
                ['id' => 151, 'name' => 'Wyoming', 'nome' => 'Wyoming', 'sigla' => 'WY', 'country_id' => 2],
            ];
        }

        return [
            ['id' => 1, 'name' => 'Acre', 'nome' => 'Acre', 'sigla' => 'AC', 'country_id' => 1],
            ['id' => 2, 'name' => 'Alagoas', 'nome' => 'Alagoas', 'sigla' => 'AL', 'country_id' => 1],
            ['id' => 3, 'name' => 'Amapá', 'nome' => 'Amapá', 'sigla' => 'AP', 'country_id' => 1],
            ['id' => 4, 'name' => 'Amazonas', 'nome' => 'Amazonas', 'sigla' => 'AM', 'country_id' => 1],
            ['id' => 5, 'name' => 'Bahia', 'nome' => 'Bahia', 'sigla' => 'BA', 'country_id' => 1],
            ['id' => 6, 'name' => 'Ceará', 'nome' => 'Ceará', 'sigla' => 'CE', 'country_id' => 1],
            ['id' => 7, 'name' => 'Distrito Federal', 'nome' => 'Distrito Federal', 'sigla' => 'DF', 'country_id' => 1],
            ['id' => 8, 'name' => 'Espírito Santo', 'nome' => 'Espírito Santo', 'sigla' => 'ES', 'country_id' => 1],
            ['id' => 9, 'name' => 'Goiás', 'nome' => 'Goiás', 'sigla' => 'GO', 'country_id' => 1],
            ['id' => 10, 'name' => 'Maranhão', 'nome' => 'Maranhão', 'sigla' => 'MA', 'country_id' => 1],
            ['id' => 11, 'name' => 'Mato Grosso', 'nome' => 'Mato Grosso', 'sigla' => 'MT', 'country_id' => 1],
            ['id' => 12, 'name' => 'Mato Grosso do Sul', 'nome' => 'Mato Grosso do Sul', 'sigla' => 'MS', 'country_id' => 1],
            ['id' => 13, 'name' => 'Minas Gerais', 'nome' => 'Minas Gerais', 'sigla' => 'MG', 'country_id' => 1],
            ['id' => 14, 'name' => 'Pará', 'nome' => 'Pará', 'sigla' => 'PA', 'country_id' => 1],
            ['id' => 15, 'name' => 'Paraíba', 'nome' => 'Paraíba', 'sigla' => 'PB', 'country_id' => 1],
            ['id' => 16, 'name' => 'Paraná', 'nome' => 'Paraná', 'sigla' => 'PR', 'country_id' => 1],
            ['id' => 17, 'name' => 'Pernambuco', 'nome' => 'Pernambuco', 'sigla' => 'PE', 'country_id' => 1],
            ['id' => 18, 'name' => 'Piauí', 'nome' => 'Piauí', 'sigla' => 'PI', 'country_id' => 1],
            ['id' => 19, 'name' => 'Rio de Janeiro', 'nome' => 'Rio de Janeiro', 'sigla' => 'RJ', 'country_id' => 1],
            ['id' => 20, 'name' => 'Rio Grande do Norte', 'nome' => 'Rio Grande do Norte', 'sigla' => 'RN', 'country_id' => 1],
            ['id' => 21, 'name' => 'Rio Grande do Sul', 'nome' => 'Rio Grande do Sul', 'sigla' => 'RS', 'country_id' => 1],
            ['id' => 22, 'name' => 'Rondônia', 'nome' => 'Rondônia', 'sigla' => 'RO', 'country_id' => 1],
            ['id' => 23, 'name' => 'Roraima', 'nome' => 'Roraima', 'sigla' => 'RR', 'country_id' => 1],
            ['id' => 24, 'name' => 'Santa Catarina', 'nome' => 'Santa Catarina', 'sigla' => 'SC', 'country_id' => 1],
            ['id' => 25, 'name' => 'São Paulo', 'nome' => 'São Paulo', 'sigla' => 'SP', 'country_id' => 1],
            ['id' => 26, 'name' => 'Sergipe', 'nome' => 'Sergipe', 'sigla' => 'SE', 'country_id' => 1],
            ['id' => 27, 'name' => 'Tocantins', 'nome' => 'Tocantins', 'sigla' => 'TO', 'country_id' => 1],
        ];
    }
}
