<?php

namespace Tests\Feature\Authenticate;

use App\Services\User\AuthenticationService;
use Tests\TestCase;

class AuthAdminApiControllerTest extends TestCase
{
    /**
     * Teste de autenticação do usuário
     *
     * @return void
     */
    public function testLoginAuthentication()
    {
        // Define dados de exemplo
        $requestData = [
            'email' => 'suporte@fabrica704.com.br',
            'password' => '@dminP@ss12',
            'localization' => 'https://google.com/maps?q=-3.8107781,-38.5351346',
        ];

        // Simula uma requisição POST para a rota 'authentication'
        $response = $this->postJson('/login', $requestData);

        // Verifica se a resposta foi bem-sucedida (código de status HTTP 200)
        $response->assertStatus(200);

        // Verifica se o JSON retornado contém a chave "response" e "message"
        $response->assertJsonStructure([
            'response',
            'message',
        ]);

        // Adiciona verificações específicas para as condições do método authenticate
        $responseData = $response->json();

        // Verifica se o campo 'response' contém o token de API
        $this->assertArrayHasKey('api_token', $responseData['response']);

        // Verifica se o campo 'role' está presente e contém o valor esperado
        $this->assertArrayHasKey('role', $responseData['response']);
        $this->assertEquals('1', $responseData['response']['roleId']);

        // Verifica se o campo 'statusPay' está presente e contém o valor esperado
        $this->assertArrayHasKey('statusPay', $responseData['response']);
        $this->assertEquals(1, $responseData['response']['statusPay']['id']);
    }
}
