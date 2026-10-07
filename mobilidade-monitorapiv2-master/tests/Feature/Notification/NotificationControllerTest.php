<?php

namespace Tests\Feature\Notification;

use App\Models\User\User;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class NotificationControllerTest extends TestCase
{
    public function testStoreNotification()
    {
        Storage::fake('cloud'); // Configuração de armazenamento falso para evitar interações reais com o sistema de arquivos

        $requestData = [
            'title' => 'Test de notificação',
            'message' => 'Teste de notificação',
            'usersId' => [1, 2, 3],
        ];

        // Busca um usuário - Moreira
        $user = User::find(55);

        // Simula uma requisição GET para a rota '/notification'
        $response = $this->actingAs($user, 'api')
            ->withHeader('User-Agent', 'Test')
            ->post('/notification', $requestData);

        $response->assertStatus(200);

        // Verifica se o JSON retornado contém a chave "response"
        $response->assertJsonStructure([
            'response',
            'message',
        ]);
    }
}
