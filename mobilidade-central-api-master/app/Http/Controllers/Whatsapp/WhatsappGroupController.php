<?php

namespace App\Http\Controllers\Whatsapp;

use App\Http\Controllers\Controller;
use App\Http\Requests\Whatsapp\FindWhatsappGroupRequest;
use App\Http\Requests\Whatsapp\StoreNotificationWhatsappGroupRequest;
use App\Http\Requests\Whatsapp\StoreWhatsappGroupRequest;
use App\Http\Requests\Whatsapp\UpdateWhatsappGroupRequest;
use App\Services\Whatsapp\WhatsappGroupService;
use Illuminate\Http\Request;

class WhatsappGroupController extends Controller
{

    private WhatsappGroupService $service;

    public function __construct(WhatsappGroupService $service)
    {
        $this->service = $service;
    }

    public function index(FindWhatsappGroupRequest $request)
    {
        return $this->service->findConfigByParams(
            $request->validated()
        );
    }

    public function store(StoreWhatsappGroupRequest $request)
    {
        return $this->service->storeConfig($request->validated());
    }

    public function update(UpdateWhatsappGroupRequest $request, $id)
    {
        return $this->service->updateConfig($id, $request->validated());
    }

    public function indexNotification(FindWhatsappGroupRequest $request)
    {
        return $this->service->findNotificationConfigByParams(
            $request->validated()
        );
    }

    public function storeNotification(StoreNotificationWhatsappGroupRequest $request)
    {
        return $this->service->storeNotificationsConfig($request->validated());
    }
}
