<?php

namespace Tests\Feature\PriceDynamic;

use App\Models\User\User;
use Tests\TestCase;

class PriceDynamicControllerTest extends TestCase
{
    /**
     * Teste Listagem de Preços Dinâmicos
     *
     * @return void
     */
    public function testFindAllDynamicPrice()
    {
        // Busca um usuário - Moreira
        $user = User::find(55);

        // Simula uma requisição GET para a rota '/price/dynamic'
        $response = $this->actingAs($user, 'api')
            ->withHeader('User-Agent', 'Test')
            ->get('/price/dynamic');

        // Verifica se a resposta foi bem-sucedida (código de status HTTP 200)
        $response->assertStatus(200);

        // Verifica se o JSON retornado contém a chave "response"
        $response->assertJsonStructure([
            'response',
            'message',
        ]);
    }

    /**
     * Teste Inserção de Preços Dinâmicos
     *
     * @return void
     */
    public function testInsertDynamicPrice()
    {
        // Busca um usuário - Moreira
        $user = User::find(55);

        // Simula uma requisição POST para a rota '/price/dynamic'
        $response = $this->actingAs($user, 'api')
            ->withHeader('User-Agent', 'Test')
            ->post('/price/dynamic', [
                'cityId' => 756,
                'tripTypeId' => 1,
                'dayOfWeek' => [7],
                'timeStart' => "18:00:00",
                'timeEnd' => "19:00:00",
                'price' => 10,
                'active' => true,
                'multiplierValue' => 12
            ]);

        // Verifica se a resposta foi bem-sucedida (código de status HTTP 201)
        $response->assertStatus(201);

        // Verifica se o JSON retornado contém a chave "response"
        $response->assertJsonStructure([
            'response',
            'message',
        ]);
    }

    /**
     * Teste Atualização de Preços Dinâmicos
     *
     * @return void
     */
    public function testUpdateDynamicPrice()
    {
        // Busca um usuário - Moreira
        $user = User::find(55);

        // Simula uma requisição PUT para a rota '/price/dynamic/{id}/update'
        $response = $this->actingAs($user, 'api')
            ->withHeader('User-Agent', 'Test')
            ->put('/price/dynamic/114/update', [
                'cityId' => 756,
                'tripTypeId' => 1,
                'dayOfWeek' => [6],
                'timeStart' => "20:00:00",
                'timeEnd' => "23:00:00",
                'price' => 12,
                'active' => true,
                'multiplierValue' => 12
            ]);

        // Verifica se a resposta foi bem-sucedida (código de status HTTP 200)
        $response->assertStatus(200);

        // Verifica se o JSON retornado contém a chave "response"
        $response->assertJsonStructure([
            'response',
            'message',
        ]);
    }

    /**
     * Teste Remoção de Preços Dinâmicos
     *
     * @return void
     */
    public function testDeleteDynamicPrice()
    {
        // Busca um usuário - Moreira
        $user = User::find(55);

        // Simula uma requisição DELETE para a rota '/price/dynamic/{id}'
        $response = $this->actingAs($user, 'api')
            ->withHeader('User-Agent', 'Test')
            ->delete('/price/dynamic/114');

        // Verifica se a resposta foi bem-sucedida (código de status HTTP 200)
        $response->assertStatus(200);

        // Verifica se o JSON retornado contém a chave "response"
        $response->assertJsonStructure([
            'response',
            'message',
        ]);
    }

    /**
     * Teste Ativação de Preços Dinâmicos
     *
     * @return void
     */
    public function testEnableDynamicPrice()
    {
        // Busca um usuário - Moreira
        $user = User::find(55);

        // Simula uma requisição PUT para a rota '/price/dynamic/{id}/enable'
        $response = $this->actingAs($user, 'api')
            ->withHeader('User-Agent', 'Test')
            ->put('/price/dynamic/114/enable');

        // Verifica se a resposta foi bem-sucedida (código de status HTTP 200)
        $response->assertStatus(200);

        // Verifica se o JSON retornado contém a chave "response"
        $response->assertJsonStructure([
            'response',
            'message',
        ]);
    }

    /**
     * Teste Desativação de Preços Dinâmicos
     *
     * @return void
     */
    public function testDisableDynamicPrice()
    {
        // Busca um usuário - Moreira
        $user = User::find(55);

        // Simula uma requisição PUT para a rota '/price/dynamic/{id}/disable'
        $response = $this->actingAs($user, 'api')
            ->withHeader('User-Agent', 'Test')
            ->put('/price/dynamic/114/disable');

        // Verifica se a resposta foi bem-sucedida (código de status HTTP 200)
        $response->assertStatus(200);

        // Verifica se o JSON retornado contém a chave "response"
        $response->assertJsonStructure([
            'response',
            'message',
        ]);
    }
}
