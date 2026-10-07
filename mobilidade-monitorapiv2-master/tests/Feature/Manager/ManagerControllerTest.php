<?php

namespace Tests\Feature\Manager;

use App\Models\Balance\Balance;
use App\Models\User\User;
use Tests\TestCase;

class ManagerControllerTest extends TestCase
{
    /**
     * Teste de Listagem de Gestores
     *
     * @return void
     */
    public function testGetAllManagers()
    {
        // Busca um usuário - Moreira
        $user = User::find(55);

        // Simula uma requisição GET para a rota 'manager.getAllManagers'
        $response = $this->actingAs($user, 'api')
            ->withHeader('User-Agent', 'Test')
            ->get('/manager');

        // Verifica se a resposta foi bem-sucedida (código de status HTTP 200)
        $response->assertStatus(200);

        // Verifica se o JSON retornado contém a chave "response"
        $response->assertJsonStructure([
            'response',
            'message',
        ]);
    }

    /**
     * Teste de Inserção de Gestor
     *
     * @return void
     */
    public function testInsertManager()
    {
        // Busca um usuário - Teste
        $user = User::find(7);

        // Criando um Balance para o gestor
        $balance = Balance::create();

        // Dados para a inserção do gestor
        $managerData = [
                "motValueTypeCommission" => "$",
                "motValueCommission" => 1.2,
                "cliValueTypeCommission" => "$",
                "cliValueCommission" => 3.4,
                "userId" => "7",
                "cityId" => 756,
                "balanceId" => $balance->idBalance,
                "managerRegisterStatusId" => 1
        ];

        // Simula uma requisição POST para a rota 'manager.store'
        $response = $this->actingAs($user, 'api')
            ->withHeader('User-Agent', 'Test')
            ->post('/manager', $managerData);

        // Verifica se a resposta foi bem-sucedida (código de status HTTP 200)
        $response->assertStatus(200);

        // Verifica se o JSON retornado contém as chaves esperadas
        $response->assertJsonStructure([
            'response',
            'message'
        ]);
    }

    /**
     * Teste de Edição de Gestor
     *
     * @return void
     */
    public function testUpdateManager()
    {
        // Busca um usuário - Teste
        $user = User::find(7);

        // Busca um gestor - Teste
        $manager = User::find(7)->manager;

        // Dados para a edição do gestor
        $managerData = [
                "motValueTypeCommission" => "$",
                "motValueCommission" => 2.2,
                "cliValueTypeCommission" => "$",
                "cliValueCommission" => 4.4,
                "userId" => "7",
                "cityId" => 756,
                "balanceId" => $manager->balanceId,
                "managerRegisterStatusId" => 1
        ];

        // Simula uma requisição PUT para a rota 'manager.update'
        $response = $this->actingAs($user, 'api')
            ->withHeader('User-Agent', 'Test')
            ->put('/manager/' . $manager->id, $managerData);

        // Verifica se a resposta foi bem-sucedida (código de status HTTP 200)
        $response->assertStatus(200);

        // Verifica se o JSON retornado contém as chaves esperadas
        $response->assertJsonStructure([
            'response',
            'message'
        ]);
    }

    /**
     * Teste de Remoção de Gestor
     *
     * @return void
     */
    public function testRemoveManager()
    {
        // Busca um usuário - Teste
        $user = User::find(7);

        // Busca um gestor - Teste
        $manager = User::find(7)->manager;

        // Simula uma requisição DELETE para a rota 'manager.removeManager'
        $response = $this->actingAs($user, 'api')
            ->withHeader('User-Agent', 'Test')
            ->delete('/manager/' . $manager->id);

        // Verifica se a resposta foi bem-sucedida (código de status HTTP 200)
        $response->assertStatus(200);

        // Verifica se o JSON retornado contém as chaves esperadas
        $response->assertJsonStructure([
            'response',
            'message'
        ]);
    }

    /**
     * Teste de Listagem de Motoristas por Gestor
     *
     * @return void
     */
    public function testGetDriversByManager()
    {
        // Busca um usuário - Teste
        $user = User::find(7);

        // Busca um gestor - Teste
        $manager = User::find(7)->manager;

        // Simula uma requisição GET para a rota 'manager.getDriversByManager'
        $response = $this->actingAs($user, 'api')
            ->withHeader('User-Agent', 'Test')
            ->get('/manager/' . $manager->userId . '/drivers');

        // Verifica se a resposta foi bem-sucedida (código de status HTTP 200)
        $response->assertStatus(200);

        // Verifica se o JSON retornado contém a chave "response"
        $response->assertJsonStructure([
            'response',
            'message',
        ]);
    }
}
