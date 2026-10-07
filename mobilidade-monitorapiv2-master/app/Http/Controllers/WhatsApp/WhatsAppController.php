<?php

namespace App\Http\Controllers\WhatsApp;

use App\Http\Controllers\Controller;
use App\Http\Requests\WhatsApp\WhatsAppManyRequest;
use App\Services\WhatsApp\WhatsAppService;
use Symfony\Component\HttpFoundation\Request;

class WhatsAppController extends Controller
{
    private $whatsAppService;

    public function __construct(WhatsAppService $whatsAppService)
    {
        $this->whatsAppService = $whatsAppService;
    }

    public function handle(Request $request)
    {
        $phone = $request->get('phone');
        $message = $request->get('message');

        if(!$phone)
            return response()->json(['error' => 'Miss phone field'], 422);

        if(!$message)
            return response()->json(['error' => 'Miss message field'], 422);


        $this->whatsAppService->handle($phone, $message);
        return response()->json(['success' => 'Message sent successfully']);
    }

     public function handleSendMany(WhatsAppManyRequest $request)
    {
        $messages = $request->validated()['messages'];

        foreach ($messages as $item) {
            $this->whatsAppService->handle($item['phone'], $item['message']);
        }

        return response()->json(['success' => 'All messages sent successfully']);
    }

}
