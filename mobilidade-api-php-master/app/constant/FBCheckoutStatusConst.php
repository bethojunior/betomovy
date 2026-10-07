<?php

namespace app\constant;

class FBCheckoutStatusConst
{
  // Aguardando pagamento
  public const PENDING = 'pending';

  // Em processamento inicial (meio de pagamento sendo gerado)
  public const PENDING_GENERATION = 'pending_generation';

  // Finalizada com sucesso
  public const PAID = 'paid';

  // Encerrada sem cobrança
  public const CANCELED = 'canceled';
  public const REJECTED = 'rejected';

  // Em análise / disputa
  public const IN_DISPUTE = 'in_dispute';

  // Em processo de reembolso
  public const PENDING_REFUND = 'pending_refund';

  // Finalizada (reembolsada)
  public const REFUNDED = 'refunded';

  // Pagamento mal sucedido
  public const FAILED = 'failed';

  // Encerrada por expiração
  public const EXPIRED = 'expired';

  // Finalizada com sucesso (aprovada, mas não conciliada)
  public const APPROVED = 'approved';
}
