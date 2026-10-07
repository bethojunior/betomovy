<?php


namespace Api\Services\Company;


use Api\Repositories\Company\CompanyDeliveryAreaRepository;
use App\Constants\StatusConst;
use App\Models\Company\CompanyDeliveryArea;
use Illuminate\Support\Facades\DB;

class CompanyDeliveryAreaService
{
    private $repository;

    public function __construct(CompanyDeliveryAreaRepository $repository)
    {
        $this->repository = $repository;
    }

    public function store(array $request)
    {
        $companyDeliveryArea = new CompanyDeliveryArea();
        $companyDeliveryArea->companyId = $request['companyId'];
        $companyDeliveryArea->area = DB::raw("ST_GeomFromText({$this->polygonToString($request['polygon'])})");
        $companyDeliveryArea->save();

        return $companyDeliveryArea;
    }

    public function findAll($companyId)
    {
        $result = $this->repository->findAll($companyId);

        $newResult = array_map(function ($value) {
            $obj = new \stdClass();
            $obj->id = $value['id'];
            $obj->area = $this->polygonToArray($value['area']);
            return $obj;
        }, $result->toArray());

        return $newResult;
    }


    public function delete($id)
    {
        $companyDeliveryArea = $this->repository->find($id);
        $companyDeliveryArea->statusId = StatusConst::REMOVED;
        $companyDeliveryArea->save();
    }

    /**
     * @param array $polygon
     * @return string
     */
    private function polygonToString(array $polygon): string
    {
        $filteredArray = array_map(function ($point) {
            return $point['lat'] . " " . $point['lng'];
        }, $polygon);

        return "'POLYGON((" . implode(',', $filteredArray) . "))'";
    }

    private function polygonToArray(string $polygon)
    {
        $polygon = str_replace(["(", "POLYGON", ")", "'"], '', $polygon);
        $polygon = explode(',', $polygon);

        return array_map(function ($coordinate) {
            $point = new \stdClass;
            $coordinate = explode(" ", $coordinate);

            $point->lat = (float)$coordinate[0];
            $point->lng = (float)$coordinate[1];

            return $point;
        }, $polygon);
    }

}
