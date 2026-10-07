<?php

namespace app\constant;
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/12/2018
 * Time: 17:22
 */
class CheckoutStatusDetailConst
{
    const CC_REJECTED_OTHER_REASON = "cc_rejected_other_reason";
    const CC_REJECTED_CALL_FOR_AUTHORIZE = "cc_rejected_call_for_authorize";
    const CC_REJECTED_INSUFFICIENT_AMOUNT = "cc_rejected_insufficient_amount";
    const CC_REJECTED_BAD_FILLED_CARD_NUMBER = "cc_rejected_bad_filled_card_number";
    const CC_REJECTED_BAD_FILLED_SECURITY_CODE = "cc_rejected_bad_filled_security_code";
    const CC_REJECTED_BAD_FILLED_DATE = "cc_rejected_bad_filled_date";
    const CC_REJECTED_BAD_FILLED_OTHER = "cc_rejected_bad_filled_other";
    const CC_REJECTED_BLACKLIST = "cc_rejected_blacklist";
    const CC_REJECTED_CARD_DISABLED = "cc_rejected_card_disabled";
    const CC_REJECTED_CARD_ERROR = "cc_rejected_card_error";
    const CC_REJECTED_DUPLICATED_PAYMENT = "cc_rejected_duplicated_payment";
    const CC_REJECTED_HIGH_RISK = "cc_rejected_high_risk";
    const CC_REJECTED_INVALID_INSTALLMENTS = "cc_rejected_invalid_installments";
    const CC_REJECTED_MAX_ATTEMPTS = "cc_rejected_max_attempts";
}