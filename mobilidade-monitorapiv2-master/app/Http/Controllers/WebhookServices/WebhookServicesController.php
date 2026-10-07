<?php

namespace App\Http\Controllers\WebhookServices;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\WebhookServices\WebhookService;
use App\Http\Requests\WebhookServices\WebhookServiceRequest;
use App\Http\Requests\WebhookServices\UpdateStatusWebhookRequest;
use Illuminate\Http\Request;
use Exception;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;

class WebhookServicesController extends Controller
{
    /**
     * @var WebhookService
     */
    private $service;

    public function __construct(
        WebhookService $service
    ) {
        $this->service = $service;
    }

    public function findAll()
    {
        try {
            $allWebhooks = $this->service->getAllWebhookServices();
        } catch (\Exception $error) {
            return ApiResponse::error([
                $error->getMessage()
            ], 'Erro ao buscar webhook services');
        }

        return ApiResponse::success($allWebhooks, "Webhooks listados com sucesso");
    }

    public function findAllWithoutPagination()
    {
        try {
            $responseWebhooks = $this->service->getAllWebhooksWithoutPagination();
        } catch (\Exception $error) {
            return ApiResponse::error([
                $error->getMessage()
            ], "Erro ao buscar webhook services");
        }

        return ApiResponse::success($responseWebhooks, "Webhooks listados com sucesso");
    }

    public function findOne(int $id)
    {
        try {
            $webhookFinded = $this->service->getOneWebhook($id);
        } catch (ResourceNotFoundException $error) {
            return ApiResponse::error([$error->getMessage()], $error->getMessage());
        } catch (Exception $error) {
            return ApiResponse::error([$error->getMessage()], 'Erro ao pegar webhook service');
        }

        return ApiResponse::success($webhookFinded, 'Webhook capturado com sucesso');
    }

    public function insert(WebhookServiceRequest $request)
    {
        try {
            $webhook = $this->service->insert($request->all());
        } catch (ResourceNotFoundException $error) {
            return ApiResponse::error([$error->getMessage()], $error->getMessage());
        } catch (Exception $error) {
            return ApiResponse::error([$error->getMessage()], 'Erro ao cadastrar webhook service');
        }

        return ApiResponse::created($webhook, "Serviço webhook criado com sucesso");
    }

    public function update(int $id, WebhookServiceRequest $request)
    {
        try {
            $resultWebhookUpdated = $this->service->update($id, $request->all());
        } catch (ResourceNotFoundException $error) {
            return ApiResponse::error([$error->getMessage()], $error->getMessage());
        } catch (Exception $error) {
            return ApiResponse::error([$error->getMessage()], 'Erro ao atualizar dados do webhook');
        }

        return ApiResponse::success($resultWebhookUpdated, "Dados atualizado com sucesso");
    }

    public function delete(int $id)
    {
        try {
            $webhook = $this->service->delete($id);
        } catch (Exception $error) {
            return ApiResponse::error([$error->getMessage()], 'Erro ao deletar webhook service');
        }

        return ApiResponse::success($webhook, 'Webhook deletado com sucesso');
    }

    public function setInactiveWebhook(int $id, UpdateStatusWebhookRequest $request)
    {
        try {
            $webhook = $this->service->setInactiveWebhook($id, $request->all());
        } catch (ResourceNotFoundException $error) {
            return ApiResponse::error([$error->getMessage()], $error->getMessage());
        } catch (Exception $error) {
            return ApiResponse::error([$error->getMessage()], 'Erro ao atualizar status webhook service');
        }

        return ApiResponse::success($webhook, 'Status de webhook alterado com sucesso');
    }

    public function setActiveWebhook(int $id, UpdateStatusWebhookRequest $request)
    {
        try {
            $webhook = $this->service->setActiveWebhook($id, $request->all());
        } catch (ResourceNotFoundException $error) {
            return ApiResponse::error([$error->getMessage()], $error->getMessage());
        } catch (Exception $error) {
            return ApiResponse::error([$error->getMessage()], 'Erro ao atualizar status webhook service');
        }

        return ApiResponse::success($webhook, 'Status de webhook alterado com sucesso');
    }

    public function findAllServicesWebhooks()
    {
        try {
            $typesServicesWebhooks = $this->service->findAllTypesServices();
        } catch (Exception $error) {
            return ApiResponse::error([$error->getMessage()], 'Erro ao pegar tipos de serviço');
        }

        return ApiResponse::success($typesServicesWebhooks, 'Tipos de serviço capturados com sucesso');
    }
}
