<?php
namespace app\utils;

use app\constant\TransactionConst;
use app\model\PaymentForm;

class Admin704AppsMapper
{
    /**
     * Mapeia o ID da forma de pagamento para o tipo esperado pela API do Admin704Apps.
     * 
     * @param int|null $paymentFormId
     * @return string
     */
    public static function mapPaymentMethod(?int $paymentFormId): string
    {
        $paymentForms = [
            PaymentForm::CREDIT_CARD => 'card',
            PaymentForm::PIX => 'pix'
        ];

        return $paymentForms[$paymentFormId] ?? 'unknown';
    }

    /**
     * Mapeia o status da transação para o status esperado pela API do Admin704Apps.
     * 
     * @param int $status
     * @return string
     */
    public static function mapStatus(int $status): string
    {
        $maps = [
            TransactionConst::COMPLETED => 'paid',
            TransactionConst::PENDENTE => 'pending',
            TransactionConst::REFUNDED => 'refunded',
            TransactionConst::REJECTED => 'cancelled'
        ];

        return $maps[$status] ?? 'pending';
    }
}