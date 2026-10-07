<?php

namespace app\exceptions;

use Exception;

class RateLimitException extends Exception {
     protected $keyCode = "RATE_LIMIT_EXCEEDED";
}
