<?php

namespace App\Services\WhatsApp;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Bus;
use App\Services\Pulse\PulseService;

class WhatsAppService
{
    private string $sessionName;
    private string $endPoint;
    private string $requestHeaderToken;
    private $pulseService;

    public function __construct()
    {
        $this->sessionName = env('APP_NAME', 'dev');
        $this->endPoint = env('API_WHATS_APP_SEND_MESSAGE', 'https://api.movymob.com/whatsapp/send-message');
        $this->requestHeaderToken = env('API_WHATS_REQUEST_HEADER_TOKEN', '704apps');
        $this->pulseService = new PulseService(env('APP_NAME', 'monitor-api-v2'), 'd5096670-ac06-482d-8919-36901ac36e92');
    }

    public function handle(string $phoneNumber, string $message): void
    {

        $traceAsString = (new \Exception())->getTraceAsString();
        $this->pulseService->handle('WhatsAppService istanced', $traceAsString, 'info');
        try {
            $phone = preg_replace('/\D/', '', $phoneNumber);
            $payload = [
                'message'     => $message,
                'sessionName' => $this->sessionName,
                'phoneNumber' => $phone,
            ];
            $endPoint = $this->endPoint;
            $requestHeaderToken = $this->requestHeaderToken;
            Bus::dispatch(function () use ($endPoint, $requestHeaderToken, $payload) {
                Http::withHeaders([
                    'Authorization' => $requestHeaderToken,
                    'Content-Type'  => 'application/json',
                ])->post($endPoint, $payload);
            });
        } catch (\Exception $e) {
            $this->pulseService->handle('WhatsAppService', $e->getTraceAsString(), 'error');
            Log::error('Exception when dispatching WhatsApp message job. ' . $e->getMessage());
        }
    }
}
