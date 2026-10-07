<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 12/08/2020
 * Time: 14:54
 */

namespace App\Http\Controllers\Trip;


use App\Http\Controllers\Controller;
use App\Http\Requests\Trip\Toll\TollRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Trip\Toll\Toll;
use App\Services\Trip\Toll\TollService;
use Illuminate\Http\Request;

class TollController extends Controller
{
    /**
     * @var TollService
     */
    private $service;

    public function __construct(TollService $service)
    {
        $this->service = $service;
    }

    public function insert(TollRequest $request)
    {
        try {
            $result = $this->service
                ->insert($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir pedágio");
        }

        return ApiResponse::created($result);
    }

    public function all(Request $request)
    {
        try {
            $result = $this->service
                ->findAll($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar pedágios");
        }

        return ApiResponse::success($result);
    }

    public function byCity($cityId)
    {
        try {
            $city['cityId'] = $cityId;
            $data = $this->service->byCity($city);
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function update(Toll $toll, TollRequest $request)
    {
        try {
            $validatedData = $request->validated();
            $updatedToll = $this->service->update($toll, $validatedData);
        } catch (\Throwable $e) {
            return ApiResponse::error($e, 'Erro ao atualizar pedágio');
        }
    
        return ApiResponse::success($updatedToll);
    }
    

    public function delete(Toll $toll)
    {
        try {
            $result = $this->service
                ->delete($toll);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir pedágio");
        }

        return ApiResponse::success($result);
    }
}
