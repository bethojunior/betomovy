<?php

namespace App\Utils\Acquirers\ZsPay;

use App\Utils\FormatValue;

class Establishment
{
    private $connection;

    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }

    public function create(array $establishment)
    {
        return $this->connection->post('/estabelecimentos/', $establishment);
    }

    public function index()
    {
        return $this->connection->get('/estabelecimentos/filhos/');
    }

    public function findById(string $establishment)
    {
        return $this->connection->get('/estabelecimentos/' . $establishment);
    }

    public function findByDocument(string $document)
    {
        return $this->connection->get('/estabelecimentos/por_documento/' . FormatValue::formatDocumentClear($document));
    }

    public function bankAccounts(int $establishment)
    {
        return $this->connection->get('/estabelecimentos/' . $establishment . '/contas_bancarias/');
    }

    public function activeBankAccount(array $accounts): array
    {
        return array_filter($accounts, function ($account) {
            return $account->ativo;
        });
    }
}
