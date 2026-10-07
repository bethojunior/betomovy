<?php

namespace App\Repositories\WebhookServices;

use App\Models\WebhookServices\WebhookServices;
use App\Contracts\Repository\AbstractRepository;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;

class WebhookServiceRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(WebhookServices::class);
    }


    public function showWebhooksActives()
    {
        return $this->getModel()
            ::where('active', 1)
            ->get();
    }

    public function showWebhooksInactives()
    {
        return $this->getModel()
            ::where('active', 0)
            ->get();
    }

    public function deleteWebhook(int $id)
    {
        return $this->getModel()::where('id', $id)->delete();
    }

    public function setStatusWebhook(int $id, bool $active = false, $type_service_id)
    {
        if (!$active) {
            $isExistsWebhookActive = $this->getModel()::where('active', 1)->where('type_service_id', $type_service_id)->first();

            if ($isExistsWebhookActive) {
                throw new ResourceNotFoundException('Já existe um webhook ativo com esse tipo de serviço.');
            }
        }

        $webhookFinded = $this->getModel()::where('id', $id)->first();

        if (!$webhookFinded) {
            throw new ResourceNotFoundException('Webhook service não existe');
        }

        $webhookFinded->active = $active ? 0 : 1;
        return $webhookFinded->save();
    }

    public function findAllWebhooksPagination()
    {
        return $this->getModel()::with('typeService')->paginate();
    }

    public function verifyTypeServiceAndUrl(int $type_service_id, string $url, string $method)
    {   
        $serviceTypeFinded = $this->getModel()::where('type_service_id', $type_service_id)->where("active", 1)->first();

        if($serviceTypeFinded){
            throw new ResourceNotFoundException('Já existe um serviço webhook com esse tipo de serviço ativo');
        }

        $webhookTypeServiceFinded = $this->getModel()::where('type_service_id', $type_service_id)
            ->where('url', $url)
            ->where("method", $method)
            ->first();

        return $webhookTypeServiceFinded;
    }

    public function findWebhookByService(int $type_service_id, string $url, string $method)
    {
        $webhookFinded = $this->getModel()::where('type_service_id', $type_service_id)->where('active', 1)->first();

        $webhookByUrl = $this->getModel()::where('url', $url)->first();

        if($webhookByUrl){
            throw new ResourceNotFoundException('Já existe um serviço webhook com essa url');
        }

        return $webhookFinded;
    }

    public function findWebhooksWithoutPagination()
    {
        return $this->getModel()::with('typeService')->where('active', 1)->get();
    }
}
