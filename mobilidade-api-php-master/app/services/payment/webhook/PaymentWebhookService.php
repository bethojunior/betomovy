<?php

namespace app\services\payment\webhook;

use app\constant\DriverBalanceConst;
use app\constant\FinancialIntermediaryConst;
use app\constant\TransactionConst;
use app\constant\TransactionTypeConst;
use app\dao\BalanceFlowDao;
use app\dao\CustomerDao;
use app\dao\DriverBalanceDao;
use app\dao\DriverDao;
use app\dao\TransactionDao;
use app\dao\TripPixPaymentsDao;
use app\model\PaymentForm;
use app\model\Transaction;
use app\model\VoucherPurchase;
use app\services\CheckoutService;
use app\services\CreditPrepaidPurchaseService;
use app\services\CustomerVoucherPurchaseService;
use app\services\TransactionService;
use app\services\VoucherPurchaseService;
use Exception;
use stdClass;

class PaymentWebhookService
{
    private TransactionService $transactionService;
    private VoucherPurchaseService $voucherPurchaseService;
    private DriverBalanceDao $driverBalanceDao;
    private BalanceFlowDao $balanceFlowDao;
    private DriverDao $driverDao;
    private TransactionDao $transactionDao;
    private CreditPrepaidPurchaseService $creditPrepaidPurchaseService;
    private TripPixPaymentsDao $tripPixPaymentsDao;
    private CheckoutService $checkoutService;

    public function __construct()
    {
        $this->transactionService = new TransactionService();
        $this->voucherPurchaseService = new voucherPurchaseService();
        $this->transactionDao = new TransactionDao();
        $this->driverBalanceDao = new DriverBalanceDao();
        $this->balanceFlowDao = new BalanceFlowDao();
        $this->driverDao = new DriverDao();
        $this->creditPrepaidPurchaseService = new creditPrepaidPurchaseService();
        $this->tripPixPaymentsDao = new TripPixPaymentsDao();
        $this->checkoutService = new CheckoutService();
    }

    public function processPayment(stdClass $request): array
    {
        $transaction = new Transaction($this->transactionDao->findByField('generatedPaymentId', $request->uuid));

        if (!$transaction) {
            throw new Exception('Transação não encontrada');
        }

        if (intval($transaction->getTransactionStatusId()) !== TransactionConst::PENDENTE) {
            throw new Exception('A transação não está aguardando pagamento');
        }

        switch ($transaction->getTypeId()) {
            case TransactionTypeConst::NEGATIVE_BALANCE:
                $this->payNegativeBalanceTransaction($transaction);
                return [
                    'status' => 200,
                    'message' => 'Pagamento realizado com sucesso.',
                    'data' => ['id', $transaction->getIdTransaction()]
                ];
            case TransactionTypeConst::VOUCHER:
                $this->transactionService->confirmPixTransactionv2($transaction);
                $voucher = $this->voucherPurchaseService->getVoucherPurchaseByTransaction($transaction);

                if (!$voucher) {
                    return [
                        'status' => 404,
                        'message' => 'Voucher não encontrado.',
                        'data' => []
                    ];
                }

                $transactionCompleted = $this->transactionService->find($transaction->getIdTransaction());
                $this->voucherPurchaseService->updateByTransaction(
                    (new VoucherPurchase($voucher))->getIdVoucherPurchase(),
                    $transactionCompleted
                );

                return [
                    'status' => 200,
                    'message' => 'Pagamento realizado com sucesso.',
                    'data' => ['id' => $transaction->getIdTransaction()]
                ];
            case TransactionTypeConst::CREDIT_PREPAID:
                $this->creditPrepaidPurchaseService->creditPrepaidPixConfirm($transaction);

                return [
                    'status' => 200,
                    'message' => 'Pagamento realizado com sucesso.',
                    'data' => ['id' => $transaction->getIdTransaction()]
                ];
            default:
                return [
                    'status' => 403,
                    'message' => 'Ação não mapeada para este tipo de transação.',
                    'data' => ['body' => $request]
                ];
        }
    }

    public function proccessPaymentIpag($request)
    {
        if ($request->event === "PAYMENT.AUTHORIZED") {
            if ($request->data->transactionType === "pix") {
                $transaction = new Transaction($this->transactionDao->findByField('generatedPaymentId', $request->data->id));

                switch ($transaction->getTypeId()) {
                    case TransactionTypeConst::NEGATIVE_BALANCE:
                        $this->payNegativeBalanceTransaction($transaction);
                        return [
                            'status' => 200,
                            'message' => 'Pagamento realizado com sucesso.',
                            'data' => ['id', $transaction->getIdTransaction()]
                        ];
                    case TransactionTypeConst::VOUCHER:
                        $this->transactionService->confirmPixTransactionv2($transaction);
                        $voucher = $this->voucherPurchaseService->getVoucherPurchaseByTransaction($transaction);

                        if (!$voucher) {
                            return [
                                'status' => 404,
                                'message' => 'Voucher não encontrado.',
                                'data' => []
                            ];
                        }

                        $transactionCompleted = $this->transactionService->find($transaction->getIdTransaction());
                        $this->voucherPurchaseService->updateByTransaction(
                            (new VoucherPurchase($voucher))->getIdVoucherPurchase(),
                            $transactionCompleted
                        );
                        $customerDao = new CustomerDao();

                        $customer = $customerDao
                            ->findByUser($transactionCompleted->getUserId());

                        $customerVoucherPurchaseService = new CustomerVoucherPurchaseService();

                        $customerVoucherPurchaseService->manageTripBalance(
                            $transactionCompleted,
                            new VoucherPurchase($voucher),
                            $customer->balanceId
                        );

                        return [
                            'status' => 200,
                            'message' => 'Pagamento realizado com sucesso.',
                            'data' => ['id' => $transaction->getIdTransaction()]
                        ];
                    case TransactionTypeConst::CREDIT_PREPAID:
                        $this->creditPrepaidPurchaseService->creditPrepaidPixConfirm($transaction);

                        return [
                            'status' => 200,
                            'message' => 'Pagamento realizado com sucesso.',
                            'data' => ['id' => $transaction->getIdTransaction()]
                        ];
                    case TransactionTypeConst::TRIP:
                        return $this->confirmPixTransaction($transaction);
                    case TransactionTypeConst::TRIP_END:
                        return $this->finalizePixTripTransaction($transaction);
                    default:
                        return [
                            'status' => 403,
                            'message' => 'Ação não mapeada para este tipo de transação.',
                            'data' => ['body' => $request]
                        ];
                }
            }
        }
    }

    private function confirmPixTransaction(Transaction $transaction)
    {
        $this->transactionService->confirmPixTransactionv2($transaction);
        $this->checkoutService->dispatchTransactionStatusToAdmin(
            $transaction->getIdTransaction(),
            TransactionConst::COMPLETED
        );

        return [
            'status' => 200,
            'message' => 'Pagamento realizado com sucesso.',
            'data' => ['id' => $transaction->getIdTransaction()]
        ];
    }

    private function payNegativeBalanceTransaction(Transaction $transaction)
    {
        $this->transactionService->confirmPixTransaction($transaction);
        $this->checkoutService->dispatchTransactionStatusToAdmin(
            $transaction->getIdTransaction(),
            TransactionConst::COMPLETED
        );

        // não exige conta bancária — usava findWithAccountInfo (INNER JOIN em bankAccount)
        $driverAccountInfo = $this->driverBalanceDao->findByUser($transaction->getUserId());

        $totalBalance = $driverAccountInfo->balance + $transaction->getValue();
        $this->driverBalanceDao->updateBalance($driverAccountInfo->idBalance, [
            'amount' => $totalBalance,
        ]);

        $this->balanceFlowDao->insertWithTransaction(
            $transaction->getValue(),
            DriverBalanceConst::TRANSFER_RECEIVING,
            $driverAccountInfo->idBalance,
            $transaction->getIdTransaction()
        );
    }

    private function finalizePixTripTransaction($transaction)
    {
        // Confirma transação Pix
        $this->transactionService->confirmPixTransactionv2($transaction);
        $this->checkoutService->dispatchTransactionStatusToAdmin(
            $transaction->getIdTransaction(),
            TransactionConst::COMPLETED
        );

        // Busca a transação através da corrida
        $tripPixPayment = $this->tripPixPaymentsDao->getByIdTransaction($transaction->getIdTransaction());

        // Busca o balance flow de entrada de dinheiro
        $balanceFlow = $this->balanceFlowDao->findByTripReferenceAndBalanceFlowType(
            $tripPixPayment->tripReference,
            DriverBalanceConst::BALANCE_ENTRY_BY_TRIP_PAYMENT_IN_CAR
        );

        // Atualiza o tipo de transação do balance flow para entrada via Pix
        // e credita o saldo apenas quando o finishTrip já rodou antes do PIX ser pago
        // (cenário: pagamento originado como dinheiro e convertido para PIX)
        // Quando finishTrip ainda não rodou, o próprio finishTrip creditará o saldo com as taxas corretas
        if ($balanceFlow) {
            $this->balanceFlowDao->updateType(
                $balanceFlow->idBalanceFlow,
                DriverBalanceConst::BALANCE_IN_FOR_PIX
            );

            $balance = $this->driverBalanceDao->findByUser($transaction->getUserId());
            $this->driverBalanceDao->updateBalance($balance->idBalance, [
                'amount' => ($balance->balance + $transaction->getValue()),
            ]);
        }

        // Deleta o balance flow de saída de dinheiro criado no fim da corrida
        $this->balanceFlowDao->deleteByTripReferenceAndBalanceFlowType(
            $tripPixPayment->tripReference,
            DriverBalanceConst::BALANCE_OUT_BY_TRIP_PAYMENT_IN_CAR
        );

        return [
            'status' => 200,
            'message' => 'Pagamento realizado com sucesso.',
            'data' => ['id' => $transaction->getIdTransaction()]
        ];
    }

    public function proccessPaymentFB($request)
    {
        $data = $request->data;

        // Só processa PIX
        if (($data->paymentMethod ?? null) !== 'pix') {
            return $this->response(200, 'Método de pagamento não suportado (não é PIX)');
        }
                        
        $transaction = $this->findTransactionByGeneratedPaymentId($data->id);

        if (empty($transaction)) {
            return $this->response(404, 'Transação não encontrada');
        }

        if ($data->status === 'refunded') {
            return $this->handleRefundedTransaction($transaction);
        }
        
        if ($data->status === 'paid') {
            return $this->handlePixPaidTransaction($transaction);
        }

        return $this->response(200, 'Status recebido sem ação de confirmação', $data);
    }

    public function proccessPaymentMP($request)
    {
        $paymentId = $request->data->id ?? null;

        if (empty($paymentId)) {
            return $this->response(400, 'MercadoPago sem identificador de pagamento');
        }

        $transaction = $this->findTransactionByGeneratedPaymentId($paymentId);

        if (empty($transaction)) {
            return $this->response(404, 'Transação não encontrada');
        }

        $payment = $this->checkoutService->findPixPayment(
            FinancialIntermediaryConst::MERCADO_PAGO,
            null,
            $paymentId
        );

        $status = $payment->status ?? null;

        if ($status === 'approved') {
            return $this->handlePixPaidTransaction($transaction);
        }

        if ($status === 'rejected') {
            return $this->handleDeniedTransaction($transaction);
        }

        if ($status === 'cancelled' || $status === 'refunded' || $status === 'charged_back') {
            return $this->handleCanceledTransaction($transaction);
        }

        return $this->response(200, 'Status recebido sem ação de confirmação', [
            'payment_id' => $paymentId,
            'status'     => $status,
        ]);
    }

    public function proccessPaymentYume($request)
    {
        $payload = isset($request->data) ? $request->data : $request;
        $payload = isset($payload->data) ? $payload->data : $payload;

        $paymentId = $payload->online_sale_id
            ?? $payload->id
            ?? $payload->uuid
            ?? null;

        if (empty($paymentId)) {
            return $this->response(400, 'YumePay sem identificador de pagamento');
        }

        $transaction = $this->findTransactionByGeneratedPaymentId($paymentId);

        if (empty($transaction)) {
            return $this->response(404, 'Transação não encontrada');
        }

        $status = strtoupper((string) ($payload->sale_status ?? $payload->status ?? ''));

        if ($status === 'CONFIRMED' || $status === 'PAID' || $status === 'SUCCESS') {
            return $this->handlePixPaidTransaction($transaction);
        }

        if (
            $status === 'DECLINED' || $status === 'DENIED' || $status === 'REFUSED' ||
            $status === 'FAILED'   || $status === 'EXPIRED'
        ) {
            return $this->handleDeniedTransaction($transaction);
        }

        if ($status === 'CANCELED' || $status === 'CANCELLED') {
            return $this->handleCanceledTransaction($transaction);
        }

        return $this->response(200, 'Status recebido sem ação de confirmação', [
            'payment_id' => $paymentId,
            'sale_status' => $status,
        ]);
    }

    private function handleCanceledTransaction(Transaction $transaction): array
    {
        $this->updateTransactionStatusAndDispatch($transaction, TransactionConst::REJECTED);

        return $this->response(200, 'Transação cancelada processada com sucesso', 
            ['id' => $transaction->getIdTransaction()]
        );
    }

    private function handleDeniedTransaction(Transaction $transaction): array
    {
        $this->updateTransactionStatusAndDispatch($transaction, TransactionConst::DANIED);

        return $this->response(200, 'Transação negada processada com sucesso', 
            ['id' => $transaction->getIdTransaction()]
        );
    }

    private function handleRefundedTransaction(Transaction $transaction): array
    {
        $this->updateTransactionStatusAndDispatch($transaction, TransactionConst::REFUNDED);

        return $this->response(200, 'Estorno processado com sucesso', 
            ['id' => $transaction->getIdTransaction()]
        );
    }

    private function updateTransactionStatusAndDispatch(Transaction $transaction, int $status)
    {
        $transactionId = $transaction->getIdTransaction();

        $this->transactionDao->updateStatus($transactionId, $status);

        $this->checkoutService->dispatchTransactionStatusToAdmin($transactionId, $status);
    }

    private function handlePixPaidTransaction(Transaction $transaction)
    {
        if ($transaction->isCompleted()) {
            return $this->response(200, 'Transação já processada');
        }

        switch ($transaction->getTypeId()) {
            case TransactionTypeConst::NEGATIVE_BALANCE:
                $this->payNegativeBalanceTransaction($transaction);
                break;

            case TransactionTypeConst::VOUCHER:
                $this->handleVoucherPixTransaction($transaction); // OK
                break;

            case TransactionTypeConst::CREDIT_PREPAID: // OK
                $this->creditPrepaidPurchaseService
                    ->creditPrepaidPixConfirm($transaction);
                break;

            case TransactionTypeConst::TRIP:
                return $this->confirmPixTransaction($transaction);

            case TransactionTypeConst::TRIP_END:
                return $this->finalizePixTripTransaction($transaction);

            default:
                return [
                    'status' => 403,
                    'message' => 'Ação não mapeada para este tipo de transação.',
                ];
        }

        return [
            'status' => 200,
            'message' => 'Pagamento realizado com sucesso.',
            'data' => ['id' => $transaction->getIdTransaction()]
        ];
    }

    private function handleVoucherPixTransaction(Transaction $transaction)
    {
        $this->transactionService->confirmPixTransactionv2($transaction);
        $this->checkoutService->dispatchTransactionStatusToAdmin(
            $transaction->getIdTransaction(),
            TransactionConst::COMPLETED
        );

        $voucher = $this->voucherPurchaseService->getVoucherPurchaseByTransaction($transaction);

        if (!$voucher) {
            throw new \RuntimeException('Voucher não encontrado');
        }

        $transactionCompleted = $this->transactionService->find($transaction->getIdTransaction());
        $this->voucherPurchaseService->updateByTransaction(
            (new VoucherPurchase($voucher))->getIdVoucherPurchase(),
            $transactionCompleted
        );
        $customerDao = new CustomerDao();

        $customer = $customerDao
            ->findByUser($transactionCompleted->getUserId());

        $customerVoucherPurchaseService = new CustomerVoucherPurchaseService();

        $customerVoucherPurchaseService->manageTripBalance(
            $transactionCompleted,
            new VoucherPurchase($voucher),
            $customer->balanceId
        );
    }

    public function processPaymentStripe(array $event): array
    {
        $eventType = $event['type'] ?? '';
        $object = $event['data']['object'] ?? [];
        $paymentIntentId = $object['id'] ?? null;

        if (empty($paymentIntentId)) {
            return $this->response(400, 'payment_intent id ausente');
        }

        $transaction = $this->findTransactionByGeneratedPaymentId($paymentIntentId);
        if (!$transaction) {
            // Evento sem transação local ainda (ex.: intent criado fora do fluxo) — ack sem erro.
            return $this->response(200, 'Evento Stripe recebido sem transação local', [
                'payment_intent' => $paymentIntentId,
                'type' => $eventType,
            ]);
        }

        switch ($eventType) {
            case 'payment_intent.succeeded':
            case 'charge.succeeded':
                // PIX Stripe reutiliza o fluxo PIX; cartão só marca COMPLETED
                if ((int) $transaction->getPaymentFormId() === PaymentForm::PIX) {
                    return $this->handlePixPaidTransaction($transaction);
                }
                $this->updateTransactionStatusAndDispatch($transaction, TransactionConst::COMPLETED);
                return $this->response(200, 'Pagamento Stripe (cartão) confirmado', [
                    'id' => $transaction->getIdTransaction(),
                    'payment_intent' => $paymentIntentId,
                ]);

            case 'payment_intent.amount_capturable_updated':
                $this->updateTransactionStatusAndDispatch($transaction, TransactionConst::PENDENTE);
                return $this->response(200, 'Pagamento Stripe autorizado (aguarda captura)', [
                    'id' => $transaction->getIdTransaction(),
                ]);

            case 'payment_intent.payment_failed':
            case 'charge.failed':
                return $this->handleDeniedTransaction($transaction);

            case 'payment_intent.canceled':
                return $this->handleCanceledTransaction($transaction);

            case 'charge.refunded':
            case 'payment_intent.refunded':
                return $this->handleRefundedTransaction($transaction);

            default:
                return $this->response(200, 'Evento Stripe ignorado', [
                    'type' => $eventType,
                    'payment_intent' => $paymentIntentId,
                ]);
        }
    }

    private function findTransactionByGeneratedPaymentId($paymentId): ?Transaction
    {
        $transactionData = $this->transactionDao
            ->findByField('generatedPaymentId', $paymentId);

        if (empty($transactionData)) {
            return null;
        }

        return new Transaction($transactionData);
    }

    private function response(int $status, string $message, $data = null): array
    {
        return ['status' => $status, 'message' => $message, 'data' => $data ];
    }
}
