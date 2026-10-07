<?php

namespace app\exceptions;
use Exception;

class AcquirerFallbackException extends Exception {
    protected $keyCode = 'acquirer_fallback';
}