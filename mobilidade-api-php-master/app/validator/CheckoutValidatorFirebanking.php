<?php

namespace app\validator;

use app\constant\FBCheckoutStatusConst;
use app\exceptions\CheckoutCardException;
use app\validator\contracts\ICheckoutValidator;

class CheckoutValidatorFirebanking implements ICheckoutValidator
{
  private array $response = [];

  /**
   * @throws CheckoutCardException
   */
  public function validateTransactionResponse($status, $status_detail)
  {
    $this->response['status'] = $status;
    $this->response['status_detail'] = $status_detail;

    switch ($status) {

      // Sucesso
      case FBCheckoutStatusConst::PAID:
      case FBCheckoutStatusConst::APPROVED:
        return;

        // Processamento
      case FBCheckoutStatusConst::PENDING:
        return;
      case FBCheckoutStatusConst::PENDING_GENERATION:
      case FBCheckoutStatusConst::IN_DISPUTE:
        throw new CheckoutCardException(1161, $this->response);

        // Reembolso
      case FBCheckoutStatusConst::PENDING_REFUND:
      case FBCheckoutStatusConst::REFUNDED:
        return;

        // Falhas definitivas
      case FBCheckoutStatusConst::REJECTED:
      case FBCheckoutStatusConst::FAILED:
        $this->validateStatusRejected($status_detail);
        break;

      case FBCheckoutStatusConst::CANCELED:
      case FBCheckoutStatusConst::EXPIRED:
        throw new CheckoutCardException(1191, $this->response);

      default:
        throw new CheckoutCardException(1156, $this->response);
    }
  }

  /**
   * @throws CheckoutCardException
   */
  private function validateStatusRejected($errorCode)
  {
    // Se vier um código conhecido do gateway, repassa
    if (is_numeric($errorCode)) {
      throw new CheckoutCardException((int) $errorCode, $this->response);
    }

    // Fallback genérico
    throw new CheckoutCardException(1191, $this->response);
  }
}
