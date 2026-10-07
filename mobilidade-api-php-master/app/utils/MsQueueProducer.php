<?php

namespace app\utils;

// Micro service que insere serviços no kafka para gerar stream dos dados
class MsQueueProducer
{
    public function savePrice(array $data): void
    {
        $this->request('/tripPrice/store', 'POST', $data);
    }

    private function request(string $path, string $method, array $data = null)
    {
        $ch = curl_init($this->getUrl().$path);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

        $response = curl_exec($ch);

        curl_close($ch);
        return $response;
    }

    private function getUrl()
    {
        return env('MS_QUEUE_HOST');
    }
}