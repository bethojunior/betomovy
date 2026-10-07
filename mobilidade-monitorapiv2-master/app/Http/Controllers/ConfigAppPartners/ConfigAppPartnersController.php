<?php

namespace App\Http\Controllers\ConfigAppPartners;

use App\Http\Responses\ApiResponse;
use App\Services\ConfigAppPartners\ConfigAppPartnersService;
use App\Http\Controllers\Controller;
use App\Http\Requests\ConfigAppPartners\ConfigAppPartnersRequest;
use App\Http\Requests\ConfigAppPartners\ConfigAppPartnersUpdateRequest;

class ConfigAppPartnersController extends Controller
{
  /**
   * @var AddressService
   */
  private $service;

  public function __construct(ConfigAppPartnersService $service)
  {
    $this->service = $service;
  }

  public function insert(ConfigAppPartnersRequest $request)
  {
    try {
      $result = $this->service->insertConfigApp($request->all());
    } catch (\Exception $e) {
      return ApiResponse::error($e, "Erro ao inserir dados");
    }

    return ApiResponse::created($result, "Dados inserido com sucesso");
  }

  public function update(int $id, ConfigAppPartnersUpdateRequest $request)
  {
    try {
      $result = $this->service->updateConfigApp($request->all(), $id);
    } catch (\Exception $e) {
      return ApiResponse::error($e, "Erro ao atualizar dados");
    }

    return ApiResponse::success($result, "Dados atualizado com sucesso");
  }

  public function delete(int $id)
  {
    try {
      $result = $this->service->deleteConfigApp($id);
    } catch (\Exception $e) {
      return ApiResponse::error($e, "Erro ao deletar configuração");
    }

    return ApiResponse::success($result, "Configuração deletada com sucesso");
  }

  public function getAll()
  {
    try {
      $result = $this->service->findAllConfigsAppsPartners();
    } catch (\Exception $e) {
      return ApiResponse::error($e, "Erro ao buscar configs de apps");
    }

    return ApiResponse::success($result);
  }

  public function getAllWithoutPagination()
  {
    try {
      $result = $this->service->findAllWithoutPagination();
    } catch (\Exception $e) {
      return ApiResponse::error($e, "Erro ao buscar configs de apps");
    }

    return ApiResponse::success($result);
  }
}
