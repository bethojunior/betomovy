<?php

namespace Tests\Feature\Import;

use App\Models\User\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ImportControllerTest extends TestCase
{
    /**
     * Teste de importação de clientes
     *
     * @return void
     */
    public function testCustomersImport()
    {
        // Busca um usuário - Moreira
        $user = User::find(55);

        Storage::fake('import');

        $file = UploadedFile::fake()->create('customers.csv');

        $response = $this->actingAs($user, 'api')
            ->withHeader('User-Agent', 'Test')
            ->post('/import/customer', [
            'file' => $file
        ]);

        $response->assertStatus(200);
    }

    /**
     * Teste de importação de motoristas
     *
     * @return void
     */
    public function testDriversImport()
    {
        // Busca um usuário - Moreira
        $user = User::find(55);

        Storage::fake('import');

        $file = UploadedFile::fake()->create('drivers.csv');

        $response = $this->actingAs($user, 'api')
            ->withHeader('User-Agent', 'Test')
            ->post('/import/driver', [
                'file' => $file,
                'userTypeId' => 1
            ]);

        $response->assertStatus(200);
    }
}
