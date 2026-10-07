<?php

namespace App\Repositories\Transaction;

use App\Contracts\Repository\AbstractRepository;
use App\Models\Transaction\Transaction;
use Illuminate\Support\Str;

class TransactionRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(Transaction::class);
    }

    public function register($data, $responsibleId, $transactionStatus)
    {
        return $this->getModel()
            ::create([
                'idTransaction' => Str::uuid()->toString(),
                'value' => $data->valor_bruto,
                'intermediary_fee' => $data->splitted_taxa_recorrente,
                'generatedPaymentId' => $data->id,
                'transactionStatusId' => $transactionStatus,
                'status' => $data->status_pedido->titulo,
                'status_detailed' => $data->status_pedido->titulo,
                'paymentFormId' => $data->tipo_pedido_id,
                'intermediaryId' => 8,
                'userId' => $responsibleId
            ]);
    }
}
