<?php

namespace App\Services\WebhookServices;

use App\Repositories\WebhookServices\TypeServicesWebhooksRepository;
use App\Repositories\WebhookServices\WebhookServiceRepository;
use Illuminate\Support\Facades\DB;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;

class WebhookService
{
    /**
     * @var WebhookServiceRepository
     */
    private $repository;

    /**
     * @var TypeServicesWebhooksRepository
     */
    private $typeWebhooksRepository;

    public function __construct(
        WebhookServiceRepository $repository,
        TypeServicesWebhooksRepository $typeWebhooksRepository
    ) {
        $this->repository = $repository;
        $this->typeWebhooksRepository = $typeWebhooksRepository;
    }

    public function insert(array $request = [])
    {
        $webhookFinded = $this->repository->verifyTypeServiceAndUrl($request['type_service_id'], $request['url'], $request['method']);

        if (!is_null($webhookFinded)) {
            throw new ResourceNotFoundException('Já existe um serviço webhook com essas características');
        }

        DB::beginTransaction();
        try {
            $webhookService = $this->repository->create($request);
            DB::commit();

            return $webhookService;
        } catch (\Exception $error) {
            DB::rollBack();
            throw $error;
        }
    }

    public function getAllWebhooksWithoutPagination()
    {
        return $this->repository->findWebhooksWithoutPagination();
    }

    public function getAllWebhookServices()
    {
        return $this->repository->findAllWebhooksPagination();
    }

    public function getOneWebhook(int $id)
    {
        $webhookFinded = $this->repository->find($id);

        if (!$webhookFinded) {
            throw new ResourceNotFoundException('Webhook service não existe');
        }

        return $webhookFinded;
    }

    public function delete(int $id)
    {
        DB::beginTransaction();
        try {
            $webhookFinded = $this->repository->find($id);
            $result = $this->repository->delete($webhookFinded);
            DB::commit();
            return $result;
        } catch (\Exception $error) {
            DB::rollBack();
            throw $error;
        }
    }

    public function update(int $id, array $request = [])
    {
        
        $webhookFinded = $this->repository->getModel()::where('type_service_id', $request['type_service_id'])
        ->where('url', $request['url'])
        ->where('method', $request['method'])
        ->where('id', '<>', $id)
        ->first();

        if (!is_null($webhookFinded)) {
            throw new ResourceNotFoundException('Já existe um serviço webhook com essas características');
        }

        $activeServiceType = $this->repository->getModel()::where('type_service_id', $request['type_service_id'])
        ->where('active', 1)
        ->where('id', '<>', $id) // Exclui o próprio registro da verificação
        ->first();

        if (!is_null($activeServiceType)) {
            throw new ResourceNotFoundException('Já existe um tipo de serviço ativo com este método');
        }

        DB::beginTransaction();
        try {
            $webhook = $this->repository->find($id);

            if (!$webhook) {
                throw new ResourceNotFoundException('Webhook service não existe');
            }

            $webhook->update($request);

            DB::commit();
            return $webhook;
        } catch (\Exception $error) {
            DB::rollBack();
            throw $error;
        }
    }

    public function setInactiveWebhook(int $id, array $request = [])
    {
        DB::beginTransaction();
        try {
            $webhookFinded = $this->repository->setStatusWebhook($id, true, $request['type_service_id']);

            DB::commit();

            return $webhookFinded;
        } catch (\Exception $error) {
            DB::rollBack();
            throw $error;
        }
    }

    public function setActiveWebhook(int $id, array $request = [])
    {
        DB::beginTransaction();
        try {
            $webhookFinded = $this->repository->setStatusWebhook($id, false, $request['type_service_id']);
            DB::commit();

            return $webhookFinded;
        } catch (\Exception $error) {
            DB::rollBack();
            throw $error;
        }
    }

    public function findAllTypesServices()
    {
        return $this->typeWebhooksRepository->all();
    }
}
