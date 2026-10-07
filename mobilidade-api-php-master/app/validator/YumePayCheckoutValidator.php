<?php

namespace app\validator;

use app\constant\TransactionConst;
use app\exceptions\CheckoutCardException;
use app\exceptions\CheckoutServiceException;
use app\validator\contracts\ICheckoutValidator;

/**
 * Validator para respostas do intermediador YumePay.
 *
 * Obs: A 704apps usa (status, status_detailed) padronizados pelo feedTransaction
 * no CheckoutIntermediaryService. Aqui a regra é simples:
 * - estados de sucesso (PRE_CAPTURED / CONFIRMED) passam
 * - caso contrário: erro genérico
 */
class YumePayCheckoutValidator implements ICheckoutValidator
{
    /**
     * @throws CheckoutCardException
     * @throws CheckoutServiceException
     */
    public function validateTransactionResponse($status, $status_detail)
    {
        // Se o status veio vazio, significa falha de comunicação/integração
        if (empty($status)) {
            throw new CheckoutServiceException(150, [
                'status' => $status,
                'status_detail' => $status_detail,
            ]);
        }

        // Estados aceitos no fluxo preauth/capture.
        // Aceita tanto status textual da adquirente quanto status interno da 704apps.
        $accepted = [
            'PRE_CAPTURED',
            'CONFIRMED',
            (string) TransactionConst::PENDENTE,
            (string) TransactionConst::COMPLETED,
        ];

        if (in_array((string) $status, $accepted, true)) {
            return true;
        }

        // Se a YumePay retornar um status de erro/negado, tratamos como recusa
        throw new CheckoutCardException(1156, [
            'status' => $status,
            'status_detail' => $status_detail,
        ]);
    }
}

