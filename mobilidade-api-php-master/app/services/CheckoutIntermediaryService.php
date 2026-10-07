<?php

namespace app\services;

use app\constant\FinancialIntermediaryConst;
use app\constant\TransactionConst;
use app\utils\FormatValue;
use app\utils\Headers;
use app\model\PaymentForm;
use app\model\Transaction;

class CheckoutIntermediaryService
{
    private $transactionId;

    public function feedTransactionByIntermediaryResponse(
        $intermediaryId,
        $paymentData,
        $paymentFormId = null,
        $transactionId = null,
        $transactionTypeId = null
    ) {
        $this->transactionId = $transactionId;
        switch ($intermediaryId) {
            case FinancialIntermediaryConst::MERCADO_PAGO:
                return $this->feedByMercadoPago($intermediaryId, $paymentData, $paymentFormId);
            case FinancialIntermediaryConst::CIELO:
                return $this->feedByCielo($intermediaryId, $paymentData, $paymentFormId);
            case FinancialIntermediaryConst::RECEBE_AQUI:
                return $this->feedByRecebeAqui($intermediaryId, $paymentData, $paymentFormId);
            case FinancialIntermediaryConst::IUGU:
                return $this->feedByIugu($intermediaryId, $paymentData, $paymentFormId);
            case FinancialIntermediaryConst::INTEGRAPAY:
                return $this->feedByIntegraPay($intermediaryId, $paymentData, $paymentFormId);
            case FinancialIntermediaryConst::PAY704:
                return $this->feedBy704Pay($intermediaryId, $paymentData, $paymentFormId);
            case FinancialIntermediaryConst::GETNET:
                return $this->feedByGetnet($intermediaryId, $paymentData, $paymentFormId);
            case FinancialIntermediaryConst::REDE:
                return $this->feedByRede($intermediaryId, $paymentData, $paymentFormId);
            case FinancialIntermediaryConst::ZSPAY:
                return $this->feedByZspay($intermediaryId, $paymentData, $paymentFormId);
            case FinancialIntermediaryConst::PAYSOON:
                return $this->feedByPaySoon($intermediaryId, $paymentData, $paymentFormId);
            case FinancialIntermediaryConst::COTABANK:
                return $this->feedByCotaBank($intermediaryId, $paymentData, $paymentFormId);
            case FinancialIntermediaryConst::EPAG:
                return $this->feedByEpag($paymentData, $paymentFormId, $transactionTypeId);
            case FinancialIntermediaryConst::YUMEPAY:
                return $this->feedByYumePay($intermediaryId, $paymentData, $paymentFormId, $transactionTypeId);
            case FinancialIntermediaryConst::FIREBANKING:
                return $this->feedByFirebanking($paymentData, $paymentFormId, $transactionTypeId);
        }
    }

    /**
     * Mapeia resposta do adapter `YumePayCheckout` para `Transaction`.
     *
     * Convenção adotada:
     * - `generatedPaymentId` = online_sale_id (pk no endpoint da YumePay)
     * - `status` = sale_status (PRE_CAPTURED/CONFIRMED)
     */
    private function feedByYumePay($intermediaryId, $payment, $paymentFormId, $transactionTypeId = null): Transaction
    {
        $transaction = new Transaction;

        $onlineSaleId =
            $payment['data']['online_sale_id']
            ?? $payment['online_sale_id']
            ?? null;

        $saleStatus =
            $payment['data']['sale_status']
            ?? $payment['sale_status']
            ?? null;

        // Tenta inferir valor do payload do adapter, se presente.
        $value = null;
        // O adapter pode retornar formatos diferentes:
        // 1) reserveAmount()/creditPayment: meta.amount.value e meta.pre_capture.*
        // 2) pixPayment: meta.request.value (centavos)
        // 3) consultas de status: data.amount/amount (normalmente em centavos)
        if (isset($payment['meta']['amount']['value'])) {
            $value = (float) $payment['meta']['amount']['value'];
        } elseif (isset($payment['meta']['pre_capture']['meta']['amount']['value'])) {
            $value = (float) $payment['meta']['pre_capture']['meta']['amount']['value'];
        } elseif (isset($payment['meta']['pre_capture']['request']['value'])) {
            $value = ((int) $payment['meta']['pre_capture']['request']['value']) * 0.01;
        } elseif (isset($payment['meta']['pre_capture']['meta']['pre_capture']['request']['value'])) {
            $value = ((int) $payment['meta']['pre_capture']['meta']['pre_capture']['request']['value']) * 0.01;
        } elseif (isset($payment['meta']['request']['value'])) {
            $value = ((int) $payment['meta']['request']['value']) * 0.01;
        } elseif (isset($payment['data']['amount']) && is_numeric($payment['data']['amount'])) {
            $amount = (float) $payment['data']['amount'];
            $value = ($amount >= 100 && floor($amount) == $amount) ? $amount * 0.01 : $amount;
        } elseif (isset($payment['amount']) && is_numeric($payment['amount'])) {
            $amount = (float) $payment['amount'];
            $value = ($amount >= 100 && floor($amount) == $amount) ? $amount * 0.01 : $amount;
        }

        $statusMap = [
            'CONFIRMED'    => TransactionConst::COMPLETED,
            'PAID'         => TransactionConst::COMPLETED,
            'SUCCESS'      => TransactionConst::COMPLETED,
            'PRE_CAPTURED' => TransactionConst::PENDENTE,
            'DECLINED'     => TransactionConst::DANIED,
            'DENIED'       => TransactionConst::DANIED,
            'REFUSED'      => TransactionConst::DANIED,
            'FAILED'       => TransactionConst::DANIED,
            'EXPIRED'      => TransactionConst::DANIED,
            'CANCELED'     => TransactionConst::REJECTED,
            'CANCELLED'    => TransactionConst::REJECTED,
        ];

        $transaction
            ->setIntermediaryId($intermediaryId)
            ->setTransactionStatusId(
                $statusMap[strtoupper((string) $saleStatus)] ?? TransactionConst::PENDENTE
            )
            ->setStatusDetailed($saleStatus ?? ($payment['message'] ?? ''))
            ->setStatus($saleStatus)
            ->setPaymentFormId($paymentFormId)
            ->setGeneratedPaymentId($onlineSaleId)
            ->setIntermediaryFee(0)
            ->setTypeId($transactionTypeId)
            ->setUserId(Headers::getUserId());

        if (!is_null($value)) {
            $transaction->setValue($value);
        }

        if ($paymentFormId === PaymentForm::PIX) {
            $qrCode = $payment['data']['pix_payload'] ?? $payment['pix_payload'] ?? null;
            if ($qrCode) {
                $transaction->setPaymentCode($qrCode);
            }
        }

        if ($this->transactionId) {
            $transaction->setIdTransaction($this->transactionId);
        }

        return $transaction;
    }

    private function feedByMercadoPago($intermediaryId, $payment, $paymentFormId): Transaction
    {
        $transaction = new Transaction;

        $statusMap = [
            'approved'     => TransactionConst::COMPLETED,
            'refunded'     => TransactionConst::REFUNDED,
            'charged_back' => TransactionConst::REFUNDED,
            'rejected'     => TransactionConst::DANIED,
            'cancelled'    => TransactionConst::REJECTED,
            'pending'      => TransactionConst::PENDENTE,
            'authorized'   => TransactionConst::PENDENTE,
            'in_process'   => TransactionConst::PENDENTE,
            'in_mediation' => TransactionConst::PENDENTE,
        ];

        $transaction
            ->setIntermediaryId($intermediaryId)
            ->setTransactionStatusId(
                $statusMap[$payment['status']] ?? TransactionConst::PENDENTE
            )
            ->setStatusDetailed($payment['status_detail'])
            ->setStatus($payment['status'])
            ->setPaymentFormId($paymentFormId)
            ->setGeneratedPaymentId($payment['id'])
            ->setValue($payment['transaction_amount'])
            ->setIntermediaryFee($payment['fee_details'][0]->amount ?? 0)
            ->setUserId(Headers::getUserId());

        if ($paymentFormId === PaymentForm::PIX) {
            $qrCode = $payment['point_of_interaction']['transaction_data']['qr_code'] ?? null;
            if ($qrCode) {
                $transaction->setPaymentCode($qrCode);
            }
        }

        if ($this->transactionId) {
            $transaction->setIdTransaction($this->transactionId);
        }

        return $transaction;
    }

    private function feedByCielo($intermediaryId, $payment, $paymentFormId): Transaction
    {
        $statusMap = [
            2  => TransactionConst::COMPLETED,
            10 => TransactionConst::REFUNDED,
            3  => TransactionConst::DANIED,
            13 => TransactionConst::REJECTED,
            1  => TransactionConst::PENDENTE,
            12 => TransactionConst::PENDENTE,
        ];

        $cieloStatus = $payment['payment']['status'];

        $transaction = new Transaction;

        $transaction
            ->setIntermediaryId($intermediaryId)
            ->setTransactionStatusId(
                $statusMap[$cieloStatus] ?? TransactionConst::REJECTED
            )
            ->setStatusDetailed($payment['payment']['returnCode'])
            ->setStatus($cieloStatus)
            ->setPaymentFormId($paymentFormId)
            ->setGeneratedPaymentId($payment['payment']['paymentId'])
            ->setValue($payment['payment']['amount'] * 0.01)
            ->setIntermediaryFee($payment['payment']['serviceTaxAmount'] ?? 0)
            ->setUserId(Headers::getUserId());

        if ($this->transactionId) {
            $transaction->setIdTransaction($this->transactionId);
        }

        return $transaction;
    }

    private function feedByRecebeAqui($intermediaryId, $paymentData, $paymentFormId)
    {
        $transaction = new Transaction;

        if ($this->transactionId) {
            $transaction
                ->setIdTransaction($this->transactionId);

            return $transaction;
        }

        $transaction
            ->setIntermediaryId($intermediaryId)
            ->setTransactionStatusId(
                $paymentData['pagamentoEfetuado'] == 1 ?
                    TransactionConst::COMPLETED : TransactionConst::REJECTED
            )
            ->setStatusDetailed($paymentData['mensagem'])
            ->setStatus($paymentData['pagamentoEfetuado'])
            ->setPaymentFormId($paymentFormId)
            ->setGeneratedPaymentId($paymentData['idPagamento'])
            ->setIntermediaryFee(0)
            ->setUserId(Headers::getUserId());

        if (isset($paymentData['valor']))
            $transaction
                ->setValue($paymentData['valor']);

        if ($this->transactionId)
            $transaction
                ->setIdTransaction($this->transactionId);

        return $transaction;
    }

    private function feedByIugu($intermediaryId, $payment, $paymentFormId)
    {
        $transaction = new Transaction;

        $transaction
            ->setIntermediaryId($intermediaryId)
            ->setTransactionStatusId(
                $payment['status'] == 'paid' ?
                    TransactionConst::COMPLETED : TransactionConst::REJECTED
            )
            ->setStatusDetailed($payment['status_detailed'])
            ->setStatus($payment['status'])
            ->setPaymentFormId($paymentFormId)
            ->setGeneratedPaymentId($payment['id'])
            ->setValue(
                $payment['total_cents'] * 0.01
            )
            ->setIntermediaryFee(
                isset($payment['taxes_paid_cents']) ?
                    $payment['taxes_paid_cents'] * 0.01 : 0
            )
            ->setUserId(Headers::getUserId());

        if ($this->transactionId)
            $transaction
                ->setIdTransaction($this->transactionId);

        return $transaction;
    }

    private function feedByIntegraPay($intermediaryId, $payment, $paymentFormId)
    {
        $transaction = new Transaction;

        $transaction = empty($payment['refund']) ?
            $transaction
            ->setIntermediaryId($intermediaryId)
            ->setStatus($payment['status'])
            ->setPaymentFormId($paymentFormId)
            ->setGeneratedPaymentId($payment['id'])
            ->setValue(
                $payment['valor']
            )
            ->setIntermediaryFee(
                $payment['taxa'] ?? 0
            )
            ->setUserId(Headers::getUserId())
            :
            $transaction
            ->setStatus($payment['status']);

        if ($this->transactionId) {
            $transaction
                ->setIdTransaction($this->transactionId);
        }

        return $transaction;
    }

    private function feedBy704Pay($intermediaryId, $payment, $paymentFormId)
    {

        switch ($paymentFormId) {
            case PaymentForm::PIX:
                return $this->Pix704pay($payment);
            case PaymentForm::CREDIT_CARD:
                return $this->CreditCard704pay($intermediaryId, $payment, $paymentFormId);
        }
    }

    function CreditCard704pay($intermediaryId, $payment, $paymentFormId)
    {
        $transaction = new Transaction;
        $transaction = !empty($payment['response']->payment_status_id) ?
            $transaction
            ->setIntermediaryId($intermediaryId)
            ->setStatus($payment['response']->payment_status_id)
            ->setTransactionStatusId(
                $payment['status'] ?
                    TransactionConst::COMPLETED : TransactionConst::REJECTED
            )
            ->setPaymentFormId($paymentFormId)
            ->setGeneratedPaymentId($payment['response']->uuid)
            ->setValue(
                $payment['amount']
            )
            ->setIntermediaryFee(
                $payment['response']->internal_fees ?? 0
            )
            ->setUserId(Headers::getUserId())
            :
            $transaction
            ->setStatus($payment['response']->payment_status_id);

        if ($this->transactionId) {
            $transaction
                ->setIdTransaction($this->transactionId);
        }
        return $transaction;
    }

    function Pix704pay($response)
    {
        $transaction = new Transaction;
        $transaction
            ->setGeneratedPaymentId($response['response']->uuid)
            ->setValue($response['response']->amount / 100.0)
            ->setIntermediaryId(FinancialIntermediaryConst::PAY704)
            ->setTransactionStatusId(TransactionConst::PENDENTE)
            ->setStatusDetailed('PENDENTE')
            ->setPaymentFormId(PaymentForm::PIX)
            ->setUserId(Headers::getUserId())
            ->setIntermediaryFee(60 / 100.0);

        if ($this->transactionId)
            $transaction
                ->setIdTransaction($this->transactionId);

        return $transaction;
    }

    private function feedByGetnet($intermediaryId, $paymentData, $paymentFormId)
    {
        $transactionType = $paymentFormId == PaymentForm::CREDIT_CARD ?
            'credit' : 'debit';
        $messageDetailedAttribute = 'reason_message';

        if (!isset($paymentData[$transactionType])) {
            $transactionType = "{$transactionType}_cancel";
            $messageDetailedAttribute = 'message';
        }

        $transaction = new Transaction;

        if ($this->transactionId) {
            $transaction
                ->setIdTransaction($this->transactionId)
                ->setTransactionStatusId(
                    isset($paymentData['status']) && $paymentData['status'] == 'APPROVED' ?
                        TransactionConst::COMPLETED : TransactionConst::REJECTED
                )
                ->setStatusDetailed(
                    $paymentData[$transactionType]->$messageDetailedAttribute ??
                        ($paymentData['details'][0]
                            ->antifraud
                            ->description ??
                            $paymentData['details'][0]->description)
                )
                ->setStatus(
                    $paymentData['status'] ?? (
                        $paymentData['details'][0]
                        ->antifraud
                        ->status_code ?? $paymentData['details'][0]->error_code)
                );

            return $transaction;
        }

        $transaction
            ->setIntermediaryId($intermediaryId)
            ->setTransactionStatusId(
                isset($paymentData['status']) && $paymentData['status'] == 'APPROVED' ?
                    TransactionConst::COMPLETED : TransactionConst::REJECTED
            )
            ->setStatusDetailed(
                $paymentData[$transactionType]->reason_message ??
                    ($paymentData['details'][0]
                        ->antifraud
                        ->description ??
                        $paymentData['details'][0]->description)
            )
            ->setStatus(
                $paymentData['status'] ?? (
                    $paymentData['details'][0]
                    ->antifraud
                    ->status_code ?? $paymentData['details'][0]->error_code)
            )
            ->setPaymentFormId($paymentFormId)
            ->setGeneratedPaymentId($paymentData['payment_id'] ?? null)
            ->setIntermediaryFee(0)
            ->setValue(($paymentData['amount'] ?? 0) * 0.01)
            ->setUserId(Headers::getUserId());

        if ($this->transactionId)
            $transaction
                ->setIdTransaction($this->transactionId);

        return $transaction;
    }

    private function feedByRede($intermediaryId, $paymentData, $paymentFormId)
    {
        $transaction = new Transaction;
        $transaction
            ->setIntermediaryId($intermediaryId)
            ->setTransactionStatusId(
                $paymentData['status_code'] == "00" ?
                    TransactionConst::COMPLETED : TransactionConst::REJECTED
            )
            ->setStatusDetailed($paymentData['return_message'])
            ->setStatus($paymentData['status_code'])
            ->setPaymentFormId($paymentFormId)
            ->setGeneratedPaymentId($paymentData['tid'])
            ->setValue($paymentData['amount'] * 0.01)
            ->setIntermediaryFee(0)
            ->setUserId(Headers::getUserId());

        if ($this->transactionId)
            $transaction
                ->setIdTransaction($this->transactionId);

        return $transaction;
    }

    private function feedByZspay($intermediaryId, $paymentData, $paymentFormId): Transaction
    {
        $transaction = new Transaction;
        $transaction
            ->setIntermediaryId($intermediaryId)
            ->setTransactionStatusId(
                $paymentData['success'] ?
                    TransactionConst::COMPLETED : TransactionConst::REJECTED
            )
            ->setStatusDetailed($paymentData['pedido']->status_pedido_id ?? $paymentData['message'] . '(ESTORNO)')
            ->setStatus($paymentData['success'])
            ->setPaymentFormId($paymentFormId)
            ->setGeneratedPaymentId($paymentData['pedido']->id ?? $transaction->getGeneratedPaymentId())
            ->setValue($paymentData['pedido']->valor_bruto ?? $transaction->getValue())
            ->setIntermediaryFee(0)
            ->setUserId(Headers::getUserId());

        if ($this->transactionId)
            $transaction
                ->setIdTransaction($this->transactionId);

        return $transaction;
    }

    private function feedByPaySoon($intermediaryId, $paymentData, $paymentFormId): Transaction
    {
        $transaction = new Transaction;
        $value = $transaction->getValue();
        if (!empty($paymentData['data']->valor)) {
            $value = FormatValue::convertToFloat($paymentData['data']->valor);
        }

        $transaction
            ->setIntermediaryId($intermediaryId)
            ->setTransactionStatusId(
                $paymentData['responseStatus'][0]->status == 'ok' ?
                    TransactionConst::COMPLETED : TransactionConst::REJECTED
            )
            ->setStatusDetailed($paymentData['responseStatus'][0]->mensagem ?? $paymentData['responseStatus'][0]->mensagem . '(ESTORNO)')
            ->setStatus($paymentData['responseStatus'][0]->status == 'ok')
            ->setPaymentFormId($paymentFormId)
            ->setGeneratedPaymentId($paymentData['data']->id ?? $transaction->getGeneratedPaymentId())
            ->setValue($value)
            ->setIntermediaryFee(0)
            ->setUserId(Headers::getUserId());

        if ($this->transactionId)
            $transaction
                ->setIdTransaction($this->transactionId);

        return $transaction;
    }


    private function feedByCotaBank($intermediaryId, $paymentData, $paymentFormId): Transaction
    {
        $transaction = new Transaction;
        $value = $transaction->getValue();

        if (!empty($paymentData['value'])) {
            $value = $paymentData['value'];
        }
        $transaction
            ->setIntermediaryId($intermediaryId)
            ->setTransactionStatusId(
                $paymentData['status'] == '1' ?
                    TransactionConst::COMPLETED : TransactionConst::REJECTED
            )
            ->setStatusDetailed($paymentData['message'] ?? $paymentData['message'] . '(ESTORNO)')
            ->setStatus($paymentData['status'])
            ->setPaymentFormId($paymentFormId)
            ->setGeneratedPaymentId($paymentData['tid'] ?? $transaction->getGeneratedPaymentId())
            ->setValue($value)
            ->setIntermediaryFee(0)
            ->setUserId(Headers::getUserId());

        if ($this->transactionId)
            $transaction
                ->setIdTransaction($this->transactionId);

        return $transaction;
    }

    private function feedByEpag($payment, $paymentFormId, $transactionTypeId): Transaction
    {
        $body = $payment["body"];

        switch ($paymentFormId) {
            case PaymentForm::PIX:
                $transaction = $this->EpagPix($body, $transactionTypeId);
                break;
            case PaymentForm::CREDIT_CARD:
                $transaction = $this->EpagCreditCard($body, $payment);
                break;
        }
        return $transaction;
    }

    private function feedByFirebanking($payment, $paymentFormId, $transactionTypeId): Transaction
    {
        $transaction = (new Transaction)
            ->setIntermediaryId(FinancialIntermediaryConst::FIREBANKING)
            ->setTransactionStatusId($payment['status'])
            ->setStatus($payment['real_status'])
            ->setPaymentFormId($paymentFormId)
            ->setGeneratedPaymentId($payment['id'])
            ->setValue($payment['amount'])
            ->setIntermediaryFee($payment['calculatedFee'] ?? 0)
            ->setTypeId($transactionTypeId)
            ->setUserId(Headers::getUserId())
            ->setStatusDetailed($payment['identifier'] ?? '');

        $pixPayment = $payment['paymentData'] ?? [];

        /**
         * PIX
         */
        if (
            $paymentFormId === PaymentForm::PIX &&
            !empty($pixPayment['pixKey'])
        ) {
            $transaction->setPaymentCode($pixPayment['pixKey']);
        }

        if ($this->transactionId) {
            $transaction->setIdTransaction($this->transactionId);
        }

        return $transaction;
    }

    private function EpagPix($body, $transactionTypeId)
    {
        $transaction = new Transaction;
        $transaction
            ->setIntermediaryId(FinancialIntermediaryConst::EPAG)
            ->setTransactionStatusId(
                $body["status"] == 1 ?
                    TransactionConst::PENDENTE : TransactionConst::REJECTED
            )
            ->setStatusDetailed($body['returnCode'])
            ->setStatus($body["status"])
            ->setPaymentFormId(PaymentForm::PIX)
            ->setGeneratedPaymentId($body['paymentId'])
            ->setValue(
                $body["amount"] * 0.01
            )
            ->setIntermediaryFee(
                $body["fees"] ?? 0
            )
            ->setPaymentCode($body["qrCodeContent"])
            ->setTypeId($transactionTypeId)
            ->setUserId(Headers::getUserId());

        if ($this->transactionId)
            $transaction
                ->setIdTransaction($this->transactionId);

        return $transaction;
    }

    private function EpagCreditCard($body, $payment)
    {
        $transaction = new Transaction;
        $transaction
            ->setIntermediaryId(FinancialIntermediaryConst::EPAG)
            ->setTransactionStatusId(
                $body["status"] == 3 ?
                    TransactionConst::COMPLETED : TransactionConst::REJECTED
            )
            ->setStatusDetailed($payment['payment']['returnCode'])
            ->setStatus($body["status"])
            ->setPaymentFormId(PaymentForm::CREDIT_CARD)
            ->setGeneratedPaymentId($body['paymentId'])
            ->setValue(
                $body["amount"] * 0.01
            )
            ->setIntermediaryFee(
                $body["fees"] ?? 0
            )
            ->setUserId(Headers::getUserId());

        if ($this->transactionId)
            $transaction
                ->setIdTransaction($this->transactionId);

        return $transaction;
    }
}
