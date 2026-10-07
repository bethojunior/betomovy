<?php

namespace app\constant;

class ZafiraConst
{
    public const PUBLIC_ERROR = 'Algum dado está incorreto. Verifique e tente novamente.';

    public const BALANCE_FLOW_TYPE_NAME = 'SAÍDA POR VALIDAÇÃO DE CADASTRO ZAFIRA';

    public const DEFAULT_VALIDATION_PRICE = 0.99;

    public const DEDUP_MINUTES = 5;

    /** Referência em balanceFlow.tripReference para deduplicar cobrança por CPF. */
    public const DOCUMENT_TRIP_REFERENCE_PREFIX = 'zafira:cpf:';

    public const GUARDIAN_VALIDATE_PATH = '/validar-dados';

    public const HTTP_TIMEOUT_SECONDS = 30;
}
