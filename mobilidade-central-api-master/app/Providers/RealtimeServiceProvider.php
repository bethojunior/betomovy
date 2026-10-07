<?php

namespace App\Providers;

use App\Contracts\Realtime\ChatRealtimeService;
use Illuminate\Support\ServiceProvider;
use App\Contracts\Realtime\TripRealtimeService;
use App\Models\Config\Config;

class RealtimeServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton(TripRealtimeService::class, function ($app) {
            if ($this->shouldUseSocket()) {
                return new \App\Services\Realtime\Trip\SocketTripRealtimeService(
                    $app->make(\App\Realtimes\Clients\TripRealtimeApiClient::class)
                );
            }

            return new \App\Services\Realtime\Trip\FirestoreTripRealtimeService(
                $app->make(\App\Repositories\Realtime\TripFirestoreRepository::class)
            );
        });

        $this->app->singleton(ChatRealtimeService::class, function ($app) {
            // TODO: Descomentar o código abaixo após integrar o chat via WebSocket.
            // if ($this->shouldUseSocket()) {
            //     return new \App\Services\Realtime\Chat\SocketChatRealtimeService(
            //         $app->make(\App\Realtimes\Clients\ChatRealtimeApiClient::class)
            //     );
            // }

            return new \App\Services\Realtime\Chat\FirestoreChatRealtimeService(
                $app->make(\App\Repositories\Realtime\ChatFirestoreRepository::class)
            );
        });
    }

    /**
     * Verifica de forma segura se a implementação de socket deve ser usada.
     * Evita erros de conexão com o banco durante o build do Composer.
     *
     * @return bool
     */
    private function shouldUseSocket(): bool
    {
        try {
            if ($this->app->runningInConsole() && !$this->isDatabaseConnected()) {
                return false;
            }

            return (bool) Config::getConf('enable_realtime_socket');
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Verifica se a conexão com o banco de dados padrão está ativa.
     *
     * @return bool
     */
    private function isDatabaseConnected(): bool
    {
        try {
            $this->app['db']->connection()->getPdo();
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }
}
